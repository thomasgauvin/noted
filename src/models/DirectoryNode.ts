import { addMdExtension, removeMdExtension, extractFrontmatter } from "./MarkdownHelpers";
import { LocalFileSystemProvider } from "./StorageProviders/LocalFileSystemProvider";
import { StorageProvider, instanceOfStorageProvider } from "./StorageProviders/StorageProviderInterface";

//a DirectoryNode is the representation of a file or a directory, held in memory
export default class DirectoryNode {
  id: string;
  name: string;
  isExpanded: boolean;
  children: DirectoryNode[];

  fileContent: string; // Store file content here when loaded
  unsavedChanges: boolean; // Indicator for unsaved changes

  isDirectory: boolean; // Indicator for directory node

  storageProviderHandle?: StorageProvider; //the storage provider object for the specific file/directory in question
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
    isDirectory: boolean,

    storageProviderHandle?: StorageProvider,
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
    this.isDirectory = isDirectory;

    this.storageProviderHandle = storageProviderHandle;
    this.fileHandle = fileHandle;
    this.directoryHandle = directoryHandle;
    this.parent = parent;
    this.fileContent = fileContent || "";
    this.unsavedChanges = unsavedChanges || false;
    this.id = id || Math.random().toString(36).substr(2, 9);
    this.blobUrl = blobUrl;
    this.replacedImages = replacedImages || {};
    this.frontmatter = frontmatter || null;

    this.sortChildrenAlphabetically();
  }

  getChildren(): DirectoryNode[] {
    return this.children;
  }

  isFile(): boolean {
    return !this.isDirectory;
  }

  //function is markdown
  isMarkdown(): boolean {
    return this.name.endsWith(".md");
  }

  getNodeById(id: string): DirectoryNode | null {
    if (this.id === id) {
      return this;
    }
    for (const child of this.children) {
      const node = child.getNodeById(id);
      if (node) {
        return node;
      }
    }
    return null;
  }

  getRootNode(): DirectoryNode {
    if (this.parent) {
      return this.parent.getRootNode();
    }
    return this;
  }

  getName(): string | null {
    return (
      removeMdExtension(this.name) ||
      removeMdExtension(this.storageProviderHandle?.getHandler().name) ||
      removeMdExtension(this.fileHandle?.name) ||
      removeMdExtension(this.directoryHandle?.name) ||
      this.name ||
      null
    );
  }

  setName(name: string): void {
    if(this.isFile()) {
      this.name = addMdExtension(name) || this.name;
      return;
    }

    this.name = name; //directory does not have .md extension
  }

  getFullPath(): string {
    if (this.parent) {
      const parentPath = this.parent.getFullPath();
      return `${parentPath}/${this.name}`;
    }

    return this.name;
  }

  getCopy(): DirectoryNode {
    return new DirectoryNode(
      this.name,
      this.isExpanded,
      this.children,
      this.isDirectory,
      this.storageProviderHandle,
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

  insertChild(child: DirectoryNode): void {
    this.children.push(child);
    this.sortChildrenAlphabetically();
  }

  sortChildrenAlphabetically() {
    this.children.sort((a, b) => a.name.localeCompare(b.name));
  }

  async loadFileContent(): Promise<string | null> {
    this.getFullPath();

    if (!this.fileContent) {
      if (this.storageProviderHandle) {
        try {
          const fileContent = await this.storageProviderHandle.getFileTextContent();
          const updatedMarkdownContent =
            this.replaceRelativeLinksWithBlobURLs(fileContent);

          const {
            markdownContent: markdownContentWithFrontmatterExtracted,
            frontmatter,
          } = extractFrontmatter(updatedMarkdownContent);

          this.fileContent = markdownContentWithFrontmatterExtracted;
          this.frontmatter = frontmatter;

          return updatedMarkdownContent;
        } catch (error) {
          console.error(error);
          return null;
        }
      } else {
        return null;
      }
    }

    return this.fileContent;
  }

  updateFileContent(content: string): DirectoryNode {

    const fileContentWithReplacedImages =
      this.replaceBlobURLsWithRelativeLinks(content);

    const fileContentWithFrontmatter = this.frontmatter
      ? `---\n${this.frontmatter}\n---\n${fileContentWithReplacedImages}`
      : fileContentWithReplacedImages;

    this.fileContent = fileContentWithFrontmatter;
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

  async saveFileContent(): Promise<DirectoryNode> {

    const fileContentWithReplacedImages = this.replaceBlobURLsWithRelativeLinks(this.fileContent);

    const fileContentWithFrontmatter = this.frontmatter
      ? `---\n${this.frontmatter}\n---\n${fileContentWithReplacedImages}`
      : fileContentWithReplacedImages;

    if (this.storageProviderHandle && this.isFile()) {
      await this.storageProviderHandle.saveFileContent(
        fileContentWithFrontmatter
      );
    }

    this.fileContent = fileContentWithFrontmatter;

    this.unsavedChanges = false; // Reset the indicator for unsaved changes

    // Update the children of the parent if it exists
    if (this.parent && this.parent.children) {
      this.parent.children = this.parent.children.map((child) => {
        if (child.id === this.id) {
          return this;
        } else {
          return child;
        }
      });
    }

    //recursively update the parent until the root
    let currentParent = this.parent;
    while(currentParent){
      currentParent.parent?.children.map((child) => {
        //@ts-ignore
        if (child.id === currentParent.id) {
          return currentParent;
        } else {
          return child;
        }
      });
      currentParent = currentParent.parent;
    }

    return this;
  }



  //move is done by copying and deleting old node
  async moveNodeToNewParent(newParent: DirectoryNode): Promise<DirectoryNode | undefined> {
    //come back to this one
    if (newParent.id === this.parent?.id) {
      return;
    }

    if (!newParent.isDirectory) {
      throw new Error("New parent is not a directory");
    }

    const oldParent = this.parent;
    let newNode;

    //move all replaced childs/images of this node to new parent
    if (this.replacedImages) {
      for (const key in this.replacedImages) {
        const oldReplacedImagePath = this.replacedImages[key];
        const newReplacedImage =
          this.parent?.findChildByPath(oldReplacedImagePath);

        if (newReplacedImage) {
          await newReplacedImage.moveNodeToNewParent(newParent);
        }
      }
    }

    if (this.storageProviderHandle && newParent.storageProviderHandle) {
      const newStorageProviderHandle = await this.storageProviderHandle?.copyTo(
        newParent.storageProviderHandle
      );
      newNode = await createDirectoryNode(newStorageProviderHandle, newParent);
      newParent.loadDirectoryNode(); //reload the new parent, with images
    } else {
      //if we don't have a storage provider
      newNode = this.getCopy();
      newNode.parent = newParent;
      newParent.children.push(newNode);
    }

    this.delete(true);

    //remove node from old parent
    if (oldParent) {
      oldParent.children = oldParent.children.filter(
        (child) => child.id !== this.id
      );
    }

    //reset children
    if (newParent) {
      await newParent.loadDirectoryNode();
    }

    newParent.sortChildrenAlphabetically();

    return newNode!;
  }

  async rename(
    newName: string,
    newParent?: DirectoryNode
  ): Promise<DirectoryNode> {
    const newFileName = newName;

    let destinationParent = newParent ? newParent : this.parent;

    //create the file using the storage provider
    let newStorageHandle: StorageProvider | null = null;
    if (this.storageProviderHandle) {
      const oldParentStorageProvider = this.parent && this.parent.storageProviderHandle ? this.parent.storageProviderHandle : null;
      newStorageHandle = await this.storageProviderHandle.rename(
        newFileName,
        oldParentStorageProvider,
        newParent ? newParent.storageProviderHandle : null
      );
    }

    //create the new(renamed) directorynode in memory
    let newDirectoryNode;
    if(newStorageHandle){
      newDirectoryNode = await createDirectoryNode(
        newStorageHandle,
        destinationParent
      );
    }
    else{
      this.setName(newName);

      newDirectoryNode = await createDirectoryNode(
        this,
        destinationParent
      );
    }

    if (!newDirectoryNode) {
      throw new Error("Error creating new directory node");
    }

    //delete the old node
    await this.delete(true);

    //insert newDirectoryNode into parent
    destinationParent?.insertChild(newDirectoryNode);

    return newDirectoryNode;
  }

  replaceBlobURLsWithRelativeLinks = (markdownContent: string) => {
    const regex =
      /!\[([^\]]*)\]\((.*(\(([^()]*|\(([^()]*|\([^()]*\))*\))*\))*)\s("(?:.*[^"])")?\s*\)/g; // only matches images on their own lines (follow by new line character)

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

        if (matchingChild?.isDirectory) {
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

  findChildByPath = (path: string): DirectoryNode | undefined => {
    console.log("relative path:", path);
    // Split the relative path into individual segments
    const pathSegments = path.split("/");

    // Start from the current node
    let currentNode: DirectoryNode | undefined = this;

    for (let segment of pathSegments) {
      // Handle parent directory indicator ".."
      if (segment === "." || segment === this.name) {
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
        const matchingChild: DirectoryNode | undefined =
          currentNode?.children.find((child) => child.name === segment);

        if (!matchingChild) {
          // If the child is not found or is not a directory, return undefined
          return undefined;
        }

        if (matchingChild?.isDirectory) {
          currentNode = matchingChild;
          continue;
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
    
    if (
      this.storageProviderHandle &&
      this.parent &&
      this.parent.storageProviderHandle
    ) {
      await this.parent.storageProviderHandle.deleteChild(
        this.storageProviderHandle
      );
    }

    // Update the children of the parent if it exists
    if (this.parent && this.parent.children) {
      let tempChildren = [];
      for (const child of this.parent.children) {
        if (child.id !== this.id) {
          tempChildren.push(child);
        }
      }
      console.log(tempChildren);
      this.parent.children = tempChildren;
    }

    return this.parent;
  }

  async createFile(fileName: string): Promise<DirectoryNode> {
    let storageProviderHandle : StorageProvider | undefined = undefined;

    const existingFile = this.children.find(
      (child) => child.name === fileName &&!child.isDirectory
    );

    if (existingFile) {
      throw new Error(`File ${fileName} already exists`);
    }

    if (this.storageProviderHandle) {
      storageProviderHandle = await this.storageProviderHandle.createFileFromPath(fileName);
    }

    const newFileNode = new DirectoryNode(
      fileName,
      false,
      [],
      false,
      storageProviderHandle,
      undefined,
      undefined,
      this
    );

    this.children.push(newFileNode);

    this.sortChildrenAlphabetically();

    return newFileNode;
  }

  async createFolder(folderName: string): Promise<DirectoryNode | undefined> {
    let existingFolder = this.children.find(
      (child) => child.name === folderName && child.isDirectory
    );

    if (existingFolder) {
      throw new Error(`Folder ${folderName} already exists`);
    }

    let storageProviderHandle: StorageProvider | undefined = undefined;
    if(this.storageProviderHandle){
      storageProviderHandle = await this.storageProviderHandle.createDirectory(
        folderName
      );
    }

    //create the DirectoryNode for the new file
    const newFolderNode = new DirectoryNode(
      folderName,
      false,
      [],
      true,
      storageProviderHandle,
      undefined, 
      undefined,
      this
    );

    //add the new file to the parent
    this.children.push(newFolderNode);

    this.sortChildrenAlphabetically();

    return newFolderNode;
  }

  loadDirectoryNode = async (): Promise<DirectoryNode> => {
    const entries: DirectoryNode[] = [];

    //nothing to load if no handle
    if(!this.storageProviderHandle) {
      return this;
    }

    //nothing to load if it's a file
    if(this.storageProviderHandle.getHandler() instanceof FileSystemFileHandle) {
      return this;
    }

    if (
      this.storageProviderHandle.name() === "node_modules" ||
      this.storageProviderHandle.name().startsWith(".")
    ) {
      return this;
    }

    //@ts-ignore
    let values = await this.storageProviderHandle.values();
    for (const entry of values) {
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

      if (entry.isDirectory()) {
        const subDirectoryNode = await createDirectoryNode(
          entry,
          this
        );

        if (subDirectoryNode) {
          entries.push(subDirectoryNode);
        }
      } else if (entry.isFile()) {
        if (
          !acceptedFileExtensions.some((extension) =>
            entry.name().toLowerCase().endsWith(extension)
          )
        ) {
          continue;
        }

        let blobUrl = undefined;
        if (await entry.isImage()) {
          blobUrl = await entry.loadImageInBrowser();
        }

        const fileNode = new DirectoryNode(
          entry.name(),
          false,
          [],
          entry.isDirectory(),
          entry,
          undefined,
          undefined,
          this,
          undefined,
          undefined,
          undefined,
          blobUrl
        );

        entries.push(fileNode);
      }
    }

    this.children = entries;
    this.sortChildrenAlphabetically();

    console.log(this);
    console.log(this.children);

    return this;
  };
}


export async function createDirectoryNode (
  storageHandle: StorageProvider | DirectoryNode,
  parent: DirectoryNode | undefined
): Promise<DirectoryNode | undefined> {
  const entries: DirectoryNode[] = [];

  let directoryNode: DirectoryNode;

  if(!storageHandle){
    throw new Error("storageHandle is missing.");
  }

  if(!instanceOfStorageProvider(storageHandle) && !(storageHandle instanceof DirectoryNode)){
    throw new Error("storageHandle is not a valid StorageProvider");
  }
  
  //if we are creating a directory node for a file
  if(storageHandle instanceof LocalFileSystemProvider){
    //ignore hidden files & folders
    if (
      storageHandle.name() === "node_modules" ||
      storageHandle.name().startsWith(".")
    ) {
      return undefined;
    }

    directoryNode = new DirectoryNode(
      storageHandle.name(),
      false,
      entries,
      storageHandle.isDirectory(),
      storageHandle,
      undefined,
      undefined,
      parent
    );

    directoryNode = await directoryNode.loadDirectoryNode();
    return directoryNode;
  }

  const previousDirectoryNode = storageHandle as unknown as DirectoryNode;

  directoryNode = new DirectoryNode(
    previousDirectoryNode.name,
    false,
    previousDirectoryNode.children,
    previousDirectoryNode.isDirectory,
    previousDirectoryNode.storageProviderHandle,
    undefined,
    undefined,
    parent,
    previousDirectoryNode.fileContent,
    false,
    undefined,    
    previousDirectoryNode.blobUrl,
    previousDirectoryNode.replacedImages,
    previousDirectoryNode.frontmatter
  )

  return directoryNode;
}