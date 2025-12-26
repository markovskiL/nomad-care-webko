# Migration to V2 Blocks

This guide walks you through migrating from the old relationship-based blocks to the new inline universal blocks.

## What's Changing

### Block Renames
| Old Block | New Block |
|-----------|-----------|
| `hero-section` | `hero-banner` |
| `page-hero-section` | `hero-simple` |
| `values-section` | `values` |
| `company-values-section` | `values` |
| `stats-section` | `stats` |
| `timeline-section` | `timeline` |
| `rich-text-section` | `content` |
| `services-section` | `card-grid` |
| `services-grid-section` | `card-grid` |
| `pricing-section` | `pricing` |
| `testimonials-section` | `testimonials` |
| `team-section` | `team` |
| `faq-section` | `faq` |
| `contact-form-section` | `form` |
| `contact-section` | `contact-details` |
| `map-embed-section` | `map` |
| `cta-banner-section` | `cta` |
| `mission-vision-section` | `split-content` |

### Removed Collections
These collections are being removed (data will be inlined into blocks):
- `hero`
- `team`
- `testimonials`
- `faq`
- `cta-banners`
- `values-sections`

---

## Migration Steps

### Step 1: Backup Your Database
```bash
# Example for PostgreSQL
pg_dump $POSTGRES_URL > backup-$(date +%Y%m%d).sql
```

### Step 2: Update webko packages
```bash
cd /path/to/webko
pnpm build
cd /path/to/webko-test
pnpm update @webko-labs/payload-config @webko-labs/ui
```

### Step 3: Run the Migration Script
```bash
# Make sure the dev server is NOT running
npx tsx scripts/migrate-to-v2-blocks.ts
```

The script will:
1. Read all pages and their blocks
2. Fetch data from old collections (hero, team, etc.)
3. Convert blocks to new structure with inline data
4. Update pages in the database

### Step 4: Verify Migration
Open the Payload admin and check a few pages:
- Are blocks rendering correctly?
- Is the content preserved?
- Are testimonials/team/FAQ items now inline in the blocks?

### Step 5: Swap the Config
```bash
# Backup old config
mv src/payload.config.ts src/payload.config.old.ts

# Use new config
mv src/payload.config.new.ts src/payload.config.ts
```

### Step 6: Regenerate Types
```bash
pnpm payload generate:types
```

### Step 7: Test the App
```bash
pnpm dev
```

Visit the site and verify:
- All pages render correctly
- Admin panel works
- No console errors

### Step 8: Clean Up Old Tables (Optional)
Once everything is verified working:

```bash
# Using psql
psql $POSTGRES_URL < scripts/cleanup-old-tables.sql
```

Or run the SQL manually in your database admin tool.

---

## Troubleshooting

### "Cannot find collection X"
If you see errors about missing collections after swapping the config, it means the old data still references removed collections. Make sure you ran the migration script BEFORE swapping configs.

### Block not rendering
Check the browser console for errors. The block registry might not have a component for the new block type. Ensure you've updated `@webko-labs/ui` to the latest version.

### Services blocks are empty
The `services-section` and `services-grid-section` blocks referenced page relationships. These are converted to `card-grid` with empty items. You'll need to manually recreate the card content.

### Mission/Vision block
The `mission-vision-section` is converted to `split-content`, but the content structure is different. You may need to manually adjust the content.

---

## Rollback

If something goes wrong:

1. Restore your database backup:
```bash
psql $POSTGRES_URL < backup-YYYYMMDD.sql
```

2. Restore old config:
```bash
mv src/payload.config.old.ts src/payload.config.ts
```

3. Revert package versions if needed
