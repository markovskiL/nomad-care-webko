# Claude Code Notes

## Adding Bulgarian Translations to Payload CMS

This project uses Payload CMS with PostgreSQL (Neon) for content management. Translations are stored in `*_locales` tables in the database.

### Database Connection

The database connection string is in `.env`:
```
POSTGRES_URL='postgresql://...'
```

### How Translations Work

Payload CMS stores localized content in separate `*_locales` tables. Each locale table has:
- `_locale` - the locale code ('en', 'bg')
- `_parent_id` - reference to the parent record
- Content columns specific to that entity

### Adding Translations via Script

1. **Install pg driver** (if not already installed):
   ```bash
   pnpm add -D pg @types/pg
   ```

2. **Create a translation script** (e.g., `scripts/add-translations.mjs`):
   ```javascript
   import pg from 'pg';
   import dotenv from 'dotenv';

   dotenv.config();

   const client = new pg.Client({
     connectionString: process.env.POSTGRES_URL,
     ssl: { rejectUnauthorized: false }
   });

   async function main() {
     await client.connect();

     // Get English entries
     const enRows = await client.query(`SELECT * FROM "table_locales" WHERE _locale = 'en'`);

     for (const row of enRows.rows) {
       // Check if Bulgarian already exists
       const exists = await client.query(
         `SELECT id FROM "table_locales" WHERE _locale = 'bg' AND _parent_id = $1`,
         [row._parent_id]
       );

       if (exists.rows.length === 0) {
         // Insert Bulgarian translation
         await client.query(
           `INSERT INTO "table_locales" (column1, column2, _locale, _parent_id)
            VALUES ($1, $2, 'bg', $3)`,
           ['Bulgarian text 1', 'Bulgarian text 2', row._parent_id]
         );
       }
     }

     await client.end();
   }

   main();
   ```

3. **Run the script**:
   ```bash
   node scripts/add-translations.mjs
   ```

### Locale Tables in This Project

Main content tables with translations:
- `hero_locales` - Hero section content
- `hero_trust_badges_locales` - Trust badges
- `navigation_locales` - Navigation text
- `faq_locales` - FAQ questions/answers (rich text)
- `forms_locales` - Form submit/success messages
- `forms_fields_locales` - Form field labels/placeholders
- `pages_locales` - Page titles and service descriptions
- `pages_blocks_*_locales` - Various page block content
- `testimonials_locales` - Customer testimonials (quote, role)
- `team_locales` - Team member roles/bios
- `site_settings_locales` - Site metadata
- `site_settings_business_hours_locales` - Business hours
- `values_sections_locales` - Values section content
- `media_locales` - Image alt texts

### Checking Translation Status

Run this to see which tables have/need translations:
```javascript
// Check all locale tables
const tables = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name LIKE '%_locales'
  AND table_name NOT LIKE '_pages_v%'
`);

for (const { table_name } of tables.rows) {
  const en = await client.query(`SELECT COUNT(*) FROM "${table_name}" WHERE _locale = 'en'`);
  const bg = await client.query(`SELECT COUNT(*) FROM "${table_name}" WHERE _locale = 'bg'`);
  console.log(`${table_name}: EN=${en.rows[0].count}, BG=${bg.rows[0].count}`);
}
```

### Rich Text Fields

Some fields (like FAQ answers) use Lexical rich text format:
```javascript
function createRichTextAnswer(text) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [{
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [{
          mode: 'normal',
          text: text,
          type: 'text',
          style: '',
          detail: 0,
          format: 0,
          version: 1
        }],
        direction: null,
        textStyle: '',
        textFormat: 0
      }],
      direction: null
    }
  };
}
```

### Common Bulgarian Translations Reference

| English | Bulgarian |
|---------|-----------|
| Home | Начало |
| About Us | За нас |
| Services | Услуги |
| Contact | Контакти |
| Contact Us | Свържете се с нас |
| Get a Quote | Поискай оферта |
| Get a Free Quote | Получи безплатна оферта |
| Learn More | Научете повече |
| Read More | Прочетете повече |
| Send Message | Изпрати съобщение |
| Name | Име |
| Email | Имейл |
| Phone | Телефон |
| Message | Съобщение |
| Address | Адрес |
| Company | Фирма |
| FAQ | ЧЗВ |
| Testimonials | Отзиви |
| Our Team | Нашият екип |
| Pricing | Цени |
| Monday - Friday | Понеделник - Петък |
| Saturday - Sunday | Събота - Неделя |
| Closed | Затворено |
| All Rights Reserved | Всички права запазени |

### Notes

- Always check the table schema first (`SELECT column_name FROM information_schema.columns WHERE table_name = 'table_name'`)
- Version tables (`_pages_v_*`) are auto-managed by Payload - skip these
- The `_parent_id` can be either an integer or a string (MongoDB ObjectId format) depending on the table

---

## Creating Pages via SQL

When creating pages directly via SQL (instead of through the admin panel), you must create records in multiple tables for the pages to appear correctly in the admin panel.

### Required Tables

1. **`pages`** - Main page data (non-localized fields)
2. **`pages_locales`** - Localized content (title, description, etc.)
3. **`_pages_v`** - Version record (REQUIRED for admin panel visibility)
4. **`_pages_v_locales`** - Version localized content

For service pages, also:
5. **`pages_service_data_features`** - Feature list items
6. **`pages_service_data_features_locales`** - Localized feature text

### Step 1: Create the Page

```sql
INSERT INTO pages (
  slug,
  parent_id,
  pathname,
  visibility_show_in_footer,
  visibility_footer_column,
  visibility_footer_order,
  template,
  service_data_icon,
  service_data_image_id,
  _status
)
VALUES (
  'home-cleaning',      -- slug
  10,                   -- parent_id (Services page)
  '/services/home-cleaning',
  true,                 -- show in footer
  'services',           -- footer column: 'company', 'services', 'support'
  1,                    -- footer order
  'service',            -- template: 'home', 'about', 'services', 'service', 'contact'
  'home',               -- icon: 'home', 'building', 'sparkles', 'star', 'truck', etc.
  4,                    -- media id for service image
  'published'           -- status: 'draft' or 'published'
)
RETURNING id;
```

### Step 2: Add Localized Content

```sql
INSERT INTO pages_locales (title, service_data_description, service_data_price, _locale, _parent_id)
VALUES
  ('Home Cleaning', 'Description in English...', 'From $99', 'en', 11),
  ('Домашно почистване', 'Описание на български...', 'От 99лв', 'bg', 11);
```

### Step 3: Create Version Record (CRITICAL!)

**Without this, pages won't appear in the admin panel!**

```sql
INSERT INTO _pages_v (
  parent_id,
  version_slug,
  version_parent_id,
  version_pathname,
  version_visibility_show_in_footer,
  version_visibility_footer_column,
  version_visibility_footer_order,
  version_navigation_style,
  version_template,
  version_service_data_icon,
  version_service_data_image_id,
  version_updated_at,
  version_created_at,
  version__status,
  latest
)
SELECT
  id,
  slug,
  parent_id,
  pathname,
  visibility_show_in_footer,
  visibility_footer_column::text::enum__pages_v_version_visibility_footer_column,
  visibility_footer_order,
  navigation_style::text::enum__pages_v_version_navigation_style,
  template::text::enum__pages_v_version_template,
  service_data_icon::text::enum__pages_v_version_service_data_icon,
  service_data_image_id,
  updated_at,
  created_at,
  _status::text::enum__pages_v_version_status,
  true  -- latest = true
FROM pages
WHERE id = 11;  -- page id
```

**Note:** Enum values must be cast from `pages` table enums to `_pages_v` table enums using `::text::enum_name`.

### Step 4: Create Version Locales

```sql
INSERT INTO _pages_v_locales (version_title, version_service_data_description, version_service_data_price, _locale, _parent_id)
SELECT
  pl.title,
  pl.service_data_description,
  pl.service_data_price,
  pl._locale,
  pv.id
FROM pages_locales pl
JOIN _pages_v pv ON pv.parent_id = pl._parent_id
WHERE pl._parent_id = 11;  -- page id
```

### Step 5: Add Service Features (for service template)

```sql
-- Create feature entries (id is a string/UUID)
INSERT INTO pages_service_data_features (_order, _parent_id, id)
VALUES
  (0, 11, 'hc-f1'),
  (1, 11, 'hc-f2'),
  (2, 11, 'hc-f3');

-- Add localized feature text
INSERT INTO pages_service_data_features_locales (feature, _locale, _parent_id)
VALUES
  ('All rooms dusted and vacuumed', 'en', 'hc-f1'),
  ('Всички стаи почистени и прахосмукани', 'bg', 'hc-f1'),
  ('Kitchen deep cleaning', 'en', 'hc-f2'),
  ('Дълбоко почистване на кухнята', 'bg', 'hc-f2');
```

### Available Enums

**Templates (`enum_pages_template`):**
- `home`, `about`, `services`, `service`, `contact`

**Icons (`enum_pages_service_data_icon`):**
- `home`, `building`, `sparkles`, `brush`, `droplets`, `leaf`, `shield`, `clock`, `star`, `truck`, `heart`, `users`, `award`, `message-square`

**Footer Columns (`enum_pages_visibility_footer_column`):**
- `company`, `services`, `support`

**Status (`enum_pages_status`):**
- `draft`, `published`

### Troubleshooting

If pages don't appear in admin panel:
1. Check `_pages_v` has a record with `parent_id` = your page id
2. Check `_pages_v_locales` has locale records for the version
3. Ensure `latest = true` on the version record
4. Ensure `version__status = 'published'` on the version record
