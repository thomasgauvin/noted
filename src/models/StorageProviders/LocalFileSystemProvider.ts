import { addMdExtension } from "../MarkdownHelpers";
import { StorageProvider } from "./StorageProviderInterface";

//this class provides access to the local file system
export class LocalFileSystemProvider implements StorageProvider {
  handler: FileSystemFileHandle | FileSystemDirectoryHandle;

  constructor(handler: FileSystemFileHandle | FileSystemDirectoryHandle) {
    if(!(handler instanceof FileSystemFileHandle || handler instanceof FileSystemDirectoryHandle)) {
      throw new Error("Invalid handler");
    }
    this.handler = handler;
  }

  getHandler(): FileSystemFileHandle | FileSystemDirectoryHandle {
      return this.handler;
  }

  getDirectoryHandle(): FileSystemDirectoryHandle {
    if(!this.isDirectory()) {
      throw new Error("Cannot get directory handle of file");
    }

    return this.handler as FileSystemDirectoryHandle;
  }

  isDirectory(): boolean {
    return this.handler instanceof FileSystemDirectoryHandle;
  }

  isFile(): boolean {
    return this.handler instanceof FileSystemFileHandle;
  }

  async getFileTextContent(): Promise<string> {
    if (
      this.handler instanceof FileSystemDirectoryHandle
    ) {
      throw new Error("Cannot get file content of directory");
    }

    if (!this.handler) {
      throw new Error("No handler found");
    }

    const file = await this.handler.getFile();
    const content = await file.text(); 

    return content;
  }

  async getFileArrayBuffer(): Promise<ArrayBuffer> { //can be used for transfers, works for text files and images
    if (
      this.handler instanceof FileSystemDirectoryHandle
    ) {
      throw new Error("Cannot get file content of directory");
    }

    if (!this.handler) {
      throw new Error("No handler found");
    }

    const file = await this.handler.getFile();
    const content = await file.arrayBuffer(); 

    return content
  }

  async saveFileContent(content: string): Promise<void> {
    if (
      this.handler instanceof FileSystemDirectoryHandle
    ) {
      throw new Error("Cannot save file content of directory");
    }

    if (!this.handler) {
      throw new Error("No handler found");
    }

    const writable = await this.handler.createWritable();

    await writable.write(content);
    await writable.close();
  }

  async deleteChild(child: StorageProvider): Promise<void> {
    if (this.handler instanceof FileSystemFileHandle) {
      throw new Error("Cannot delete child of file");
    }

    const childLocalFileSystemProvider =
      child as unknown as LocalFileSystemProvider;
    await this.handler.removeEntry(childLocalFileSystemProvider.name(), {
      recursive: true,
    });
  }

  name(): string {
    return this.handler?.name!;
  }

  async values(): Promise<StorageProvider[]> {
    if (this.handler instanceof FileSystemFileHandle) {
      throw new Error("Cannot get values of file");
    }

    const values: StorageProvider[] = [];
    const directoryHandle = this.getDirectoryHandle();

    for await (const entry of (directoryHandle as any).values()) {
      // console.log(entry)
      values.push(new LocalFileSystemProvider(entry));
    }

    return values;
  }

  async isImage(): Promise<boolean> {
    if (this.handler instanceof FileSystemDirectoryHandle) {
      return false;
    }

    const file = await this.handler.getFile();

    return file.type.startsWith("image/");
  }

  async loadImageInBrowser(): Promise<string> {
    if (this.handler instanceof FileSystemDirectoryHandle) {
      throw new Error("Cannot load image of directory");
    }

    if (!this.handler) {
      throw new Error("No handler found");
    }

    const file = await this.handler.getFile();
    const blob = new Blob([file], { type: file.type });
    let blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }

  async createFileFromPath(path: string): Promise<StorageProvider> {
    if (this.handler instanceof FileSystemFileHandle) {
      throw new Error("Cannot create file of directory");
    }

    //try to get the file to see if it already exists
    let existingFileHandle;
    try {
      existingFileHandle = await this.handler.getFileHandle(path, {
        create: false,
      });
    } catch (error) {
      //do nothing, error is thrown when we attempt to get file handler but no file is present which is expected
    }

    if (existingFileHandle) {
      throw new Error("File already exists"); //not expected to happen since it doesn't fail when it finds the file
    }

    const newFileHandle = await this.handler.getFileHandle(path, {
      create: true,
    });

    return new LocalFileSystemProvider(newFileHandle);
  }

  async createFile(storageProvider: StorageProvider): Promise<StorageProvider> {
    if (this.handler instanceof FileSystemDirectoryHandle) {
      throw new Error("Cannot create file of directory");
    }

    //@ts-expect-error
    const newFileHandle = await this.handler.getFileHandle(
      storageProvider.name(),
      {
        create: true,
      }
    );

    return new LocalFileSystemProvider(
      newFileHandle
    ) as unknown as StorageProvider;
  }

  async createDirectory(name: string): Promise<StorageProvider> {
    if (this.handler instanceof FileSystemFileHandle) {
      throw new Error("Cannot create directory of file");
    }

    //try to get the folder to see if it already exists
    let existingFolderHandle;
    try {
      existingFolderHandle = await this.handler.getDirectoryHandle(name, {
        create: false,
      });
    } catch (error) {
      //do nothing, error is thrown when we attempt to get file handler but no file is present which is expected
    }
    if (existingFolderHandle) {
      throw new Error("Folder already exists"); //not expected to happen since it doesn't fail when it finds the file
    }

    const newDirectoryHandle = await this.handler.getDirectoryHandle(name, {
      create: true,
    });

    return new LocalFileSystemProvider(
      newDirectoryHandle
    ) as unknown as StorageProvider;
  }

  async copyDirectoryContentsTo(target: StorageProvider): Promise<void> {
    const targetLocalFileSystemProvider =
      target as unknown as LocalFileSystemProvider;

    if (
      !(
        this.handler instanceof FileSystemDirectoryHandle &&
        targetLocalFileSystemProvider.handler instanceof
          FileSystemDirectoryHandle
      )
    ) {
      throw new Error("Cannot copy directory contents to a non directory");
    }

    //copy the subdirectory contents into the new subdirectory
    let values = await this.values();
    for (const value of values) {
      if (value.isDirectory()) {
        const currentLocalFileSystemProvider = value as unknown as LocalFileSystemProvider;
        const newDirectory =
          await targetLocalFileSystemProvider.createDirectory(value.name());
        await currentLocalFileSystemProvider.copyDirectoryContentsTo(
          newDirectory
        );
      } else {
        await value.copyTo(target);
      }
    }
  }

  async copyTo(target: StorageProvider): Promise<StorageProvider> {
    const targetLocalFileSystemProvider =
      target as unknown as LocalFileSystemProvider;

    if(this.handler instanceof FileSystemDirectoryHandle && targetLocalFileSystemProvider.handler instanceof FileSystemDirectoryHandle){
    
      //create a new sub directory in the target directory and copy all the files and folders inside this directory to the new directory
      const newSubDirectory = await targetLocalFileSystemProvider.createDirectory(this.name());

      await this.copyDirectoryContentsTo(newSubDirectory);

      return newSubDirectory;
    
    }

    if (this.handler instanceof FileSystemFileHandle && targetLocalFileSystemProvider.handler instanceof FileSystemFileHandle) {
      //get the contents of this using the filesystemfilehandle, write the contents to target using the filesystemfilehandle
      const file = await this.handler.getFile();
      const writable = await targetLocalFileSystemProvider.handler.createWritable();
      await writable.write(await this.getFileArrayBuffer());
      await writable.close();
      return new LocalFileSystemProvider(targetLocalFileSystemProvider.handler);
    }

    if(this.handler instanceof FileSystemFileHandle && targetLocalFileSystemProvider.handler instanceof FileSystemDirectoryHandle) {
      const file = await this.handler.getFile();
      const newFileHandle = await targetLocalFileSystemProvider.handler.getFileHandle(this.name(), {create: true});
      const writable = await newFileHandle.createWritable();
      await writable.write(await this.getFileArrayBuffer());
      await writable.close();
      return new LocalFileSystemProvider(newFileHandle);
    }

    // last potential scenario, copying file to directory results in error
    throw new Error("Cannot copy directory to file");

    return target;
  }

  delete(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async rename(
    newName: string,
    oldParent: StorageProvider | null,
    newParent?: StorageProvider | null
  ): Promise<StorageProvider> {

    //if its a file, we will add the md extension. we will also check if the parent already has the same file. if it already exists, we will throw an error.
    //if the file does not exist, we will create it by getting the fileHandle and call .move with the new fileName
    //then, we will return this

    if(this.handler instanceof FileSystemFileHandle){
      const newFileName = addMdExtension(newName) || newName;

      const destinationParent = newParent ? newParent : oldParent;
      const destinationParentHandler = destinationParent?.getHandler();
      if(!destinationParent || !(destinationParentHandler instanceof FileSystemDirectoryHandle)){
        throw new Error("Destination parent is not a directory");
      }

      //check if the parent already has the same file
      let existingFileHandle;
      try {
        existingFileHandle = await destinationParentHandler.getFileHandle(
          newFileName,
          {
            create: false,
          }
        );
      } catch (error) {
        //do nothing, error is thrown when we attempt to get file handler but no file is present which is expected
        if (existingFileHandle) {
          throw new Error("File already exists");
        }
      }
      if (existingFileHandle) {
        throw new Error("File already exists"); //not expected to happen since it doesn't fail when it finds the file
      }

      //we can move the file to the destination directory
      //see docs on move function https://developer.chrome.com/docs/capabilities/web-apis/file-system-access#renaming_and_moving_files_and_folders
      //@ts-ignore
      const newFileHandle = await destinationParentHandler.getFileHandle(
        newFileName,
        {
          create: true,
        }
      );

      const newLocalFileSystemProvider = new LocalFileSystemProvider(
        newFileHandle
      );

      await this.copyTo(newLocalFileSystemProvider);

      return newLocalFileSystemProvider as unknown as StorageProvider; //TODO: why as unknown?
    }

    //if its a folder, we will check if the parent already has the same folder. if it already exists, we will throw an error. 
    //if the folder does not already exist, we will create it by getting the directory handle for a new directory and then use copyDirectory function
    //then we will return this
    
    if(this.handler instanceof FileSystemDirectoryHandle){

      const destinationParent = newParent ? newParent : oldParent;
      const destinationParentHandler = destinationParent?.getHandler();
      if(!destinationParent || !(destinationParentHandler instanceof FileSystemDirectoryHandle)){
        throw new Error("Destination parent is not a directory");
      }

      //check if the parent already has the same folder
      let existingFolderHandle;
      try {
        existingFolderHandle = await destinationParentHandler.getDirectoryHandle(
          newName,
          {
            create: false,
          }
        );
      } catch (error) {
        //do nothing, error is thrown when we attempt to get file handler but no file is present which is expected
        if (existingFolderHandle) {
          throw new Error("Folder already exists");
        }
      }
      if (existingFolderHandle) {
        throw new Error("Folder already exists"); //not expected to happen since it doesn't fail when it finds the file
      }

      //we can move the folder to the destination directory
      //we need to create a new directory handle since the .move function is not supported yet for directories
      const newDirectoryHandle = await destinationParentHandler.getDirectoryHandle(
        newName,
        {
          create: true,
        }
      );
      const newLocalFileSystemProvider = new LocalFileSystemProvider(
        newDirectoryHandle
      );

      await this.copyDirectoryContentsTo(newLocalFileSystemProvider);

      return newLocalFileSystemProvider as StorageProvider; //TODO: why as unknown?
    }

    throw new Error("Invalid handler error.");
  }


  readFile(path: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  writeFile(path: string, content: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteFile(path: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteDirectory(path: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  // Implement methods using the File System Access API
}