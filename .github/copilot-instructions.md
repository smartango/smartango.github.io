# GitHub Copilot Instructions - Smartango Website

## Git/Version Control Rules

**CRITICAL - NEVER COMMIT AUTOMATICALLY**

- NEVER run `git commit` commands
- NEVER run `git push` commands
- NEVER run `git commit -m "..."` under any circumstances
- Only prepare changes and stage files if requested
- Let the user decide when to commit and push
- Inform user of changes made and let them handle version control

The user maintains full control over git operations. Your job is to prepare the changes, not to commit them.

## Hugo Site Structure

This is a Hugo-based GitHub Pages site.

### Important Hugo Rules

- `data/` directory: Only `.yaml`, `.json`, `.toml`, `.xml` files
- Never put `.md` files in `data/` - Hugo will try to parse them as data and fail
- Template syntax (`{{ }}`) belongs in layout files, NOT in markdown content
- Use partials in `themes/custom/layouts/partials/` for reusable components
- Content files in `content/` should be clean markdown with front matter

### Project Structure

```
content/          - Markdown content files
data/             - Structured data files (YAML only for now)
static/           - Static assets (CSS, JS, images)
themes/custom/    - Custom Hugo theme
  layouts/        - Hugo templates
  partials/       - Reusable template components
```

### GatearwayMan Feature Matrix

- Feature status managed in `data/gatearwayman-features.yaml`
- Status values: `Released`, `WIP`, `Define Requirements`, `Planned`
- Rendered via partial: `themes/custom/layouts/partials/feature-matrix.html`
- Displayed on: `content/products/gatearwayman.md`

## Language

Always respond in **English**, even if user writes in Italian or other languages.

## Communication Style

- Direct and concise
- Technical accuracy over politeness
- No unnecessary explanations unless asked
- NO emojis or UTF-8 special characters in **code** (JavaScript, Python, Go, backend logic)
- NO emojis in documentation, README files, or responses
- Emojis ARE allowed in user-facing HTML/content (what the public sees on the website)
- Distinction: **Code** = what developers read | **Not-code** = what public sees
