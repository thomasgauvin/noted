import { useEffect, useRef, useState } from "react";
import { LocalFileSystem } from "../components/FileSystemAdapters/FileSystem/LocalFileSystem";
import { FileEditor } from "../components/MarkdownEditor/FileEditor";
import DirectoryNode from "../models/DirectoryNode";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { WorkspaceSelector } from "../components/FileSystemAdapters/FileSystem/WorkspaceSelector";
import ResizableSidebar from "../components/ui/ResizableSidebar";

export const EditorPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DirectoryNode | null>(null); // [selectedFile, setSelectedFile
  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryNode | null>(null);

  //sidebar resizing
  const [panelIsOpen, setPanelIsOpen] = useState(true);
  const [minWidth, maxWidth, defaultWidth] = [250, 400, 300];
  const [width, setWidth] = useState(defaultWidth);

  const handleSetSelectedFile = async (node: DirectoryNode | null) => {
    if (!node) return setSelectedFile(null);
    await node.loadFileContent();
    setSelectedFile(node);
  };

  return (
    <div className="EditorPage flex h-dvh w-vw overflow-hidden">
      <ResizableSidebar
        minWidth={minWidth}
        maxWidth={maxWidth}
        setWidth={setWidth}
        hidden={!panelIsOpen || !selectedDirectory}
      >
        <LocalFileSystem
          selectedDirectory={selectedDirectory}
          setSelectedDirectory={setSelectedDirectory}
          selectedFile={selectedFile}
          setSelectedFile={handleSetSelectedFile}
          hidden={false}
          style={{ width: `${width / 16}rem` }}
          setPanelIsOpen={setPanelIsOpen}
          panelIsOpen={panelIsOpen}
        />
      </ResizableSidebar>
      {!selectedDirectory && (
        <WorkspaceSelector setSelectedDirectory={setSelectedDirectory} />
      )}
      <div className="flex flex-1 h-full">
        <div
          className={`flex-1 flex flex-col md:overflow-y-scroll
                h-full scrollbar scrollbar-thumb-zinc-200 scrollbar-track-zinc-100 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full 
                ${
                  //handle scroll prevention when on mobile and sidebar is open
                  panelIsOpen ? "overflow-clip" : "md:overflow-y-scroll"
                }
                ${
                  panelIsOpen && selectedFile && selectedFile.isFile() ? "md:opacity-100 opacity-50" : ""
                }
                ${
                  !selectedFile || (selectedFile && selectedFile.isDirectory())
                    ? " pattern-boxes pattern-gray-400 pattern-bg-white pattern-opacity-5 pattern-size-4"
                    : ""
                }
              `}
          onClick={() => {
            if (panelIsOpen && window.innerWidth < 768) {
              setPanelIsOpen(false);
            }
          }}
        >
          {selectedFile?.isFile() && (
            <div className="p-1 sticky top-0 cursor-pointer">
              <div className="w-fit p-1 hover:bg-zinc-200 rounded  text-zinc-400 hover:text-zinc-500 ">
                {panelIsOpen ? (
                  <PanelLeftClose
                    onClick={() => setPanelIsOpen(false)}
                    size={20}
                  />
                ) : (
                  <PanelLeftOpen
                    onClick={() => setPanelIsOpen(true)}
                    size={20}
                  />
                )}
              </div>
            </div>
          )}
          <div className="w-full max-w-3xl mx-auto pt-12 flex flex-1 flex-col">
            <div className="m-6">
              {selectedFile?.blobUrl && (
                <div>
                  <img src={selectedFile.blobUrl} />
                </div>
              )}
              {/* {
                  selectedFile && selectedFile.isDirectory() && (
                    <div className="bg-red-100">test</div>
                  )
                } */}
              {selectedFile && selectedFile.isFile() && (
                <FileEditor
                  selectedFile={selectedFile}
                  setSelectedFile={handleSetSelectedFile}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
