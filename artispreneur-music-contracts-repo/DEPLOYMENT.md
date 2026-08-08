# Deployment Guide

Written for a solo, non-technical founder pushing this to GitHub for the
first time. Follow it top to bottom.

## Step 0 — Resolve the template provenance question first

Read `NOTICE.md` before anything else. The 24 templates marked
`status: sourced` in `skills/music-contract-agent/references/contracts/*.yaml`
came from files you uploaded during development, and their original
license/ownership isn't confirmed. Decide now:

- **Going public with everything?** Confirm you have the right to
  redistribute those 24 templates first. If you're not sure, don't publish
  yet.
- **Not sure, but want to launch something now?** Make the GitHub repo
  **private** to start (Settings → General → Danger Zone → Change
  visibility, or just create it as private from the start). You and your
  internal site can still use it; the public-open-source question can wait.
- **Want an immediately-safe public option?** You could publish a
  "lite" branch/tag containing only the six `status: original` templates
  plus all the skill infrastructure (schema, scripts, workflow docs), and
  keep the sourced templates in a private branch or a separate private
  repo your product actually runs against.

This guide assumes you'll start private and decide on public later — that's
the lowest-risk default.

## Step 1 — Create the GitHub repository

1. Go to github.com → New repository.
2. Name it (e.g. `music-contract-agent` or `artispreneur-contracts`).
3. Set visibility to **Private** for now (see Step 0).
4. Don't initialize with a README/license/gitignore — you already have all
   three in this folder.

## Step 2 — Push this folder to GitHub

If you've never used git from a terminal before, these exact commands will
work. Open a terminal, `cd` into this folder, then:

```bash
git init
git add .
git commit -m "Initial commit: harness-agnostic music contract agent skill"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

If `git` isn't installed, install it first (macOS: `brew install git` or
it prompts you automatically the first time you run a git command; Windows:
download Git for Windows from git-scm.com).

You'll be asked to authenticate — GitHub now requires a Personal Access
Token instead of your password for command-line pushes. GitHub's own docs
walk through generating one: Settings → Developer settings → Personal
access tokens.

## Step 3 — Confirm CI is running

After the push, go to your repo's **Actions** tab on GitHub. You should see
"Validate contract library" running automatically (it's defined in
`.github/workflows/validate.yml`). Let it finish — it should pass green,
since you already validated locally. This is now your safety net: any
future change that breaks the schema, orphans a file, or leaves the index
stale will show up as a red X on that PR before it merges.

## Step 4 — Connect it to Claude

Pick whichever matches how you actually work:

- **claude.ai Project**: create a Project, upload the contents of
  `skills/music-contract-agent/` (or the whole repo) as Project knowledge.
  Claude will read `SKILL.md` and trigger on relevant requests
  automatically — this is likely the easiest path for you day-to-day.
- **Claude Code / Cowork**: copy `skills/music-contract-agent/` into
  wherever your local Claude setup loads skills from.

## Step 5 — Connect it to OpenCode (or another agent)

Point that tool at the repo, or copy `skills/music-contract-agent/` into
whatever project it's working on. OpenCode-style tools look for
`AGENTS.md` automatically — it's already there and points at the same
instructions Claude uses.

## Step 6 — Point your internal site at it

A few options, roughly in order of effort:

- **Simplest**: link directly to the GitHub repo (or specific files via
  their "raw" URLs) from your internal site/docs. If the repo is private,
  anyone clicking the link will need GitHub access to your org/repo.
- **A bit more polished**: turn on GitHub Pages (Settings → Pages) pointed
  at the `main` branch, and let it render `README.md` and the reference
  docs as a simple browsable site. Free, no extra hosting needed.
- **Most control**: pull the repo's content into whatever CMS/static site
  your internal site already runs on, via a small script or a GitHub
  Action that syncs on every push.

Start with the simplest option — you can upgrade later without changing
anything about the repo itself.

## Step 7 — Keep it maintained

Whenever you add or change a contract type:

```bash
python3 scripts/validate_library.py     # catch problems before committing
python3 scripts/generate_index.py       # keep the routing table in sync
git add -A
git commit -m "Add <contract type>"
git push
```

CI will re-validate automatically. If you ever consider making the repo
public, revisit `NOTICE.md` first — it doesn't go stale, but your
confidence about the sourced templates might need re-checking if you've
added more of them since.

## A note on versioning

`CHANGELOG.md` is already started at `1.1.0`. Bump it (and consider a git
tag, `git tag v1.1.0 && git push --tags`) whenever you make a meaningful
change — it costs nothing and makes it much easier to tell your internal
site or any future collaborator "here's exactly what changed and when."
