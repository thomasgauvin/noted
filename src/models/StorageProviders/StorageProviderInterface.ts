export interface StorageProvider {
  isDirectory(): boolean;
  isFile(): boolean;

  getHandler(): FileSystemFileHandle | FileSystemDirectoryHandle;

  getFileTextContent(): Promise<string>;
  getFileArrayBuffer(): Promise<ArrayBuffer>;
  saveFileContent(content: string): Promise<void>;
  rename(//some of these functions require the old parent. the storage provider implementer will determine what to do with the old paarent
    newName: string,
    oldParent: StorageProvider | null,
    newParent?: StorageProvider | null
  ): Promise<StorageProvider>;
  deleteChild(child: StorageProvider): Promise<void>;
  name(): string;
  values(): Promise<StorageProvider[]>;
  isImage(): Promise<boolean>;
  loadImageInBrowser(): Promise<string>;
  copyTo(target: StorageProvider): Promise<StorageProvider>;
  createDirectory(path: string): Promise<StorageProvider>;
  createFile(storageProvider: StorageProvider): Promise<StorageProvider>;
  createFileFromPath(path: string): Promise<StorageProvider>;

  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  deleteDirectory(path: string): Promise<void>;
}

export function instanceOfStorageProvider(object: any): object is StorageProvider {
  return "isDirectory" in object && "getFileTextContent" in object && "saveFileContent" in object && 
    "rename" in object && "deleteChild" in object && "name" in object && "values" in object && "isImage" in object && 
    "loadImageInBrowser" in object && "readFile" in object && "writeFile" in object && "createDirectory" in object && 
    "deleteFile" in object && "deleteDirectory" in object;
}
