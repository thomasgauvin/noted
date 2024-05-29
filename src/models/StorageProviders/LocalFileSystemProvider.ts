import { StorageProvider, StorageType } from "./StorageProviderInterface";

export class LocalFileSystemProvider implements StorageProvider {
  storageType: StorageType;
  handler: FileSystemFileHandle | FileSystemDirectoryHandle;

  constructor(handler: FileSystemFileHandle | FileSystemDirectoryHandle) {
    this.handler = handler;
    this.storageType =
      handler instanceof FileSystemFileHandle
        ? StorageType.FILE
        : StorageType.DIRECTORY;
  }

  getDirectoryHandle(): FileSystemDirectoryHandle {
    if (this.storageType == StorageType.FILE) {
      throw new Error("Cannot get directory handle of file");
    }

    return this.handler as FileSystemDirectoryHandle;
  }

  isDirectory(): boolean {
    return this.handler instanceof FileSystemDirectoryHandle;
  }

  isFile() : boolean {
    return this.handler instanceof FileSystemFileHandle;
  }

  async getFileContent(): Promise<string> {
    if (
      this.storageType == StorageType.DIRECTORY ||
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

  async saveFileContent(content: string): Promise<void> {
    if (
      this.storageType == StorageType.DIRECTORY ||
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

  async createDirectory(name: string): Promise<StorageProvider> {
    if (this.handler instanceof FileSystemFileHandle) {
      throw new Error("Cannot create directory of file");
    }

    const newDirectoryHandle = await this.handler.getDirectoryHandle(name, {
      create: true,
    });

    return new LocalFileSystemProvider(
      newDirectoryHandle
    ) as unknown as StorageProvider;
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

    return new LocalFileSystemProvider(
      newFileHandle
    );
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
      existingFolderHandle = await this.handler.getDirectoryHandle(
        name,
        {
          create: false,
        }
      );
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

  async copyTo(target: StorageProvider): Promise<void> {
    const targetLocalFileSystemProvider =
      target as unknown as LocalFileSystemProvider;
    if (targetLocalFileSystemProvider.handler instanceof FileSystemFileHandle) {
      throw new Error("Destination is not a directory");
    }

    if (this.handler instanceof FileSystemFileHandle) {
      //@ts-expect-error
      await target.createFile(this);
      return;
    }

    let values = await this.values();
    for (const value of values) {
      if (value.isDirectory()) {
        const newDirectory = await target.createDirectory(value.name());
        await value.copyTo(newDirectory);
      } else {
        await target.createFile(value);
      }
    }
  }

  async rename(
    newName: string,
    newParent?: StorageProvider | null
  ): Promise<StorageProvider> {

    throw new Error("Method not implemented.");
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
