import { useState } from "react";
import { LocalFileSystem } from "../components/FileSystemAdapters/FileSystem/LocalFileSystem";
import { FileEditor } from "../components/MarkdownEditor/FileEditor";
import DirectoryNode from "../models/DirectoryNode";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { WorkspaceSelector } from "../components/FileSystemAdapters/FileSystem/WorkspaceSelector";

export const EditorPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DirectoryNode | undefined>(
    undefined
  ); // [selectedFile, setSelectedFile
  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryNode | null>(null);

  const [panelIsOpen, setPanelIsOpen] = useState(true);

  const handleSetSelectedFile = async (node: DirectoryNode | undefined) => {
    if (!node) return;
    await node.loadFileContent();
    setSelectedFile(node);
  };

  return (
    <div className="EditorPage flex h-dvh w-vw overflow-hidden">
      <LocalFileSystem
        selectedDirectory={selectedDirectory}
        setSelectedDirectory={setSelectedDirectory}
        selectedFile={selectedFile}
        setSelectedFile={handleSetSelectedFile}
        hidden={!panelIsOpen || !selectedDirectory}
      />
      <div className="flex flex-1">
        <div
          className={`flex-1 flex flex-col overflow-y-scroll
               scrollbar scrollbar-thumb-zinc-200 scrollbar-track-zinc-100 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full 
               ${selectedFile && selectedFile.isDirectory() ? " pattern-boxes pattern-gray-400 pattern-bg-white pattern-opacity-5 pattern-size-4" : ""}
               `}
        >
          <div className="p-1 sticky top-0 cursor-pointer">
            <div className="w-fit p-1 hover:bg-zinc-200 rounded  text-zinc-400 hover:text-zinc-500 ">
              {panelIsOpen ? (
                <PanelLeftClose
                  onClick={() => setPanelIsOpen(false)}
                  size={20}
                />
              ) : (
                <PanelLeftOpen onClick={() => setPanelIsOpen(true)} size={20} />
              )}
            </div>
          </div>
          <div className="w-full max-w-3xl mx-auto pt-16 flex flex-1 flex-col">
            <div className="m-6">
              {
                selectedFile?.blobUrl && (
                  <div>
                    <img src={selectedFile.blobUrl} />
                  </div>
                )
              }
              {/* {
                selectedFile && selectedFile.isDirectory() && (
                  <div className="bg-red-100">test</div>
                )
              } */}
              {
                selectedFile && selectedFile.isFile() && (
                  <FileEditor
                    selectedFile={selectedFile}
                    setSelectedFile={handleSetSelectedFile}
                  />
                )
              }
            </div>
          </div>
        </div>
        {!selectedDirectory && (
          <WorkspaceSelector
            setSelectedDirectory={setSelectedDirectory}
          />
        )}
      </div>
    </div>
  );
};

