// The main function of this file is to define the operations for the local file system as functions
// and pass them down to the Folder component. The Folder component is then responsible for rendering
// and calling them

import { useEffect } from "react";
import DirectoryNode, {
  createDirectoryNode,
} from "../../../models/DirectoryNode";
import { FileSystemItem } from "./FileSystemItem";
import { FilePlus, FolderPlus } from "lucide-react";

//sample react function
export const LocalFileSystem = ({
  selectedDirectory, //rootDirectory
  setSelectedDirectory,
  selectedFile,
  setSelectedFile,
  hidden
}: {
  selectedDirectory: DirectoryNode | null;
  setSelectedDirectory: (directory: DirectoryNode | null) => void;
  selectedFile: DirectoryNode | null;
  setSelectedFile: (node: DirectoryNode | null) => Promise<void>;
  hidden: boolean;
}) => {
  useEffect(() => {
    const fetchEntries = async () => {
      if (selectedDirectory?.directoryHandle) {
        const directoryNode = await getDirectoryRecursive(
          selectedDirectory.directoryHandle
        );

        setSelectedFile(directoryNode);
      }
    };

    fetchEntries();
  }, [selectedDirectory]);

  const getDirectoryRecursive = async (
    directoryHandle: FileSystemDirectoryHandle
  ) => {
    const rootDirectoryNode = await createDirectoryNode(directoryHandle);
    if (rootDirectoryNode) {
      return rootDirectoryNode;
    } else {
      return null;
    }
  };

  const handleFileSelect = async (node: DirectoryNode) => {
    setSelectedFile(node);
  };

  const handleDeleteFile = async (node: DirectoryNode) => {
    console.log("deleting file");
    await node.delete();

    //determine if the selected file still exists, if it does, set the selected file to it (leave as is), otherwise set it to null
    if(selectedFile){
      const selectedFileAsFoundInCurrentDirectory =
        selectedDirectory?.findChildByPath(selectedFile?.getFullPath());
      if(selectedFileAsFoundInCurrentDirectory){
        setSelectedFile(selectedFileAsFoundInCurrentDirectory.getCopy() || null);
      } else {
        setSelectedFile(null);
      }
    }
    else{
      setSelectedFile(null);
    }
  };

  const createFileHandlingDuplicates = async (parent: DirectoryNode) => {
    console.log("creating file");
    let counter = 0;
    while (true && counter < 100) {
      //limit to 100
      try {
        const node = await parent.createFile(
          counter === 0 ? "Untitled.md" : `Untitled (${counter}).md`
        );
        setSelectedFile(node);
        return;
      } catch (error) {
        counter++;
      }
    }

    throw new Error("Could not create file");
  };

  const handleCreateFile = async (parent: DirectoryNode) => {
    console.log("creating file");

    try {
      createFileHandlingDuplicates(parent);
    } catch (error) {
      console.error("Error creating file:", error);
      alert(
        "Error creating file, too many conflicts when trying to create the file."
      );
    }
  };

  const createFolderHandlingDuplicates = async (parent: DirectoryNode) => {
    let counter = 0;
    while (true && counter < 100) {
      //limit to 100
      try {
        const node = await parent.createFolder(
          counter === 0 ? "Untitled Folder" : `Untitled Folder (${counter})`
        );
        setSelectedFile(node);
        return;
      } catch (error) {
        counter++;
      }
    }

    throw new Error("Could not create folder");
  };

  const handleCreateFolder = async (parent: DirectoryNode) => {
    try {
      createFolderHandlingDuplicates(parent);
    } catch (error) {
      console.error("Error creating folder:", error);
      alert(
        "Error creating folder, too many conflicts when trying to create the folder."
      );
    }
  };

  const handleRenameFolder = async (node: DirectoryNode) => {
    const newName = prompt("Enter new name for folder", node.name);
    if (newName) {
      await node.renameFolder(newName);
      setSelectedFile(selectedFile?.getCopy() || null);
    }
  }

  const handleRenameFile = async (node: DirectoryNode) => {
    const newName = prompt("Enter new name for file", node.getName() || node.name);
    if (newName) {
      await node.renameFile(newName);
      setSelectedFile(selectedFile?.getCopy() || null);
    }
  }

  const getClosestParentsFirstFile = (
    node: DirectoryNode | null
  ): DirectoryNode | null => {
    if (!node) return node;
    if (node.children.length > 0) {
      for (const child of node.children) {
        if (!child.isDirectory()) {
          return child;
        }
      }
    }

    if (node.parent) {
      return getClosestParentsFirstFile(node.parent);
    } else {
      return node;
    }
  };

  return (
    <div
      className={`min-w-16 bg-zinc-50 overflow-y-scroll max-w-80 ${
        hidden ? "hidden" : ""
      }
       scrollbar scrollbar-thumb-zinc-200 scrollbar-track-zinc-100 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full 
    `}
    >
      {selectedDirectory && (
        <div className="divide-y font-semibold text-base">
          <div className="text-sm p-2 text-zinc-500 flex flex-row justify-between">
            <div>{selectedDirectory.getName()}</div>
            <div className="flex flex-row">
              <div className="flex items-center py-1 px-0.5 ml-0.5 hover:bg-zinc-300 text-zinc-400 hover:text-zinc-600 rounded">
                <FilePlus
                  size={15}
                  className="cursor-pointer"
                  onClick={(e) => {
                    handleCreateFile(selectedDirectory);
                    e.stopPropagation();
                  }}
                />
              </div>
              <div className="flex items-center py-1 px-0.5 ml-0.5 hover:bg-zinc-300 text-zinc-400 hover:text-zinc-600 rounded">
                <FolderPlus
                  size={15}
                  className="cursor-pointer  "
                  onClick={(e) => {
                    handleCreateFolder(selectedDirectory);
                    e.stopPropagation();
                  }}
                />
              </div>
            </div>
          </div>
          <div className="font-normal p-1">
            <FileSystemItem
              node={selectedDirectory}
              depth={0}
              handleFileSelect={handleFileSelect}
              currentlySelectedFile={selectedFile}
              handleDeleteFile={handleDeleteFile}
              handleCreateFile={handleCreateFile}
              handleCreateFolder={handleCreateFolder}
              handleRenameFolder={handleRenameFolder}
              handleRenameFile={handleRenameFile}
            />
          </div>
        </div>
      )}
    </div>
  );
};
