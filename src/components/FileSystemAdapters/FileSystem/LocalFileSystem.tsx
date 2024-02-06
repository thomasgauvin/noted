// The main function of this file is to define the operations for the local file system as functions
// and pass them down to the Folder component. The Folder component is then responsible for rendering
// and calling them

import { useEffect } from "react";
import DirectoryNode, {
  createDirectoryNode,
} from "../../../models/DirectoryNode";
import { Folder } from "./Folder";

//sample react function
export const LocalFileSystem = ({
  selectedDirectory,
  setSelectedDirectory,
  selectedFile,
  setSelectedFile,
}: {
  selectedDirectory: DirectoryNode | null;
  setSelectedDirectory: (directory: DirectoryNode | null) => void;
  selectedFile: DirectoryNode | undefined;
  setSelectedFile: (node: DirectoryNode | undefined) => Promise<void>;
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

  const handleDirectorySelect = async () => {
    try {
      const directoryHandle = await (window as any).showDirectoryPicker();
      setSelectedDirectory(
        await createDirectoryNode(directoryHandle, undefined)
      );
    } catch (error) {
      console.error("Error selecting directory:", error);
    }
  };

  const getDirectoryRecursive = async (
    directoryHandle: FileSystemDirectoryHandle
  ) => {
    const rootDirectoryNode = await createDirectoryNode(directoryHandle);
    return rootDirectoryNode;
  };

  const handleFileSelect = async (node: DirectoryNode) => {
    setSelectedFile(node);
  };

  const handleDeleteFile = async (node: DirectoryNode) => {
    console.log("deleting file");
    const parent = await node.delete();
    setSelectedFile(getClosestParentsFirstFile(parent)); // TODO: set to root directory
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

  const getClosestParentsFirstFile = (
    node: DirectoryNode | undefined
  ): DirectoryNode | undefined => {
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
    <div className="min-w-16 bg-zinc-50 overflow-y-scroll max-w-96">
      {selectedDirectory && (
        <div className="divide-y font-semibold text-base">
          <div className="text-sm p-2 text-slate-500">
            {selectedDirectory.getName()}
          </div>
          <div className="font-normal p-1">
            <Folder
              node={selectedDirectory}
              depth={0}
              handleFileSelect={handleFileSelect}
              currentlySelectedFile={selectedFile}
              handleDeleteFile={handleDeleteFile}
              handleCreateFile={handleCreateFile}
              handleCreateFolder={handleCreateFolder}
            />
          </div>
        </div>
      )}
      {!selectedDirectory && (
        <button onClick={handleDirectorySelect}>Select Directory</button>
      )}
    </div>
  );
};
