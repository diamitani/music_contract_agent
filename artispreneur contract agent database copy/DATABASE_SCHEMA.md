# Database Schema Guide

For uploading the Artispreneur Music Contract Library to Supabase, AWS RDS,
Google Cloud SQL, or any other SQL database.

## Quick start

1. **For immediate use** (no normalization): Just upload
   `contracts_export.csv` or `contracts_export.xlsx` directly as a single
   table. The data is already flattened, and simple queries will work fine.

2. **For production** (proper normalization): Follow the schema below to
   split into 4-5 related tables, then migrate the CSV data into them using
   SQL or your database UI.

3. **Supabase shortcut**: Supabase's CSV import in the dashboard can auto-
   create a table from `contracts_export.csv` in seconds. Start there, then
   run the normalization SQL if you want relational structure later.

## Normalized schema (PostgreSQL / Supabase / AWS RDS)

### Table 1: contracts (main table)

```sql
CREATE TABLE contracts (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('sourced', 'original', 'adapted')),
  category VARCHAR(100) NOT NULL,
  template_file VARCHAR(255),
  questionnaire_file VARCHAR(255),
  github_yaml_link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_contracts_category ON contracts(category);
CREATE INDEX idx_contracts_status ON contracts(status);
```

### Table 2: contract_parties (one row per party per contract)

```sql
CREATE TABLE contract_parties (
  id SERIAL PRIMARY KEY,
  contract_id VARCHAR(255) NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  party_name VARCHAR(255) NOT NULL,
  position INT NOT NULL,  -- order they appear (1, 2, 3...)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contract_parties_contract_id ON contract_parties(contract_id);
```

### Table 3: contract_rights (many-to-many: contract ↔ rights affected)

```sql
CREATE TABLE contract_rights (
  id SERIAL PRIMARY KEY,
  contract_id VARCHAR(255) NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  right_type VARCHAR(100) NOT NULL CHECK (right_type IN (
    'composition_publishing',
    'sound_recording_master',
    'name_image_likeness',
    'income_royalty_recoupment',
    'exclusivity_noncompete',
    'term_renewal_termination',
    'approvals_creative_control',
    'liability_indemnification_insurance',
    'dispute_resolution_governing_law',
    'confidentiality'
  )),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_contract_rights_unique ON contract_rights(contract_id, right_type);
```

### Table 4: contract_details (one row per contract — all the text fields)

```sql
CREATE TABLE contract_details (
  contract_id VARCHAR(255) PRIMARY KEY REFERENCES contracts(id) ON DELETE CASCADE,
  money_fields TEXT,  -- pipe-separated list
  rights_grant_notes TEXT,  -- pipe-separated list
  control_fields TEXT,  -- pipe-separated list
  intake_questions TEXT,  -- pipe-separated list
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table 5: contract_risk_flags (one row per risk flag per contract)

```sql
CREATE TABLE contract_risk_flags (
  id SERIAL PRIMARY KEY,
  contract_id VARCHAR(255) NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  severity VARCHAR(50) CHECK (severity IN ('green', 'yellow', 'red', 'always_attorney')),
  text TEXT NOT NULL,
  position INT NOT NULL,  -- order they appear (1, 2, 3...)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contract_risk_flags_contract_id ON contract_risk_flags(contract_id);
CREATE INDEX idx_contract_risk_flags_severity ON contract_risk_flags(severity);
```

## Migration script: CSV → normalized schema

If you've already imported `contracts_export.csv` into a single flat table
called `contracts_flat`, you can migrate to the normalized schema with SQL:

```sql
-- 1. Create the normalized tables (use the CREATE TABLE statements above)

-- 2. Migrate contracts_flat → contracts
INSERT INTO contracts (id, title, status, category, template_file, questionnaire_file, github_yaml_link)
SELECT DISTINCT
  id,
  title,
  status,
  category,
  template_file,
  questionnaire_file,
  github_yaml_link
FROM contracts_flat;

-- 3. Migrate parties (split the pipe-separated "parties" column)
WITH split_parties AS (
  SELECT
    id,
    trim(unnest(string_to_array(parties, ' | '))) AS party_name,
    row_number() OVER (PARTITION BY id ORDER BY unnest) AS pos
  FROM contracts_flat
)
INSERT INTO contract_parties (contract_id, party_name, position)
SELECT id, party_name, pos
FROM split_parties
WHERE party_name != '';

-- 4. Migrate rights_affected (split pipe-separated)
WITH split_rights AS (
  SELECT
    id,
    trim(unnest(string_to_array(rights_affected, ' | '))) AS right_type
  FROM contracts_flat
)
INSERT INTO contract_rights (contract_id, right_type)
SELECT id, right_type
FROM split_rights
WHERE right_type != ''
ON CONFLICT DO NOTHING;

-- 5. Migrate details (one row per contract)
INSERT INTO contract_details (contract_id, money_fields, rights_grant_notes, control_fields, intake_questions)
SELECT id, money_fields, rights_grant_notes, control_fields, intake_questions
FROM contracts_flat;

-- 6. Migrate risk flags (split risk_1_severity, risk_1_text, risk_2_severity, ...)
WITH risk_unpacked AS (
  SELECT
    id,
    1 AS pos,
    risk_1_severity AS severity,
    risk_1_text AS text
  FROM contracts_flat
  WHERE risk_1_text IS NOT NULL AND risk_1_text != ''
  UNION ALL
  SELECT
    id,
    2,
    risk_2_severity,
    risk_2_text
  FROM contracts_flat
  WHERE risk_2_text IS NOT NULL AND risk_2_text != ''
  UNION ALL
  SELECT
    id,
    3,
    risk_3_severity,
    risk_3_text
  FROM contracts_flat
  WHERE risk_3_text IS NOT NULL AND risk_3_text != ''
  -- ... repeat for however many risk_N columns exist (currently 3-4 per contract max)
)
INSERT INTO contract_risk_flags (contract_id, severity, text, position)
SELECT id, severity, text, pos
FROM risk_unpacked
WHERE severity IS NOT NULL;

-- 7. Verify
SELECT COUNT(*) FROM contracts;  -- Should be 30
SELECT COUNT(*) FROM contract_risk_flags;  -- Should be ~100+ (varies by contract)
SELECT COUNT(*) FROM contract_parties;  -- Should be ~60 (mostly 2 per contract)
SELECT COUNT(*) FROM contract_rights;  -- Should be ~150+
```

## Useful queries after normalization

### Find all contracts that affect "composition_publishing" rights
```sql
SELECT DISTINCT c.id, c.title, c.category
FROM contracts c
JOIN contract_rights cr ON c.id = cr.contract_id
WHERE cr.right_type = 'composition_publishing'
ORDER BY c.title;
```

### Find all contracts with red or always_attorney risk flags
```sql
SELECT DISTINCT c.id, c.title, crf.severity, crf.text
FROM contracts c
JOIN contract_risk_flags crf ON c.id = crf.contract_id
WHERE crf.severity IN ('red', 'always_attorney')
ORDER BY c.title, crf.position;
```

### Search contracts by category and filter by status
```sql
SELECT c.id, c.title, c.status, COUNT(crf.id) AS risk_count
FROM contracts c
LEFT JOIN contract_risk_flags crf ON c.id = crf.contract_id
WHERE c.category = 'licensing' AND c.status IN ('sourced', 'original')
GROUP BY c.id, c.title, c.status
ORDER BY c.title;
```

### Find contracts involving a specific party type
```sql
SELECT DISTINCT c.id, c.title, cp.party_name
FROM contracts c
JOIN contract_parties cp ON c.id = cp.contract_id
WHERE LOWER(cp.party_name) LIKE '%artist%'
ORDER BY c.title;
```

## Deployment steps

1. **Supabase**:
   - Create a new project (or use an existing Postgres database).
   - Use the Table Editor UI → New Table, or run the CREATE TABLE statements
     in the SQL editor.
   - CSV import: hover over a table → Import data → `contracts_export.csv`.

2. **AWS RDS (PostgreSQL)**:
   - Use AWS Database Migration Service or psql directly.
   - `psql -h your-endpoint.rds.amazonaws.com -U postgres -d your_db < schema.sql`
   - Then copy CSV: `\COPY contracts_flat FROM 'contracts_export.csv' WITH (FORMAT csv, HEADER true);`

3. **Google Cloud SQL (PostgreSQL)**:
   - Cloud SQL Admin API → create an instance.
   - Cloud Shell: `gcloud sql connect your-instance --user=postgres`
   - Run the CREATE TABLE and migration SQL above.

4. **Local PostgreSQL development**:
   ```bash
   psql -U postgres
   CREATE DATABASE artispreneur_contracts;
   \c artispreneur_contracts
   \i schema.sql
   \COPY contracts_flat FROM 'contracts_export.csv' WITH (FORMAT csv, HEADER);
   -- Then run migration SQL above
   ```

## Keep it in sync

Every time you regenerate `contracts_export.csv` or `.xlsx` (via
`scripts/export_to_spreadsheet.py`), you can either:

- **Option 1**: Re-import the flat CSV into your database, overwriting the
  old data.
- **Option 2**: Write a small migration script (e.g. a Python script that
  parses the new CSV, checks for diff, and updates only changed rows).

For now, Option 1 is simpler — just delete all rows and re-import. As your
data grows, you'll want Option 2.
