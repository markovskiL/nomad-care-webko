import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload, db }: MigrateUpArgs): Promise<void> {
  payload.logger.info('Running migration: Complete Footer structure refactor')

  try {
    // ========================================
    // STEP 1: Troubleshooting & Fixes
    // ========================================
    payload.logger.info('Step 1: Dropping potentially problematic tables...')
    await db.execute(`
      DROP TABLE IF EXISTS "footer_blocks_content_locales" CASCADE;
      DROP TABLE IF EXISTS "footer_blocks_menu_links" CASCADE;
      DROP TABLE IF EXISTS "footer_blocks_menu" CASCADE;
      DROP TABLE IF EXISTS "footer_blocks_content" CASCADE;
    `)

    // ========================================
    // STEP 2: Enum Management
    // ========================================
    payload.logger.info('Step 2: Managing enums...')

    // Rename legacy enum if it exists
    await db.execute(`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_footer_link_groups_links_link_type') THEN
          ALTER TYPE "enum_footer_link_groups_links_link_type" 
          RENAME TO "enum_footer_blocks_menu_links_link_type";
        END IF;
      END $$;
    `)

    // Create variant enum if not exists
    await db.execute(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_footer_variant') THEN
          CREATE TYPE "enum_footer_variant" AS ENUM ('footer-1', 'footer-2');
        END IF;
      END $$;
    `)

    // ========================================
    // STEP 3: Skip manual table creation
    // ========================================
    // Let Payload auto-create these tables with correct types
    payload.logger.info('Step 3: Skipping table creation (Payload will auto-create)...')

    // ========================================
    // STEP 4: Add New Columns
    // ========================================
    payload.logger.info('Step 4: Adding new columns...')

    await db.execute(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'footer' AND column_name = 'variant'
        ) THEN
          ALTER TABLE "footer" ADD COLUMN "variant" "enum_footer_variant";
        END IF;
      END $$;
    `)

    // ========================================
    // STEP 5: Cleanup Legacy Columns
    // ========================================
    payload.logger.info('Step 5: Removing legacy columns...')

    await db.execute(`
      ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_visibility_show_in_footer";
      ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_visibility_footer_column";
      ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_visibility_footer_order";
      
      ALTER TABLE "site_settings_locales" DROP COLUMN IF EXISTS "footer_copyright";
      
      ALTER TABLE "pages" DROP COLUMN IF EXISTS "visibility_show_in_footer";
      ALTER TABLE "pages" DROP COLUMN IF EXISTS "visibility_footer_column";
      ALTER TABLE "pages" DROP COLUMN IF EXISTS "visibility_footer_order";
    `)

    // ========================================
    // STEP 6: Drop Old Tables
    // ========================================
    payload.logger.info('Step 6: Dropping old link_groups tables...')

    await db.execute(`
      DROP TABLE IF EXISTS "footer_link_groups_links" CASCADE;
      DROP TABLE IF EXISTS "footer_link_groups" CASCADE;
    `)


    // ========================================
    // STEP 7: Skip footer initialization
    // ========================================
    // Tables don't exist yet - Payload will auto-create them on next dev server start
    // You'll need to manually configure the footer in the admin panel
    payload.logger.info('Step 7: Skipping footer initialization (configure in admin panel)')

    payload.logger.info('✓✓✓ Footer migration complete!')
  } catch (error) {
    payload.logger.error('Migration failed:', error)
    throw error
  }
}

export async function down({ payload, db }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Rolling back footer migration')

  try {
    // Drop new tables
    await db.execute(`
      DROP TABLE IF EXISTS "footer_blocks_content_locales" CASCADE;
      DROP TABLE IF EXISTS "footer_blocks_menu_links" CASCADE;
      DROP TABLE IF EXISTS "footer_blocks_menu" CASCADE;
      DROP TABLE IF EXISTS "footer_blocks_content" CASCADE;
    `)

    // Recreate old structure
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "footer_link_groups" (
        "id" SERIAL PRIMARY KEY,
        "_order" INTEGER,
        "_parent_id" INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS "footer_link_groups_links" (
        "id" SERIAL PRIMARY KEY,
        "_order" INTEGER,
        "_parent_id" INTEGER REFERENCES "footer_link_groups"(id) ON DELETE CASCADE
      );
    `)

    // Remove variant column
    await db.execute(`
      ALTER TABLE "footer" DROP COLUMN IF EXISTS "variant";
    `)

    payload.logger.info('✓ Rollback complete')
  } catch (error) {
    payload.logger.error('Rollback failed:', error)
  }
}
