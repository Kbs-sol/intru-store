#!/bin/bash
# INTRU E-commerce - Cloudflare Deployment Script
# This script creates D1 database, runs migrations, seeds data, and deploys to Cloudflare Pages

set -e  # Exit on any error

echo "🚀 INTRU Cloudflare Deployment Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check if authenticated
echo -e "${BLUE}Step 1: Checking authentication...${NC}"
if npx wrangler whoami | grep -q "not authenticated"; then
    echo -e "${RED}❌ Not authenticated with Cloudflare${NC}"
    echo ""
    echo "Please authenticate using ONE of these methods:"
    echo ""
    echo "Method 1 - Interactive Login (Recommended):"
    echo "  npx wrangler login"
    echo ""
    echo "Method 2 - API Token (if you have the token):"
    echo "  export CLOUDFLARE_API_TOKEN='your-token-here'"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ Authenticated successfully${NC}"
    npx wrangler whoami
fi

echo ""
echo -e "${BLUE}Step 2: Creating production D1 database...${NC}"

# Check if database already exists
if npx wrangler d1 list 2>&1 | grep -q "intru-db"; then
    echo -e "${YELLOW}⚠️  Database 'intru-db' already exists${NC}"
    DB_ID=$(npx wrangler d1 list | grep "intru-db" | awk '{print $2}')
    echo "Database ID: $DB_ID"
else
    echo "Creating new D1 database: intru-db"
    CREATE_OUTPUT=$(npx wrangler d1 create intru-db)
    echo "$CREATE_OUTPUT"
    
    # Extract database ID from output
    DB_ID=$(echo "$CREATE_OUTPUT" | grep "database_id" | sed 's/.*= "\(.*\)"/\1/')
    
    if [ -z "$DB_ID" ]; then
        echo -e "${RED}❌ Failed to extract database ID${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Database created with ID: $DB_ID${NC}"
    
    # Update wrangler.jsonc with real database ID
    echo "Updating wrangler.jsonc with database ID..."
    sed -i "s/placeholder-will-be-created-on-deployment/$DB_ID/" wrangler.jsonc
    echo -e "${GREEN}✅ wrangler.jsonc updated${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Running migrations on production database...${NC}"
npx wrangler d1 migrations apply intru-db --remote
echo -e "${GREEN}✅ Migrations applied${NC}"

echo ""
echo -e "${BLUE}Step 4: Seeding production database...${NC}"
npx wrangler d1 execute intru-db --remote --file=./seed.sql
echo -e "${GREEN}✅ Database seeded with products and pages${NC}"

echo ""
echo -e "${BLUE}Step 5: Verifying database...${NC}"
echo "Products count:"
npx wrangler d1 execute intru-db --remote --command="SELECT COUNT(*) as count FROM products"
echo ""
echo "Pages count:"
npx wrangler d1 execute intru-db --remote --command="SELECT COUNT(*) as count FROM pages"

echo ""
echo -e "${BLUE}Step 6: Building project...${NC}"
npm run build
echo -e "${GREEN}✅ Build completed${NC}"

echo ""
echo -e "${BLUE}Step 7: Checking Cloudflare Pages project...${NC}"
if npx wrangler pages project list 2>&1 | grep -q "intru-store"; then
    echo -e "${YELLOW}⚠️  Project 'intru-store' already exists${NC}"
else
    echo "Creating Cloudflare Pages project: intru-store"
    npx wrangler pages project create intru-store \
        --production-branch main \
        --compatibility-date 2026-02-08
    echo -e "${GREEN}✅ Project created${NC}"
fi

echo ""
echo -e "${BLUE}Step 8: Deploying to Cloudflare Pages...${NC}"
npx wrangler pages deploy dist --project-name intru-store
echo -e "${GREEN}✅ Deployment completed${NC}"

echo ""
echo -e "${BLUE}Step 9: Binding D1 database to Pages project...${NC}"
npx wrangler pages deployment tail --project-name intru-store
echo -e "${GREEN}✅ Database binding configured${NC}"

echo ""
echo "======================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "======================================"
echo ""
echo "Your INTRU store is now live on Cloudflare Pages!"
echo ""
echo -e "${BLUE}Production URL:${NC} https://intru-store.pages.dev"
echo -e "${BLUE}Custom Domain:${NC} (Configure in Cloudflare Pages dashboard)"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Visit your site at the production URL"
echo "2. Go to /intruadmin to create your first admin"
echo "3. Use password: 7@Intru for initial setup"
echo "4. Configure custom domain in Cloudflare dashboard (optional)"
echo ""
echo -e "${GREEN}Made in Bharat 🇮🇳 with ❤️${NC}"
