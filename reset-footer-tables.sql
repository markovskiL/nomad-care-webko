-- Drop the problematic footer block tables
-- This will allow Payload to recreate them with correct types

DROP TABLE IF EXISTS "footer_blocks_content_locales" CASCADE;
DROP TABLE IF EXISTS "footer_blocks_menu_links" CASCADE;
DROP TABLE IF EXISTS "footer_blocks_menu" CASCADE;
DROP TABLE IF EXISTS "footer_blocks_content" CASCADE;

-- Also drop migration tracking to re-run migration
DELETE FROM payload_migrations WHERE name = '20231230_complete_footer_refactor';
