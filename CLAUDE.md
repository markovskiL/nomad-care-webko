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
