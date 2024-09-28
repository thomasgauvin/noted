import { useRef, useState } from "react";
import DirectoryNode from "../../../models/DirectoryNode";
import { ChevronDown, ChevronRight, FilePlus, FolderPlus } from "lucide-react";
import RightClickMenu from "./RightClickMenu";
import * as ContextMenu from "@radix-ui/react-context-menu";

export function FileSystemItem({
  node,
  depth,
  forceRerenderCounter,
  setForceRerenderCounter,
  setSelectedFile,
  setSelectedDirectory,
  handleFileSelect,
  currentlySelectedFile,
  handleDeleteFile,
  handleCreateFile,
  handleCreateFolder,
  handleRenameFolder,
  handleRenameFile,
  draggable
}: {
  node: DirectoryNode;
  depth: number;
  forceRerenderCounter: number;
  setForceRerenderCounter: (counter: number) => void;
  setSelectedFile: (file: DirectoryNode | null) => void;
  setSelectedDirectory: (directory: DirectoryNode | null) => void;
  handleFileSelect: (file: DirectoryNode) => void;
  currentlySelectedFile: DirectoryNode | undefined;
  handleDeleteFile: (node: DirectoryNode) => void;
  handleCreateFile: (node: DirectoryNode) => void;
  handleCreateFolder: (node: DirectoryNode) => void;
  handleRenameFolder: (node: DirectoryNode) => void;
  handleRenameFile: (node: DirectoryNode) => void;
  draggable: boolean
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragEnterCount = useRef(0);

  const handleOnDragStart = (e: React.DragEvent<HTMLDivElement>, node: DirectoryNode) => {
    e.dataTransfer.setData("node_id", node.id);
    console.log(e.dataTransfer.getData("node_id"));
    e.stopPropagation();
  };

  const handleOnDragDrop = async (e: React.DragEvent<HTMLDivElement>, newParent: DirectoryNode) => {
    console.log(e.dataTransfer.getData("node_id"));
    console.log('dropping');
    console.log(newParent);

    e.preventDefault();
    e.stopPropagation();

    const droppedNodeId = e.dataTransfer.getData("node_id");

    //get root node
    const rootNode = node.getRootNode();
    //get dropped node by id from rootNode
    const droppedNode = rootNode.getNodeById(droppedNodeId);

    await droppedNode?.loadFileContent();

    try{
      const newDirectoryNode = await droppedNode?.moveNodeToNewParent(newParent);
      setSelectedFile(newDirectoryNode || null);
      setSelectedDirectory(droppedNode?.getRootNode() || null);
      console.log('new selected directory')
      console.log(droppedNode?.getRootNode());
      console.log("forced rerender");
      setForceRerenderCounter(forceRerenderCounter + 1);
    }
    catch(e){
      console.log(e);
      alert("Could not move file due to conflicting file names in destination.")
    }

    setIsDragOver(false);
    dragEnterCount.current = 0;

  };

  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleOnDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(true);

    dragEnterCount.current += 1;

    e.preventDefault();
    e.stopPropagation();
  };

  const handleOnDragLeave = (e: React.DragEvent<HTMLDivElement>) => {

    dragEnterCount.current -= 1;

    if (dragEnterCount.current <= 0) {
      setIsDragOver(false);
    }

    e.preventDefault();
    e.stopPropagation();
  };

  console.log(node);

  return (
    <div
      key={node.getName()}
      className="select-none outline-zinc-400 rounded outline-dashed outline-0"
      draggable={draggable}
      onDragStart={draggable ? (e) => handleOnDragStart(e, node) : undefined}
      onDrop={(e) => handleOnDragDrop(e, node)}
      onDragOver={handleOnDragOver}
      onDragEnter={handleOnDragEnter}
      onDragLeave={handleOnDragLeave}
      style={isDragOver? { outlineWidth: "1px" } : {}}
    >
      {depth === 0 ? null : (
        <div
          className="p-0.5 hover:bg-zinc-200/70 rounded flex items-center 	"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <div className="p-0.5 hover:bg-zinc-300 rounded flex items-center">
            {expanded ? (
              <ChevronDown size={16} className="cursor-pointer " />
            ) : (
              <ChevronRight size={16} className="cursor-pointer" />
            )}
          </div>

          <div className="flex justify-between w-full items-center">
            <div className="pl-0.5 text-sm">{node.name}</div>
            <div className="flex">
              <div className="flex items-center py-1 px-0.5 ml-0.5 hover:bg-zinc-300 text-zinc-400 hover:text-zinc-600 rounded">
                <FilePlus
                  size={16}
                  className="cursor-pointer"
                  onClick={(e) => {
                    handleCreateFile(node);
                    e.stopPropagation();
                  }}
                />
              </div>
              <div className="flex items-center py-1 px-0.5 ml-0.5 hover:bg-zinc-300 text-zinc-400 hover:text-zinc-600 rounded">
                <FolderPlus
                  size={16}
                  className="cursor-pointer  "
                  onClick={(e) => {
                    handleCreateFolder(node);
                    e.stopPropagation();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`${depth === 0 ? "" : "ml-4"} ${
          expanded ? "block" : "hidden"
        }`}
      >
        {node.getChildren().map((child) => (
          <div key={child.getName()}>
            <ContextMenu.Root>
              <ContextMenu.Trigger className="ContextMenuTrigger">
                {!child.isDirectory ? ( // Render file or folder depending on amount of children
                  <>
                    {child.isMarkdown && child.isMarkdown() ? ( //hide the images
                      <div //background color changes when file is hovered over
                        className={`ml-${(depth + 1) * 20} cursor-pointer
                                    text-sm
                                      p-1 hover:bg-zinc-200/70 rounded ${
                                        child.unsavedChanges ? "italic" : ""
                                      }
                                      ${
                                        currentlySelectedFile?.getFullPath() ===
                                        child.getFullPath()
                                          ? "bg-zinc-200/50"
                                          : ""
                                      }
                                      `}
                        draggable={true}
                        onDragStart={(e) => handleOnDragStart(e, child)}
                        onClick={() => handleFileSelect(child)}
                      >
                        <div className="pl-1">
                          {child.getName()}
                          {child.unsavedChanges ? "*" : ""}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <FileSystemItem
                    key={forceRerenderCounter}
                    node={child}
                    depth={depth + 1}
                    forceRerenderCounter={forceRerenderCounter}
                    setForceRerenderCounter={setForceRerenderCounter}
                    setSelectedFile={setSelectedFile}
                    setSelectedDirectory={setSelectedDirectory}
                    handleFileSelect={handleFileSelect}
                    currentlySelectedFile={currentlySelectedFile}
                    handleDeleteFile={handleDeleteFile}
                    handleCreateFile={handleCreateFile}
                    handleCreateFolder={handleCreateFolder}
                    handleRenameFolder={handleRenameFolder}
                    handleRenameFile={handleRenameFile}
                    draggable={true}
                  /> // Recursively render directory
                )}
              </ContextMenu.Trigger>
              <RightClickMenu
                onCreateFile={
                  child.isDirectory
                    ? () => handleCreateFile(child)
                    : undefined
                }
                onCreateFolder={
                  child.isDirectory
                    ? () => handleCreateFolder(child)
                    : undefined
                }
                onDelete={() => handleDeleteFile(child)}
                onRename={
                  child.isDirectory
                    ? () => handleRenameFolder(child)
                    : () => handleRenameFile(child)
                }
              />
            </ContextMenu.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
