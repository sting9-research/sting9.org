# Content Management System

This directory contains markdown files for content-heavy pages. Using markdown files instead of translation keys provides better:

- **Readability**: Easier to read and edit long-form content
- **Maintainability**: Changes don't require rebuilding translation files
- **Version Control**: Better git diffs for content changes
- **Workflow**: Can use standard markdown editors and preview tools

## Structure

```
content/
└── pages/
    ├── security.en.md    # English security page
    ├── security.de.md    # German security page
    ├── security.fr.md    # French security page
    ├── terms.en.md       # English terms of service
    ├── terms.de.md       # German terms of service
    ├── terms.fr.md       # French terms of service
    ├── privacy.en.md     # English privacy policy
    ├── privacy.de.md     # German privacy policy
    └── privacy.fr.md     # French privacy policy
```

## Naming Convention

Files follow the pattern: `{pageName}.{locale}.md`

- `pageName`: The page identifier (e.g., `security`, `terms`, `privacy`)
- `locale`: The language code (e.g., `en`, `de`, `fr`)
- Extension: Always `.md` for markdown

## Usage in Components

### 1. Import the Required Utilities

```tsx
import { useState, useEffect } from 'react'
import { MarkdownContent } from '../components/MarkdownContent'
import { loadMarkdownContent } from '../lib/markdown'
```

### 2. Load Content in Your Component

```tsx
function MyPage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarkdownContent('pageName')
      .then(setContent)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return <MarkdownContent content={content} />
}
```

### 3. How It Works

- `loadMarkdownContent()` automatically detects the current locale from Paraglide
- Falls back to English if the localized version doesn't exist
- Content is loaded dynamically at runtime
- Markdown is parsed and rendered with GitHub-flavored markdown support

## Markdown Features

The markdown content supports:

- **Headers** (H1-H6)
- **Lists** (ordered and unordered)
- **Links**
- **Bold** and *italic* text
- `Inline code`
- Code blocks with syntax highlighting
- Tables
- Blockquotes
- Horizontal rules

## Writing Content

### Best Practices

1. **Use Semantic Headers**: Use proper heading hierarchy (H1 → H2 → H3)
2. **Keep It Structured**: Break content into clear sections
3. **Use Lists**: Make content scannable with bullet points
4. **Link Appropriately**: Use descriptive link text
5. **Consistent Tone**: Match the brand voice across all languages

### Example Structure

```markdown
# Page Title

Brief introduction paragraph.

---

## Main Section

Content here...

### Subsection

More detailed content.

- Bullet point 1
- Bullet point 2

---

## Another Section

More content...

### Important Note

> This is a blockquote for highlighting important information

---

## Contact

Email: [contact@example.com](mailto:contact@example.com)
```

## Styling

The `MarkdownContent` component applies Tailwind CSS classes automatically:

- Headers: Bold, appropriate sizes
- Links: Blue with hover effects
- Lists: Proper spacing and bullets
- Code: Gray background for inline code
- Paragraphs: Slate color with proper spacing

## Migration Guide

To convert a page from translation keys to markdown:

### 1. Create Markdown Files

For each language, create a markdown file:

```bash
touch content/pages/pagename.en.md
touch content/pages/pagename.de.md
touch content/pages/pagename.fr.md
```

### 2. Copy Content

Transfer content from translation JSON files to markdown:

**Before (en.json):**
```json
{
  "pagename_title": "Page Title",
  "pagename_intro": "Introduction text here."
}
```

**After (pagename.en.md):**
```markdown
# Page Title

Introduction text here.
```

### 3. Update Component

Replace translation function calls with markdown loading:

**Before:**
```tsx
import * as m from '../paraglide/messages.js'

function Page() {
  return (
    <div>
      <h1>{m.pagename_title()}</h1>
      <p>{m.pagename_intro()}</p>
    </div>
  )
}
```

**After:**
```tsx
import { useState, useEffect } from 'react'
import { MarkdownContent } from '../components/MarkdownContent'
import { loadMarkdownContent } from '../lib/markdown'

function Page() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarkdownContent('pagename')
      .then(setContent)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return <MarkdownContent content={content} />
}
```

### 4. Remove Old Translation Keys

Clean up the translation JSON files by removing the old keys.

## When to Use Markdown

Use markdown for:
- ✅ Long-form content (terms, privacy, security documentation)
- ✅ Content that changes frequently
- ✅ Content with complex formatting
- ✅ Legal documents
- ✅ Educational content

Use translation keys for:
- ❌ Short UI strings (buttons, labels)
- ❌ Form validation messages
- ❌ Navigation items
- ❌ Simple headings and CTAs

## Localization Workflow

1. **Write English Content First**: Create `pagename.en.md`
2. **Translate**: Create German and French versions
3. **Review**: Have native speakers review translations
4. **Deploy**: Commit all three language files together

## Troubleshooting

### Content Not Loading

Check that:
- File exists in `content/pages/`
- Filename matches pattern: `{pageName}.{locale}.md`
- File has `.md` extension
- Content is valid markdown

### Styling Issues

The `MarkdownContent` component includes default styling. To customize:

```tsx
<MarkdownContent
  content={content}
  className="custom-class-here"
/>
```

### Locale Not Detected

The system uses Paraglide's `languageTag()` to detect locale. Ensure:
- Paraglide is configured correctly
- Route includes locale parameter if needed
- Fallback to English works if translation missing

## Contributing

When adding new content pages:

1. Create markdown files for all supported languages (en, de, fr)
2. Update this README if adding new pages
3. Test loading in all three languages
4. Ensure markdown renders correctly
5. Check responsive design on mobile

## Pages Using Markdown

Currently using markdown content system:

- ✅ `/security` - Security and phishing education
- ✅ `/terms` - Terms of service
- ✅ `/privacy` - Privacy policy

## Future Enhancements

Potential improvements:

- [ ] Add MDX support for interactive components
- [ ] Pre-render markdown at build time for performance
- [ ] Add table of contents generation
- [ ] Support for markdown frontmatter metadata
- [ ] Automated translation workflows
- [ ] Content validation and linting
