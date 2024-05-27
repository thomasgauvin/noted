import { useEffect, useRef, useState, createContext } from "react";
import { LocalFileSystem } from "../components/FileSystemAdapters/FileSystem/LocalFileSystem";
import { FileEditor } from "../components/MarkdownEditor/FileEditor";
import DirectoryNode from "../models/DirectoryNode";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { WorkspaceSelector } from "../components/FileSystemAdapters/FileSystem/WorkspaceSelector";
import ResizableSidebar from "../components/ui/ResizableSidebar";
import { GettingStartedHelper } from "../components/FileSystemAdapters/FileSystem/GettingStartedHelper";

export const SidebarContext = createContext({
  width:300,
  panelIsOpen: true
});

export const EditorPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DirectoryNode | null>(null); // [selectedFile, setSelectedFile
  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryNode | null>(null);

  //sidebar resizing, also used by main section 
  const [panelIsOpen, setPanelIsOpen] = useState(true);
  const [minWidth, maxWidth, defaultWidth] = [250, 400, 300];
  const [width, setWidth] = useState(defaultWidth); 

  const handleSetSelectedFile = async (node: DirectoryNode | null) => {
    if (!node) return setSelectedFile(null);
    await node.loadFileContent();
    setSelectedFile(node);
  };

  return (
    <SidebarContext.Provider
      value={{
        width: width,
        panelIsOpen: panelIsOpen,
      }}
    >
      <div className="EditorPage flex h-dvh w-full overflow-hidden">
        <ResizableSidebar
          minWidth={minWidth}
          maxWidth={maxWidth}
          width={width}
          setWidth={setWidth}
          hidden={!panelIsOpen || !selectedDirectory}
          style={{ maxWidth: `${width}px` }}
        >
          <LocalFileSystem
            selectedDirectory={selectedDirectory}
            setSelectedDirectory={setSelectedDirectory}
            selectedFile={selectedFile}
            setSelectedFile={handleSetSelectedFile}
            hidden={false}
            setPanelIsOpen={setPanelIsOpen}
            panelIsOpen={panelIsOpen}
          />
        </ResizableSidebar>
        {!selectedDirectory && (
          <WorkspaceSelector 
            selectedDirectory={selectedDirectory}
            setSelectedDirectory={setSelectedDirectory} />
        )}
        <main
          //the below css class and style is needed to have the main section take up the remaining space
          //using css calc instead of javascript for resizing upon window resizing
          //I am using ! to signify important such that the class overrides the style because
          //the style needs to be in line since it relies on width state and cannot be outside
          //in css
          className={`flex flex-1 h-full w-full relative grow
          ${panelIsOpen ? `-md:!max-w-full` : ""}
        `}
        >
          {(!selectedDirectory || !selectedFile) && (
              <GettingStartedHelper
                selectedFile={selectedFile}
                selectedDirectory={selectedDirectory}
                setSelectedDirectory={setSelectedDirectory}
              />
            )}
          <div
            className={`flex-1 flex flex-col md:overflow-y-scroll
                h-full scrollbar scrollbar-thumb-zinc-200 scrollbar-track-zinc-100 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full 
                ${
                  //handle scroll prevention when on mobile and sidebar is open
                  panelIsOpen ? "overflow-clip" : "overflow-y-scroll"
                }
                ${
                  panelIsOpen && selectedFile && selectedFile.isFile()
                    ? "md:opacity-100 opacity-50"
                    : ""
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
              <div
                className="p-2 sticky top-0 z-10 bg-white border-b flex items-center
              w-full
            "
              >
                <div
                  className="w-fit p-1 hover:bg-zinc-200 rounded  text-zinc-400 hover:text-zinc-500 cursor-pointer"
                  onClick={() => {
                    setPanelIsOpen(!panelIsOpen);
                  }}
                >
                  {panelIsOpen ? (
                    <PanelLeftClose size={18} />
                  ) : (
                    <PanelLeftOpen size={18} />
                  )}
                </div>
                <div
                  className="ml-2 text-zinc-600 text-sm font-semibold
                max-w-[calc(100%-2rem)] truncate
              "
                >
                  <div
                    className="
                  overflow-ellipsis overflow-hidden whitespace-nowrap min-w-0 word-break break-words"
                  >
                    <span className="-md:hidden">
                      {
                        //if the depth is more than two, remove the middle and leave the first and last with ellipsis
                        selectedFile.getFullPath().split("/").length > 4
                          ? selectedFile.getFullPath().split("/")[0] +
                            " / " +
                            selectedFile.getFullPath().split("/")[1] +
                            " / ... / " +
                            selectedFile.getFullPath().split("/")[
                              selectedFile.getFullPath().split("/").length - 2
                            ] +
                            " / "
                          : selectedFile
                              .getFullPath()
                              .split("/")
                              .slice(0, length - 1)
                              .join(" / ") + " / "
                      }
                    </span>
                    <span>{selectedFile.getFullPath().split("/").pop()}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full max-w-3xl mx-auto pt-12 flex flex-1 flex-col">
              <div className="m-6 sm:m-8 md:m-10">
                {selectedFile?.blobUrl && (
                  <div>
                    <img src={selectedFile.blobUrl} />
                  </div>
                )}
                {selectedFile && selectedFile.isFile() && (
                  <FileEditor
                    selectedFile={selectedFile}
                    setSelectedFile={handleSetSelectedFile}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
};
