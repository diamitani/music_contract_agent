# Database & Spreadsheet Quick Start

The Artispreneur Music Contract Library can be exported to spreadsheet or
database formats for use in any data system — Supabase, AWS RDS, Google
Sheets, Airtable, Zapier workflows, etc.

## Generate the exports

```bash
# Install dependencies (includes openpyxl for Excel)
pip install -r requirements.txt

# Generate both CSV and XLSX exports
python3 scripts/export_to_spreadsheet.py
```

Output files in `outputs/`:
- `contracts_export.xlsx` — Excel workbook with formatted, frozen header row
- `contracts_export.csv` — CSV version (same data, easier to import)

Both contain identical flattened data: 30 rows (one per contract), with
complex fields (arrays, risk flags) split into separate columns.

## Use the spreadsheet directly

### Google Sheets
1. Google Drive → New → File upload → `contracts_export.xlsx`
2. Google Sheets → File → Open → find the uploaded file
3. Done — now you have a live sheet you can share, comment on, filter

### Excel / LibreOffice Calc
- Download `contracts_export.xlsx` and open it locally
- The header row is frozen for easy scrolling
- Use built-in filters to search by category, status, risk severity, etc.

### Airtable
1. Airtable → Base → Add table → Import → CSV/Excel
2. Upload `contracts_export.csv` or `.xlsx`
3. Airtable auto-creates columns and links based on content

### Zapier / Integromat
- Upload the CSV to your workflow as a data source
- Use it to trigger workflows, send notifications, etc. when contract
  metadata changes

## Upload to a database (Supabase, AWS RDS, Google Cloud SQL)

### Quick path: Flat table (easiest)

1. **Create a table from CSV** (most cloud databases support this):
   - Supabase: SQL Editor → run `CREATE TABLE ... AS SELECT ...` or use CSV import UI
   - AWS RDS: psql or use the AWS console's import tool
   - Google Cloud SQL: Cloud SQL Admin → import CSV

2. **Or use the Python sync script** (for PostgreSQL-compatible databases):

   ```bash
   # Install database dependencies
   pip install -r requirements-db.txt

   # Set your database connection string
   export DATABASE_URL="postgresql://user:password@host:5432/dbname"

   # Sync in flat mode (one big table)
   python3 scripts/sync_to_database.py --mode flat

   # Done — your contracts table is now populated
   ```

   **Supabase example**:
   ```bash
   # Find your connection string in Supabase dashboard → Settings → Database
   export DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"
   python3 scripts/sync_to_database.py --mode flat
   ```

   **AWS RDS example**:
   ```bash
   export DATABASE_URL="postgresql://admin:password@your-db.rds.amazonaws.com:5432/contracts_db"
   python3 scripts/sync_to_database.py --mode flat
   ```

### Advanced path: Normalized schema (for production)

If you want relational tables (`contracts`, `contract_rights`,
`contract_risk_flags`, etc.) instead of one flat table:

```bash
python3 scripts/sync_to_database.py --mode normalized
```

This creates the full normalized schema and migrates the CSV data into it.
See `DATABASE_SCHEMA.md` for the table definitions and useful queries.

## Keep it in sync

Every time you update the contract library (add a new contract, edit an
existing one, change risk flags):

```bash
# Regenerate the exports
python3 scripts/export_to_spreadsheet.py

# Re-sync to your database (either mode)
python3 scripts/sync_to_database.py --mode flat
# or
python3 scripts/sync_to_database.py --mode normalized
```

The script will truncate and re-load the data, so your database is always
up-to-date with the YAML library. (If you need more sophisticated change
tracking, see DATABASE_SCHEMA.md for hints on diffing-before-update.)

## File structure

```
outputs/
├── contracts_export.xlsx          ← Excel workbook (formatted)
└── contracts_export.csv           ← CSV (import-anywhere)

scripts/
├── export_to_spreadsheet.py       ← Generates the above
└── sync_to_database.py            ← Uploads to PostgreSQL-compatible DB

DATABASE_SCHEMA.md                  ← Relational schema guide for production
```

## Troubleshooting

**"Module not found: openpyxl"**
→ `pip install -r requirements.txt` to get all dependencies

**"Module not found: psycopg"**
→ `pip install -r requirements-db.txt` if you're using the database sync

**"Cannot connect to database"**
→ Check your `DATABASE_URL` environment variable. Supabase and AWS RDS
  provide connection strings in their dashboards.

**"CSV import failed in [service]"**
→ Make sure the CSV is UTF-8 encoded (it is, by default) and the service
  supports pipe-separated values in the field data (most do).

**"Risk flags are showing as separate columns, not separate rows"**
→ That's expected — the CSV is flattened (one row per contract). If you
  want a normalized schema with risk flags in a separate table, use
  `sync_to_database.py --mode normalized` instead of the CSV.
