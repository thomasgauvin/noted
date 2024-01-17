import { useState, useEffect } from "react";

//sample react function
export const LocalFileSystem = () => {
  const [selectedDirectory, setSelectedDirectory] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [entries, setEntries] = useState<string[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (selectedDirectory) {
        const entries = await getEntriesRecursive(selectedDirectory);
        setEntries(entries.map((entry) => entry.name));
      }
    };

    fetchEntries();
  }, [selectedDirectory]);

  const handleDirectorySelect = async () => {
    try {
      const directoryHandle = await (window as any).showDirectoryPicker();
      setSelectedDirectory(directoryHandle);
    } catch (error) {
      console.error("Error selecting directory:", error);
    }
  };

  const getEntriesRecursive = async (
    directoryHandle: FileSystemDirectoryHandle
  ) => {
    const entries: FileSystemHandle[] = [];

    for await (const entry of directoryHandle.values()) {
      entries.push(entry);

      if (entry.kind === "directory") {
        const subdirectoryHandle = entry as FileSystemDirectoryHandle;
        const subdirectoryEntries = await getEntriesRecursive(
          subdirectoryHandle
        );
        entries.push(...subdirectoryEntries);
      }
    }

    return entries;
  };

  return (
    <div>
      <button onClick={handleDirectorySelect}>Select Directory</button>
      {selectedDirectory && (
        <div>
          <p>Selected Directory: {selectedDirectory.name}</p>
          <ul>
            {entries.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
