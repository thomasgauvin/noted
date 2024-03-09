import { useState } from "react";
import DirectoryNode from "../../../models/DirectoryNode";
import { ChevronDown, ChevronRight, FilePlus, FolderPlus } from "lucide-react";
import RightClickMenu from "./RightClickMenu";
import * as ContextMenu from "@radix-ui/react-context-menu";

export function FileSystemItem({
  node,
  depth,
  handleFileSelect,
  currentlySelectedFile,
  handleDeleteFile,
  handleCreateFile,
  handleCreateFolder,
  handleRenameFolder,
  handleRenameFile,
}: {
  node: DirectoryNode;
  depth: number;
  handleFileSelect: (file: DirectoryNode) => void;
  currentlySelectedFile: DirectoryNode | undefined;
  handleDeleteFile: (node: DirectoryNode) => void;
  handleCreateFile: (node: DirectoryNode) => void;
  handleCreateFolder: (node: DirectoryNode) => void;
  handleRenameFolder: (node: DirectoryNode) => void;
  handleRenameFile: (node: DirectoryNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth === 0);

  return (
    <div key={node.getName()} className="select-none">
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
                  size={15}
                  className="cursor-pointer"
                  onClick={(e) => {
                    handleCreateFile(node);
                    e.stopPropagation();
                  }}
                />
              </div>
              <div className="flex items-center py-1 px-0.5 ml-0.5 hover:bg-zinc-300 text-zinc-400 hover:text-zinc-600 rounded">
                <FolderPlus
                  size={15}
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
        {node.children.map((child) => (
          <div key={child.getName()}>
            <ContextMenu.Root>
              <ContextMenu.Trigger className="ContextMenuTrigger">
                {!child.isDirectory() ? ( // Render file or folder depending on amount of children
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
                    node={child}
                    depth={depth + 1}
                    handleFileSelect={handleFileSelect}
                    currentlySelectedFile={currentlySelectedFile}
                    handleDeleteFile={handleDeleteFile}
                    handleCreateFile={handleCreateFile}
                    handleCreateFolder={handleCreateFolder}
                    handleRenameFolder={handleRenameFolder}
                    handleRenameFile={handleRenameFile}
                  /> // Recursively render directory
                )}
              </ContextMenu.Trigger>
              <RightClickMenu
                onCreateFile={
                  child.isDirectory()
                    ? () => handleCreateFile(child)
                    : undefined
                }
                onCreateFolder={
                  child.isDirectory()
                    ? () => handleCreateFolder(child)
                    : undefined
                }
                onDelete={() => handleDeleteFile(child)}
                onRename={
                  child.isDirectory() ? 
                  () => handleRenameFolder(child) :
                  () => handleRenameFile(child)
                }
              />
            </ContextMenu.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
