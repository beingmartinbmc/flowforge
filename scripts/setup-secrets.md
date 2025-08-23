# Setting Up Automatic Deployments

## GitHub Secrets Setup

To enable automatic deployments when environment variables change, you need to set up GitHub secrets:

### 1. Go to GitHub Repository Settings
- Navigate to your repository: `https://github.com/beingmartinbmc/flowforge`
- Go to **Settings** → **Secrets and variables** → **Actions**

### 2. Add Required Secrets

#### `NEXT_PUBLIC_API_URL`
- **Value**: `https://flowforge-backend-ohn6mv3b3-beingmartinbmcs-projects.vercel.app/api`
- **Description**: Backend API URL for the frontend

#### `GITHUB_TOKEN` (usually auto-provided)
- **Value**: Automatically provided by GitHub
- **Description**: Token for GitHub API access

### 3. Environment Variables That Trigger Auto-Deploy

The following files will trigger automatic deployments when changed:

- `.env*` files (any environment file)
- `src/lib/api.ts` (API configuration)
- `package.json` (dependencies)
- `next.config.js` (Next.js configuration)

## Usage

### Automatic Deployment
```bash
# Any change to monitored files will trigger deployment
git add .
git commit -m "update: environment variables"
git push origin main
```

### Manual Deployment
```bash
# Force deployment regardless of changes
npm run deploy:force
```

### Check Environment Changes
```bash
# Check if environment has changed
npm run monitor:check

# Watch for changes continuously
npm run monitor:watch
```

## GitHub Actions Workflow

The `.github/workflows/auto-deploy.yml` workflow will:

1. **Monitor** for changes in environment files
2. **Build** the application with current environment variables
3. **Deploy** to GitHub Pages automatically
4. **Notify** when deployment completes

## Manual Trigger

You can also manually trigger deployments from GitHub:
1. Go to **Actions** tab
2. Select **Auto Deploy on Environment Changes**
3. Click **Run workflow**
4. Choose **Force deployment** if needed

## Benefits

✅ **Automatic**: No manual intervention needed
✅ **Fast**: Only deploys when necessary
✅ **Reliable**: Uses GitHub Actions for consistency
✅ **Flexible**: Supports both automatic and manual triggers
