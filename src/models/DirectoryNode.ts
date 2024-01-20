class DirectoryNode {
  name: string;
  isExpanded: boolean;
  children: DirectoryNode[];
  fileContent?: string; // Store file content here when loaded
  unsavedChanges: boolean; // Indicator for unsaved changes

  fileHandle?: FileSystemFileHandle;
  directoryHandle?: FileSystemDirectoryHandle;
  parent?: DirectoryNode;
  fullPath?: string;

  constructor(
    name: string,
    isExpanded: boolean = false,
    children: DirectoryNode[] = [],
    fileHandle?: FileSystemFileHandle,
    directoryHandle?: FileSystemDirectoryHandle,
    parent?: DirectoryNode,
    fullPath?: string
  ) {
    this.name = name;
    this.isExpanded = isExpanded;
    this.children = children;
    this.fileHandle = fileHandle;
    this.directoryHandle = directoryHandle;
    this.parent = parent;
    this.fullPath = fullPath;
    this.fileContent = "";
    this.unsavedChanges = false;
  }

  getFullPath(): string {
    if (this.parent) {
      console.log("in this parent");
      const parentPath = this.parent.getFullPath();
      return `${parentPath}/${this.name}`;
    }

    if (this.directoryHandle) {
      console.log("in direcotry handler");
      return this.directoryHandle.name;
    }

    if (this.fileHandle) {
      console.log("in file handler");
      return `${this.name}`;
    }

    return this.name;
  }

  async loadFileContent(): Promise<string | null> {
    this.getFullPath();

    if (!this.fileContent) {
      if (this.fileHandle) {
        try {
          const file = await this.fileHandle.getFile();
          const content = await file.text();
          this.fileContent = content;
          return content;
        } catch (error) {
          console.error("Error reading file content:", error);
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  updateFileContent(content: string): void {
    console.log("in update file content", content);
    this.fileContent = content;
    this.unsavedChanges = true; // Set the indicator for unsaved changes
  }

  async saveFileContent(): Promise<void> {
    if (this.fileHandle) {
      const writable = await this.fileHandle.createWritable();
      await writable.write(this.fileContent || "");
      await writable.close();
      this.unsavedChanges = false; // Reset the indicator after saving
    }
  }
}

export default DirectoryNode;
