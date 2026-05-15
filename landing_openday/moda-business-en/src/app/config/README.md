# Open Day config

Edit **`openday-config.json`** — it drives the landing and is copied to `dist/config/` on build for `submit.php`.

## Fields

| Field | Description |
|-------|-------------|
| `requestDescription` | Sent to CRM (`request_description`). |
| `course` | Course identifiers for the API. |
| `courseMailLabel` | Course name in confirmation emails (`submit.php`). |
| `origin` | Lead source tags for the API. |
| `campuses[].id` | Internal key for the form (unique). |
| `campuses[].label` | Campus name shown in hero and form. |
| `campuses[].apiValue` | Value sent as `location` to the API — must match CRM. |
| `campuses[].address` | Address shown in hero. |
| `campuses[].mode` | Optional: `"online"` — hero shows “Online in English”. |
| `campuses[].sessions[].id` | Unique session id. |
| `campuses[].sessions[].apiDateTime` | `YYYY-MM-DD HH:mm` (hero, form, API). |
| `footer.contacts` | Footer: `title`, `phone`, `email`. |

## Scenarios

Edit `campuses` in `openday-config.json` as needed.

### One campus, one date (current setup)

Single campus with one object in `sessions`. No campus/date dropdown in the form.

### One campus, multiple dates

Add more entries to `sessions` on the same campus:

```json
"sessions": [
  { "id": "milano-online-1", "apiDateTime": "2026-06-11 16:00" },
  { "id": "milano-online-2", "apiDateTime": "2026-06-18 16:00" }
]
```

Only the **date** dropdown appears in the form.

### Multiple campuses

Add another object to `campuses` (each with at least one `session`):

```json
{
  "id": "napoli",
  "label": "Naples",
  "apiValue": "Napoli",
  "address": "Corso A. Lucci 104",
  "sessions": [
    { "id": "napoli-1", "apiDateTime": "2026-07-14 10:00" }
  ]
}
```

**Campus** and **date** dropdowns appear in the form.

### Online Open Day (Milan, in English)

```json
{
  "id": "milano",
  "label": "Milan",
  "apiValue": "Milano",
  "mode": "online",
  "address": "online",
  "sessions": [
    { "id": "milano-online-1", "apiDateTime": "2026-06-11 16:00" }
  ]
}
```

Hero shows **Milan** and **Online in English**. Alternatively, set `"address": "online"` without `mode`.

### Campus hidden

A campus with `"sessions": []` (or no `sessions`) is not shown on the site.

## Deploy

After editing `openday-config.json`, run `npm run build` so `dist/config/openday-config.json` is updated for production.

If you change dates, also update the meta descriptions in `index.html` (not generated from config).
