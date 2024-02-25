class DirectoryNode {
  id: string;
  name: string;
  isExpanded: boolean;
  children: DirectoryNode[];
  fileContent: string; // Store file content here when loaded
  unsavedChanges: boolean; // Indicator for unsaved changes
  fileHandle?: FileSystemFileHandle;
  directoryHandle?: FileSystemDirectoryHandle;
  parent?: DirectoryNode;
  blobUrl?: string;
  replacedImages: { [key: string]: string } = {};
  frontmatter: string | null;

  constructor(
    name: string,
    isExpanded: boolean = false,
    children: DirectoryNode[] = [],
    fileHandle?: FileSystemFileHandle,
    directoryHandle?: FileSystemDirectoryHandle,
    parent?: DirectoryNode,
    fileContent?: string,
    unsavedChanges?: boolean,
    id?: string,
    blobUrl?: string,
    replacedImages?: { [key: string]: string },
    frontmatter?: string | null
  ) {
    this.name = name;
    this.isExpanded = isExpanded;
    this.children = children;
    this.fileHandle = fileHandle;
    this.directoryHandle = directoryHandle;
    this.parent = parent;
    this.fileContent = fileContent || "";
    this.unsavedChanges = unsavedChanges || false;
    this.id = id || Math.random().toString(36).substr(2, 9);
    this.blobUrl = blobUrl;
    this.replacedImages = replacedImages || {};
    this.frontmatter = frontmatter || null;
  }

  getId(): string {
    return this.id;
  }

  getName(): string | null {
    return (
      removeMdExtension(this.fileHandle?.name) ||
      removeMdExtension(this.directoryHandle?.name) ||
      null
    );
  }

  getFullPath(): string {
    if (this.parent) {
      const parentPath = this.parent.getFullPath();
      return `${parentPath}/${this.name}`;
    }

    if (this.directoryHandle) {
      return this.directoryHandle.name;
    }

    if (this.fileHandle) {
      return `${this.name}`;
    }

    return this.name;
  }

  extractFrontmatter(markdownContent: string): {
    markdownContent: string;
    frontmatter: string | null;
  } {
    const frontmatterRegex = /^---\n([\s\S]+?)\n---\n/;
    const match = markdownContent.match(frontmatterRegex);
    if (match) {
      return {
        markdownContent: markdownContent.replace(match[0], ""),
        frontmatter: match[1].trim(),
      };
    } else {
      return {
        markdownContent,
        frontmatter: null,
      };
    }
  }

  async loadFileContent(): Promise<string | null> {
    this.getFullPath();

    if (!this.fileContent) {
      if (this.fileHandle) {
        try {
          const file = await this.fileHandle.getFile();
          const content = await file.text();

          const updatedMarkdownContent =
            this.replaceRelativeLinksWithBlobURLs(content);

          const {
            markdownContent: markdownContentWithFrontmatterExtracted,
            frontmatter,
          } = this.extractFrontmatter(updatedMarkdownContent);

          // console.log(markdownContentWithFrontmatterExtracted, frontmatter);

          this.fileContent = markdownContentWithFrontmatterExtracted;
          this.frontmatter = frontmatter;
          return updatedMarkdownContent;
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

  updateFileContent(content: string): DirectoryNode {
    this.fileContent = content;
    this.unsavedChanges = true; // Set the indicator for unsaved changes

    // Update the children of the parent if it exists
    if (this.parent && this.parent.children) {
      this.parent.children = this.parent.children.map((child) => {
        if (child.name === this.name) {
          return this;
        } else {
          return child;
        }
      });
    }

    return this;
  }

  async saveFileContent(): Promise<void> {
    if (this.fileHandle) {
      const writable = await this.fileHandle.createWritable();

      //TODO: change this to use the updated markdown content
      const fileContentWithReplacedImages =
        this.replaceBlobURLsWithRelativeLinks(this.fileContent);

      const fileContentWithFrontmatter = this.frontmatter
        ? `---\n${this.frontmatter}\n---\n${fileContentWithReplacedImages}`
        : fileContentWithReplacedImages;

      await writable.write(fileContentWithFrontmatter || "");
      await writable.close();
    }

    this.unsavedChanges = false; // Reset the indicator for unsaved changes

    // Update the children of the parent if it exists
    if (this.parent && this.parent.children) {
      this.parent.children = this.parent.children.map((child) => {
        if (child.getId() === this.getId()) {
          return this;
        } else {
          return child;
        }
      });
    }
  }

  //create a rename function for folder
  async renameFolder(newName: string): Promise<void | Error> {
    const newFolderName = newName;

    if(this.directoryHandle && this.parent && this.parent.directoryHandle){
      //search the parent to see if the file with the new name already exists
      let existingFolderHandle;
      try {
        existingFolderHandle =
          await this.parent.directoryHandle?.getDirectoryHandle(newFolderName, {
            create: false,
          });
      } catch (error) {
        if (existingFolderHandle) {
          return new Error("Folder already exists"); //not expected to happen since it doesn't fail when it finds the file
        }
      }

      if (existingFolderHandle) {
        return new Error("Folder already exists"); //not expected to happen since it doesn't fail when it finds the file
      }

      //create new directory for new name
      const newFolderHandle =
        await this.parent.directoryHandle.getDirectoryHandle(newFolderName, {
          create: true,
        });

      await copyDirectory(this.directoryHandle, newFolderHandle);

      //update the new folder node with the new name
      const newFolderNode = await createDirectoryNode(
        newFolderHandle,
        this.parent
      );

      const parent = this.parent;

      //delete the folder
      await this.parent?.directoryHandle?.removeEntry(
        this.directoryHandle.name,
        {
          recursive: true,
        }
      );

      //update the children of the parent
      //@ts-expect-error
      parent.children = parent.children.map((child) => {
        if (child.name === this.name) {
          return newFolderNode;
        } else {
          return child;
        }
      });
    }
  }

  async renameFile(newName: string): Promise<void | Error> {
    console.log("in rename file, renaming to:", newName);

    const newFileName = addMdExtension(newName) || newName;

    console.log("new file name:", newFileName);

    if (this.fileHandle && this.parent) {
      //search the parent to see if the file with the new name already exists
      let existingFileHandle;
      try {
        existingFileHandle = await this.parent.directoryHandle?.getFileHandle(
          newFileName,
          {
            create: false,
          }
        );
      } catch (error) {
        if (existingFileHandle) {
          console.log("returning error and exiting");
          return new Error("File already exists"); //not expected to happen since it doesn't fail when it finds the file
        } else {
          console.log("ignoring error and creating file");

          //do nothing, error is thrown when we attempt to get file handler but no file is present
        }
      }

      if (existingFileHandle) {
        console.log("returning error and exiting");
        return new Error("File already exists"); //not expected to happen since it doesn't fail when it finds the file
      }

      //@ts-ignore
      await this.fileHandle.move(newFileName);

      //update the current node with the new file name
      const oldName = this.name;
      this.name = newFileName;

      console.log("renamed file, updating name", this.fileHandle.name);

      //update the children of the parent
      this.parent.children = this.parent.children.map((child) => {
        if (child.name === oldName) {
          return this;
        } else {
          return child;
        }
      });
    }
  }

  getCopy(): DirectoryNode {
    return new DirectoryNode(
      this.name,
      this.isExpanded,
      this.children,
      this.fileHandle,
      this.directoryHandle,
      this.parent,
      this.fileContent,
      this.unsavedChanges,
      this.id,
      this.blobUrl,
      this.replacedImages,
      this.frontmatter
    );
  }

  // Helper method to check if the node represents a directory
  isDirectory(): boolean {
    return !!this.directoryHandle;
  }

  isFile(): boolean {
    return !this.isDirectory();
  }

  //function is markdown
  isMarkdown(): boolean {
    return this.name.endsWith(".md");
  }

  replaceBlobURLsWithRelativeLinks = (markdownContent: string) => {
    const regex =
      /!\[([^\]]*)\]\((.*(\(([^()]*|\(([^()]*|\([^()]*\))*\))*\))*)\s("(?:.*[^"])")?\s*\)/g; // only matches images on their one lines (follow by new line character)

    const updatedMarkdownContent = markdownContent.replaceAll(
      regex,
      (match, altText, blobUrl, _) => {
        // imagePath now contains the relative path to the image
        // Use this information to construct the blob URL or any other logic
        // Here, I'm assuming you have a map of relative paths to blob URLs in your DirectoryNode
        const relativeFilePath = this.replacedImages[blobUrl];

        if (relativeFilePath) {
          match = match.replace(blobUrl, relativeFilePath);
        }

        return match;

        // If a blob URL is found, use it; otherwise, keep the original relative link
        return relativeFilePath ? `![${altText}](${relativeFilePath})` : match;
      }
    );

    return updatedMarkdownContent;
  };

  replaceRelativeLinksWithBlobURLs = (markdownContent: string) => {
    console.log("called replace relative links");
    const regex =
      /!\[([^\]]*)\]\((.*(\(([^()]*|\(([^()]*|\([^()]*\))*\))*\))*)\s("(?:.*[^"])")?\s*\)/g; // only matches images on their one lines (follow by new line character)

    const updatedMarkdownContent = markdownContent.replaceAll(
      regex,
      (match, altText, imagePath, imageTitle) => {
        console.log(
          "in replace relative links",
          match,
          altText,
          imagePath,
          imageTitle
        );
        // imagePath now contains the relative path to the image
        // Use this information to construct the blob URL or any other logic
        // Here, I'm assuming you have a map of relative paths to blob URLs in your DirectoryNode
        const blobUrl = this.findNodeByRelativePath(imagePath)?.blobUrl;

        if (blobUrl) {
          this.replacedImages[blobUrl] = imagePath;
          match = match.replace(imagePath, blobUrl);
        }

        console.log(blobUrl);

        return match;

        // If a blob URL is found, use it; otherwise, keep the original relative link
        return blobUrl ? `![${altText}](${blobUrl})` : match;
      }
    );

    return updatedMarkdownContent;
  };

  findNodeByRelativePath = (
    relativePath: string
  ): DirectoryNode | undefined => {
    console.log("relative path:", relativePath);
    // Split the relative path into individual segments
    const pathSegments = relativePath.split("/");

    // Start from the current node parent
    let currentNode: DirectoryNode | undefined = this.parent;

    for (let segment of pathSegments) {
      // Handle parent directory indicator ".."
      if (segment === ".") {
        continue;
      }
      if (segment === "..") {
        if (!currentNode?.parent) {
          // If the current node does not have a parent, return null, we weren't able to find the node
          return undefined;
        }
        currentNode = currentNode?.parent;
      } else {
        // Find the child node with the matching name
        const matchingChild = currentNode?.children.find(
          (child) => child.name === segment
        );

        if (matchingChild?.isDirectory()) {
          currentNode = matchingChild;
          continue;
        }

        if (!matchingChild) {
          // If the child is not found or is not a directory, return undefined
          return undefined;
        }

        currentNode = matchingChild;
      }
    }

    return currentNode;
  };

  async delete(skipConfirmation?: boolean): Promise<DirectoryNode | undefined> {
    //return parent if it exists
    if (!skipConfirmation) {
      //ask the user to confirm deletion
      const confirmation = confirm(
        `Are you sure you want to delete ${this.name}? This cannot be reversed.`
      );

      if (!confirmation) {
        return;
      }
    }

    //if this is a file, delete it, use removeEntry on the parent
    if (this.fileHandle) {
      await this.parent?.directoryHandle?.removeEntry(this.fileHandle.name);
    }

    //if this is a folder, ask the
    if (this.directoryHandle) {
      //delete all the files in the folder
      try{
        for (const child of this.children) {
          await child.delete(true);
        }
      }
      catch(error){
        console.log("error deleting child", error); //possible that the file has been moved and can't be deleted
      }

      //delete the folder
      await this.parent?.directoryHandle?.removeEntry(
        this.directoryHandle.name
      );
    }

    // Update the children of the parent if it exists
    if (this.parent && this.parent.children) {
      let tempChildren = [];
      for (const child of this.parent.children) {
        if (child.getId() !== this.getId()) {
          tempChildren.push(child);
        }
      }
      console.log(tempChildren);
      this.parent.children = tempChildren;
    }

    return this.parent;
  }

  async createFile(fileName: string): Promise<DirectoryNode | undefined> {
    if (!this.directoryHandle) {
      throw new Error("Directory handle not found");
    }

    //try to get the file to see if it already exists
    let existingFileHandle;
    try {
      existingFileHandle = await this.directoryHandle?.getFileHandle(fileName, {
        create: false,
      });
    } catch (error) {
      //do nothing, error is thrown when we attempt to get file handler but no file is present which is expected
    }

    if (existingFileHandle) {
      throw new Error("File already exists"); //not expected to happen since it doesn't fail when it finds the file
      return;
    }

    //search the parent to see if the file with the new name already exists
    let newFileHandle;
    try {
      newFileHandle = await this.directoryHandle.getFileHandle(fileName, {
        create: true,
      });
    } catch (error) {
      if (newFileHandle) {
        throw new Error("File already exists"); //not expected to happen since it doesn't fail when it finds the file
      }
    }

    //create the DirectoryNode for the new file
    const newFileNode = new DirectoryNode(
      fileName,
      false,
      [],
      newFileHandle,
      undefined,
      this
    );

    //add the new file to the parent
    this.children.push(newFileNode);

    return newFileNode;
  }

  async createFolder(folderName: string): Promise<DirectoryNode | undefined> {
    console.log("in create folder");
    if (!this.directoryHandle) {
      throw new Error("Directory handle not found");
    }

    //try to get the folder to see if it already exists
    let existingFolderHandle;
    try {
      existingFolderHandle = await this.directoryHandle?.getDirectoryHandle(
        folderName,
        {
          create: false,
        }
      );
    } catch (error) {
      //do nothing, error is thrown when we attempt to get file handler but no file is present which is expected
    }

    if (existingFolderHandle) {
      throw new Error("Folder already exists"); //not expected to happen since it doesn't fail when it finds the file
      return;
    }

    //search the parent to see if the file with the new name already exists
    let newFolderHandle;
    try {
      newFolderHandle = await this.directoryHandle.getDirectoryHandle(
        folderName,
        {
          create: true,
        }
      );
    } catch (error) {
      if (newFolderHandle) {
        throw new Error("Folder already exists"); //not expected to happen since it doesn't fail when it finds the file
      }
    }

    //create the DirectoryNode for the new file
    const newFolderNode = new DirectoryNode(
      folderName,
      false,
      [],
      undefined,
      newFolderHandle,
      this
    );

    //add the new file to the parent
    this.children.push(newFolderNode);

    return newFolderNode;
  }
}

export default DirectoryNode;

// Add ".md" extension to a file name
const addMdExtension = (fileName: string | undefined) => {
  if (!fileName) {
    return null;
  }
  return fileName.endsWith(".md") ? fileName : `${fileName}.md`;
};

// Remove ".md" extension from a file name
const removeMdExtension = (fileName: string | undefined) => {
  if (!fileName) {
    return null;
  }
  return fileName.endsWith(".md") ? fileName.slice(0, -3) : fileName;
};

export const createDirectoryNode = async (
  directoryHandle: FileSystemDirectoryHandle,
  parent?: DirectoryNode
): Promise<DirectoryNode | null> => {
  const entries: DirectoryNode[] = [];

  if (
    directoryHandle.name === "node_modules" ||
    directoryHandle.name.startsWith(".")
  )
    return null;

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
    console.log("getting all entries");
    console.log(entry);
    const acceptedFileExtensions = [
      ".md",
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
    ];

    if (
      entry.kind === "file" &&
      !acceptedFileExtensions.some((extension) =>
        entry.name.toLowerCase().endsWith(extension)
      )
    ) {
      continue;
    }

    if (entry.kind === "directory") {
      const subdirectoryHandle = entry as FileSystemDirectoryHandle;
      const subdirectoryNode = await createDirectoryNode(
        subdirectoryHandle,
        directoryNode
      );
      if (subdirectoryNode) {
        entries.push(subdirectoryNode);
      }
    } else {
      const fileHandle = entry as FileSystemFileHandle;

      const file = await fileHandle.getFile();

      console.log(file);
      let blobUrl = undefined;
      if (file.type.startsWith("image/")) {
        //create a blob url for the image
        const blob = new Blob([file], { type: file.type });
        blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl);
      }

      const fileNode = new DirectoryNode(
        entry.name,
        false,
        [],
        fileHandle,
        undefined,
        directoryNode,
        undefined,
        undefined,
        undefined,
        blobUrl
      );
      entries.push(fileNode);
    }
  }

  directoryNode.children = entries;

  return directoryNode;
};

async function copyDirectory(sourceDirectoryHandle: FileSystemDirectoryHandle, targetDirectoryHandle: FileSystemDirectoryHandle) {
  //@ts-expect-error
  for await (const [name, entry] of sourceDirectoryHandle.entries()) {
    if (entry.kind === "directory") {
      const newDirectoryHandle = await targetDirectoryHandle.getDirectoryHandle(name, {
        create: true,
      });
      await copyDirectory(entry, newDirectoryHandle);
    } else {
      const subdirectoryHandle = entry as FileSystemDirectoryHandle;
      //@ts-expect-error
      await subdirectoryHandle.move(targetDirectoryHandle, name);
    }
  }
}