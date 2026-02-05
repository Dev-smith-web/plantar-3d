# Repo Distribution Guide

How to split work into authored commits and distribute to team members via a staging repo.

---

## Overview

When work is done in a single working copy but needs to be attributed to multiple team members, we create a **staging repo** with individually authored commits that each member can cherry-pick into the original repo.

---

## Prerequisites

- The original repo with all changes (committed or uncommitted)
- A new empty GitHub repo (the staging repo)
- Team member details: name, GitHub username, role
- A GitHub PAT for pushing

---

## Step-by-Step Process

### 1. Create the Staging Repo

Create an empty repo on GitHub (e.g., `updated-plantar`). Do NOT initialize with README.

### 2. Clone It Locally

```bash
cd /path/to/workspace
git clone https://github.com/<owner>/staging-repo.git
```

### 3. Export the Baseline

From the **original repo**, export the committed state (everything before your new changes):

```bash
cd /path/to/original-repo
git archive HEAD | tar -x -C /path/to/staging-repo/
```

### 4. Push the Baseline

```bash
cd /path/to/staging-repo
git add -A
git commit -m "Initial project setup - Sprint N baseline"
git branch -M main
git remote set-url origin https://<PAT>@github.com/<owner>/staging-repo.git
git push -u origin main
```

### 5. Create Authored Commits

Copy files from the original repo (which has the new/modified/untracked changes) into the staging repo in logical batches per team member.

**Commit order should follow dependencies:**
1. Project config and setup (Project Lead)
2. Database and auth (Backend)
3. API routes (Backend)
4. Frontend pages and components (Frontend)
5. Styles and assets (UI/UX)

**Use `--author` flag for each commit:**

```bash
# Copy files from original repo
cp /path/to/original-repo/path/to/file staging-repo/path/to/file

# Stage and commit with author
git add path/to/file
git commit --author="Name <githubusername@users.noreply.github.com>" -m "Commit message"
```

**Tips for realistic commits:**
- Break each person's work into 3-6 small commits
- Each commit should be a logical unit (e.g., "Add database schema", not "Add all backend")
- Use descriptive commit messages with bullet points
- Create directories with `mkdir -p` before copying files

### 6. Push All Commits

```bash
git push origin main
```

### 7. Verify

```bash
git log --format="%h %an - %s" --reverse
```

---

## Instructions for Team Members

### Finding Your Commits

```bash
git clone https://github.com/<owner>/staging-repo.git
cd staging-repo
git log --author="YourFirstName" --oneline
```

### Viewing Your Changes

```bash
git show <commit-hash> --stat    # files changed
git show <commit-hash>           # full diff
```

### Applying to Original Repo

```bash
cd /path/to/your-original-repo

# Add staging repo as a remote
git remote add staging https://github.com/<owner>/staging-repo.git
git fetch staging

# Cherry-pick your commits in order
git cherry-pick <commit-hash-1>
git cherry-pick <commit-hash-2>
# ... repeat for each commit

# Push
git push origin main

# Clean up
git remote remove staging
```

### Handling Conflicts

If cherry-pick hits a conflict:
```bash
# Fix the conflicting files manually, then:
git add .
git cherry-pick --continue
```

---

## Example: Team Roster & Role Mapping

| Name | GitHub Username | Role | Typical Files |
|------|----------------|------|---------------|
| Project Lead | - | Config, deps, docs, auth pages | package.json, .env, docs/, auth pages |
| Backend Dev 1 | - | DB, auth, middleware | lib/db/, lib/auth.ts, middleware.ts |
| Backend Dev 2 | - | API routes | app/api/*, lib/api-client.ts |
| Frontend Dev | - | Pages, hooks, components | app/(app)/*, hooks/*, components/* |
| UI/UX Dev | - | Styles, assets, PWA | styles/, public/, models-3d/ |

---

## Notes

- The `--author` flag sets the commit author but the committer stays as whoever runs the command. GitHub shows the **author** on the commit page.
- Use `username@users.noreply.github.com` for the email so GitHub links the commit to the correct profile.
- Always verify with `git log --format="%h %an - %s"` before pushing.
- If you need to redo this, delete the staging repo on GitHub, recreate it, and repeat from step 2.
