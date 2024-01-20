import { useState, useEffect } from "react";
import DirectoryNode from "../../../models/DirectoryNode";
import { set } from "remirror";
import { Folder } from "./Folder";

//sample react function
export const LocalFileSystem = ({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: DirectoryNode | null;
  setSelectedFile: (file: DirectoryNode | null) => void;
}) => {
  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryNode | null>(null);

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

  const createDirectoryNode = async (
    directoryHandle: FileSystemDirectoryHandle,
    parent?: DirectoryNode
  ): Promise<DirectoryNode> => {
    const entries: DirectoryNode[] = [];

    let directoryNode = new DirectoryNode(
      directoryHandle.name,
      false,
      entries,
      undefined,
      directoryHandle,
      parent
    );

    //@ts-ignore
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === "directory") {
        const subdirectoryHandle = entry as FileSystemDirectoryHandle;
        const subdirectoryNode = await createDirectoryNode(
          subdirectoryHandle,
          directoryNode
        );
        entries.push(subdirectoryNode);
      } else {
        const fileHandle = entry as FileSystemFileHandle;
        const fileNode = new DirectoryNode(
          entry.name,
          false,
          [],
          fileHandle,
          undefined,
          directoryNode
        );
        console.log(
          "created file node, full path should be:",
          fileNode.getFullPath()
        );
        entries.push(fileNode);
      }
    }

    directoryNode.children = entries;

    return directoryNode;
  };

  const handleFileSelect = async (node: DirectoryNode) => {
    await node.loadFileContent();
    setSelectedFile(node);
  };

  return (
    <div>
      {selectedDirectory && (
        <div className="divide-y font-semibold text-base">
          <div className="text-sm p-2 text-slate-500">
            {selectedDirectory.name}
          </div>
          <div className="font-normal">
            <Folder
              node={selectedDirectory}
              depth={0}
              handleFileSelect={handleFileSelect}
            />
          </div>
        </div>
      )}
      <button onClick={handleDirectorySelect}>Select Directory</button>
    </div>
  );
};
