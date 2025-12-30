# Architecture

## Project Structure

```
src/
├── pages/
│   └── Editor.tsx                 # Main layout (sidebar + editor)
├── components/
│   ├── FileSystemAdapters/FileSystem/
│   │   ├── LocalFileSystem.tsx    # File operations orchestrator
│   │   ├── FileSystemItem.tsx     # Recursive folder tree renderer
│   │   ├── RightClickMenu.tsx     # Context menu UI
│   │   ├── WorkspaceSelector.tsx  # Initial folder picker
│   │   └── GettingStartedHelper.tsx
│   ├── MarkdownEditor/
│   │   ├── RemirrorComponent.tsx  # Editor instance
│   │   ├── FileEditor.tsx         # File content manager
│   │   ├── RemirrorMarkdownToolbar.tsx
│   │   └── RemirrorMarkdownEditor.tsx
│   └── ui/                        # Button, ResizableSidebar, etc.
└── models/
    └── DirectoryNode.ts           # Core file tree model
```

## Data Flow

### File Tree Management
- `DirectoryNode` — Wraps `FileSystemFileHandle` and `FileSystemDirectoryHandle` from the browser API
- Maintains parent-child relationships and tracks unsaved changes
- Methods: `createFile()`, `createFolder()`, `delete()`, `renameFile()`, `moveNodeToNewParent()`

### Editor State
1. `Editor.tsx` holds `selectedFile` and `selectedDirectory` state
2. `LocalFileSystem` orchestrates file operations (CRUD, rename, move)
3. `FileEditor` loads/saves markdown content via `DirectoryNode.loadFileContent()` and `saveFileContent()`
4. `FileSystemItem` recursively renders the file tree with drag-and-drop

### Rendering Flow
```
Editor.tsx (state)
├── WorkspaceSelector (initial folder pick)
├── ResizableSidebar
│   └── LocalFileSystem
│       └── FileSystemItem (recursive tree)
└── FileEditor
    └── RemirrorComponent (markdown editor)
```

## Key Patterns

### Force Rerender Counter
File operations mutate `DirectoryNode` objects directly (to avoid expensive re-creates). A `forceRerenderCounter` is incremented after mutations and passed as the React key to force tree re-renders.

### Conflict Handling
When creating files/folders with duplicate names, the app appends `(1)`, `(2)`, etc.: `Untitled.md` → `Untitled (1).md`

### Image Blob URLs
Images are loaded as blob URLs for display, then converted back to relative paths on save. Mapping stored in `DirectoryNode.replacedImages`.

### Drag & Drop
Implemented via React DOM events on `FileSystemItem`. Drops trigger `moveNodeToNewParent()` which uses the browser API to move files.

## Limitations

- **Browser-only**: No Node.js filesystem access (security restriction)
- **Single directory scope**: Can only access one folder at a time (File System Access API constraint)
- **Image handling**: Images must be in the same folder hierarchy as the notes
- **No sync**: No built-in backup or sync to cloud
