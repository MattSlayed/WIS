# Workshop Intelligence System - Quick Start Guide

Get the WIS application running locally in 15 minutes.

## Prerequisites

Make sure you have:
- Node.js 18+ installed
- npm 9+ installed
- A Supabase account (free tier works)
- An Anthropic API key (Claude)
- A Google Cloud account

## Step 1: Install Dependencies

```bash
cd workshop-app
npm install
```

This installs all required packages including Next.js, Supabase client, Anthropic SDK, and Google Vision API.

## Step 2: Set Up Supabase

### 2.1 Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project details and create

### 2.2 Apply Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Open the file `lib/supabase/schema.sql`
3. Copy the entire contents
4. Paste into Supabase SQL Editor
5. Click "Run"

This creates all tables, relationships, policies, and functions.

### 2.3 Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secure!)

## Step 3: Set Up Anthropic Claude

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys**
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

## Step 4: Set Up Google Cloud

### 4.1 Enable Vision API

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable **Cloud Vision API**
4. Enable **Cloud Storage API**

### 4.2 Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click "Create Service Account"
3. Name it "wis-service-account"
4. Grant roles:
   - Cloud Vision API User
   - Storage Object Admin
5. Click "Create Key" → Choose JSON
6. Save the downloaded JSON file as `google-credentials.json` in the project root

### 4.3 Create Storage Bucket

1. Go to **Cloud Storage** → **Browser**
2. Click "Create Bucket"
3. Name it (e.g., "wis-equipment-photos")
4. Choose region close to your users
5. Set access to **Fine-grained**
6. Click "Create"

## Step 5: Configure Environment Variables

1. Copy the example file:

```bash
cp .env.example .env
```

2. Edit `.env` and fill in all values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=wis-equipment-photos
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Magic Links
MAGIC_LINK_SECRET=generate-a-random-32-char-string-here
MAGIC_LINK_EXPIRY_HOURS=24
```

3. Generate a secure secret for `MAGIC_LINK_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Run the Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

## Step 7: Test the Setup

### 7.1 Check Database Connection

Open [http://localhost:3000](http://localhost:3000) - if the homepage loads, Supabase is connected.

### 7.2 Test AI Integration (Optional)

Create a test file `test-ai.js`:

```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const test = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(test.content[0].text);
```

Run: `node test-ai.js`

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection fails
- Verify Supabase URL and keys are correct
- Check if your IP is allowed (Supabase → Settings → Database → Network Restrictions)

### Google Cloud errors
- Verify `google-credentials.json` is in the project root
- Check if Vision API is enabled
- Verify service account has correct permissions

### Anthropic API errors
- Verify API key is correct
- Check your API usage limits at console.anthropic.com
- Ensure you have credits available

## Next Steps

Once everything is running:

1. **Create a test user** in Supabase Authentication
2. **Create a test client** by running SQL in Supabase:

```sql
INSERT INTO public.clients (name, email, phone, company, address)
VALUES ('Test Client', 'test@example.com', '+27123456789', 'Test Company', '123 Test St');
```

3. **Start building features** - See `docs/IMPLEMENTATION_STATUS.md` for what's next

## Development Workflow

```bash
# Start development server
npm run dev

# Type check
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build
```

## Useful Commands

```bash
# Generate a new migration
# (Create .sql file in lib/supabase/migrations/)

# Test Supabase connection
npx supabase status

# View real-time logs
# Check Vercel dashboard or console.log output
```

## Getting Help

- Check `README.md` for comprehensive documentation
- Review `docs/IMPLEMENTATION_STATUS.md` for project status
- Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

**You're ready to start developing! 🚀**
