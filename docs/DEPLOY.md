# Deploying Plantar to Vercel

## Prerequisites

Before deploying, you need accounts and credentials for:

1. **[Turso](https://turso.tech)** — Managed SQLite database (free tier available)
2. **[Google Cloud Console](https://console.cloud.google.com)** — OAuth 2.0 credentials
3. **[Google AI Studio](https://aistudio.google.com/apikey)** — Gemini API key (free tier)
4. **[HuggingFace](https://huggingface.co/settings/tokens)** — API token (free tier)
5. **[UploadThing](https://uploadthing.com)** — File upload service (free tier)

## Step 1: Set Up Turso Database

```bash
# Install Turso CLI
brew install tursodatabase/tap/turso

# Login
turso auth login

# Create database
turso db create plantar

# Get connection URL
turso db show plantar --url

# Create auth token
turso db tokens create plantar
```

Save the URL and token — you'll need them as environment variables.

## Step 2: Push Database Schema

Before deploying, push the schema to your production database:

```bash
TURSO_DATABASE_URL=<your-production-url> TURSO_AUTH_TOKEN=<your-token> pnpm db:push
```

Optionally seed with sample data:

```bash
TURSO_DATABASE_URL=<your-production-url> TURSO_AUTH_TOKEN=<your-token> pnpm db:seed
```

## Step 3: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `https://<your-vercel-domain>/api/auth/callback/google`
4. Copy the Client ID and Client Secret

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Set the **Root Directory** to `plantar-3d`
5. Framework Preset will auto-detect **Next.js**
6. Add all environment variables (see below)
7. Click Deploy

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# From the plantar-3d directory
vercel

# Set environment variables
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
vercel env add HUGGINGFACE_API_KEY
vercel env add UPLOADTHING_TOKEN

# Deploy to production
vercel --prod
```

## Environment Variables

Set these in Vercel Dashboard > Project Settings > Environment Variables:

| Variable | Value | Notes |
|---|---|---|
| `TURSO_DATABASE_URL` | `libsql://your-db.turso.io` | From `turso db show` |
| `TURSO_AUTH_TOKEN` | `eyJ...` | From `turso db tokens create` |
| `NEXTAUTH_SECRET` | (random string) | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your production URL |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | From Google Cloud Console |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `AIza...` | From Google AI Studio |
| `HUGGINGFACE_API_KEY` | `hf_...` | From HuggingFace settings |
| `UPLOADTHING_TOKEN` | `eyJ...` | From UploadThing dashboard |

**Important:** Set `NEXTAUTH_URL` to your actual Vercel deployment URL (e.g., `https://plantar.vercel.app`). Do NOT leave it as `http://localhost:3000`.

## Step 5: Post-Deploy Verification

After deploying, verify:

- [ ] Home page loads
- [ ] Login with Google works
- [ ] Login with email/password works
- [ ] Registration creates new account
- [ ] Plant library loads
- [ ] 3D plant explorer renders
- [ ] Quiz loads and submits
- [ ] Teacher dashboard accessible for teacher/admin roles
- [ ] Image upload works
- [ ] Plant identification (scanner) returns results

## Vercel Project Settings

- **Build Command:** `next build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `pnpm install` (auto-detected)
- **Node.js Version:** 18.x or 20.x
- **Root Directory:** `plantar-3d` (if monorepo)

## Custom Domain (Optional)

1. Vercel Dashboard > Project > Settings > Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` to match
4. Update Google OAuth redirect URI to match

## Troubleshooting

**Build fails with TypeScript errors:**
Run `pnpm build` locally to reproduce and fix errors before pushing.

**Google OAuth redirect mismatch:**
Ensure the redirect URI in Google Cloud Console exactly matches: `https://<your-domain>/api/auth/callback/google`

**Database connection errors:**
Verify `TURSO_DATABASE_URL` starts with `libsql://` and the auth token is valid. Run `turso db tokens create <db-name>` to generate a fresh token.

**UploadThing errors:**
Check that `UPLOADTHING_TOKEN` is set correctly. The token can be found in your UploadThing dashboard under API Keys.
