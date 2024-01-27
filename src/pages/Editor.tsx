import { useState } from "react";
import { LocalFileSystem } from "../components/FileSystemAdapters/FileSystem/LocalFileSystem";
import { FileEditor } from "../components/MarkdownEditor/FileEditor";
import DirectoryNode, { createDirectoryNode } from "../models/DirectoryNode";

export const EditorPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DirectoryNode | undefined>(
    undefined
  ); // [selectedFile, setSelectedFile
  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryNode | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleSetSelectedFile = async (node: DirectoryNode) => {
    await node.loadFileContent();
    setSelectedFile(node);
  };

  return (
    <div
      className="EditorPage flex h-dvh w-vw overflow-hidden"
      onClick={() => {
        setContextMenuVisible(false);
      }}
      onContextMenu={(e) => {
        setContextMenuVisible(false);
      }}
    >
      <LocalFileSystem
        selectedDirectory={selectedDirectory}
        setSelectedDirectory={setSelectedDirectory}
        selectedFile={selectedFile}
        setSelectedFile={handleSetSelectedFile}
        contextMenuVisible={contextMenuVisible}
        setContextMenuVisible={setContextMenuVisible}
        contextMenuPosition={contextMenuPosition}
        setContextMenuPosition={setContextMenuPosition}
      />
      <div className="flex-1 flex flex-col overflow-scroll">
        <div className="w-full max-w-3xl mx-auto pt-24 flex flex-1 flex-col">
          <div className="m-6">
            {selectedFile?.blobUrl ? (
              <div>
                <img src={selectedFile.blobUrl} />
              </div>
            ) : (
              <FileEditor
                selectedFile={selectedFile}
                setSelectedFile={handleSetSelectedFile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
