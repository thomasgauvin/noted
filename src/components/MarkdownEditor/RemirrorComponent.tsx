import { useCallback, useState, useEffect, useReducer } from "react";
import { OnChangeJSON, Remirror, useHelpers, useKeymap } from "@remirror/react";
import { EditorComponent } from "@remirror/react";
import { Menu } from "./RemirrorMenu";
import { RemirrorMarkdownEditor } from "./RemirrorMarkdownEditor";
import DirectoryNode from "../../models/DirectoryNode";

// Hooks can be added to the context without the need for creating custom components
const hooks = [
  () => {
    const { getJSON, getMarkdown } = useHelpers();

    const handleSaveShortcut = useCallback(
      ({ state }: any) => {
        console.log(`Save to backend: ${JSON.stringify(getJSON(state))}`);

        return true; // Prevents any further key handlers from being run.
      },
      [getJSON]
    );

    // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS
    useKeymap("Mod-s", handleSaveShortcut);
  },
];

export const RemirrorComponent: React.FC = ({
  selectedFile,
}: {
  selectedFile: DirectoryNode | null;
}) => {
  useEffect(() => {
    console.log(`Markdown content: ${selectedFile?.fileContent}`);
  }, [selectedFile?.fileContent]);

  if (!selectedFile?.fileContent) {
    return <div>Empty file</div>;
  }

  const handleMarkdownChange = (markdown: string) => {
    selectedFile?.updateFileContent(markdown);
  };

  return (
    <div className="ml-4 flex flex-col">
      <div className="flex flex-row justify-end m-1">
        <button
          className={` bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300`}
          onClick={() => {
            selectedFile?.saveFileContent();
          }}
        >
          Save
        </button>
      </div>
      <div className="flex-1 overflow-y-scroll">
        <RemirrorMarkdownEditor
          key={selectedFile?.getFullPath()}
          initialContent={selectedFile?.fileContent}
          hooks={hooks}
          persistMarkdown={handleMarkdownChange}
        ></RemirrorMarkdownEditor>
      </div>
    </div>
  );
};
