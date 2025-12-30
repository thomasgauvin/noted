# Noted

A local-first markdown note-taking app built with React and Remirror. Write, organize, and edit markdown notes directly in your file system with zero server dependencies.

**[Try it now →](https://noted.appsinprogress.com)**

## Features

- **Local-first**: All notes stored in your filesystem—no cloud account required
- **Live markdown editor**: Real-time editing with Remirror WYSIWYG support
- **File browser**: Organize notes in folders with drag-and-drop support
- **Image support**: Embed local images with relative path resolution
- **Frontmatter support**: YAML frontmatter extraction and preservation
- **Unsaved changes tracking**: Visual indicator for modified files
- **Responsive design**: Works on desktop and mobile (sidebar toggles on mobile)
- **Zero dependencies** for file access (uses native File System Access API)

## Quick Start

```bash
npm install
npm run dev
```

Select a local folder to save your notes, then start writing.

## Browser Support

Requires Chrome, Edge, or Opera (desktop versions). Uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API).

## Tech Stack

- **React 18** — UI framework
- **Remirror** — Markdown editor
- **Tailwind CSS** — Styling
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Radix UI** — Accessible components

## Project Status

Early development. Core features (create, read, update, delete, rename, move files) are functional.
