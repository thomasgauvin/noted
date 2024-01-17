import { useCallback, useState, useEffect } from "react";
import { OnChangeJSON, Remirror, useHelpers, useKeymap } from "@remirror/react";
import { EditorComponent } from "@remirror/react";
import { Menu } from "./RemirrorMenu";
import { RemirrorMarkdownEditor } from "./RemirrorMarkdownEditor";

// Hooks can be added to the context without the need for creating custom components
const hooks = [
  () => {
    const { getJSON, getMarkdown } = useHelpers();

    const handleSaveShortcut = useCallback(
      ({ state }) => {
        console.log(`Save to backend: ${JSON.stringify(getJSON(state))}`);

        return true; // Prevents any further key handlers from being run.
      },
      [getJSON]
    );

    // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS
    useKeymap("Mod-s", handleSaveShortcut);
  },
];

export const RemirrorComponent: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState(basicContent);

  useEffect(() => {
    console.log(`Markdown content: ${markdownContent}`);
  }, [markdownContent]);

  return (
    <div style={{ padding: 16 }}>
      <RemirrorMarkdownEditor
        initialContent={markdownContent}
        hooks={hooks}
        persistMarkdown={(markdown: string) => setMarkdownContent(markdown)}
      ></RemirrorMarkdownEditor>
    </div>
  );
};

const basicContent = `
**Markdown** content is the _best_

<br>

# Heading 1

<br>

## Heading 2

<br>

### Heading 3

<br>

#### Heading 4

<br>

##### Heading 5

<br>

###### Heading 6

<br>

> Blockquote

\`\`\`ts
const a = 'asdf';
\`\`\`

playtime is just beginning

## List support

- an unordered
  - list is a thing
    - of beauty

1. As is
2. An ordered
3. List
`;
