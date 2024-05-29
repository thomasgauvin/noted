export interface StorageProvider {
  storageType: StorageType;

  isDirectory(): boolean;
  isFile(): boolean;

  getFileContent(): Promise<string>;
  saveFileContent(content: string): Promise<void>;
  rename(
    newName: string,
    newParent?: StorageProvider | null
  ): Promise<StorageProvider>;
  deleteChild(child: StorageProvider): Promise<void>;
  name(): string;
  values(): Promise<StorageProvider[]>;
  isImage(): Promise<boolean>;
  loadImageInBrowser(): Promise<string>;
  copyTo(target: StorageProvider): Promise<void>;
  createDirectory(path: string): Promise<StorageProvider>;
  createFile(storageProvider: StorageProvider): Promise<StorageProvider>;
  createFileFromPath(path: string): Promise<StorageProvider>;
  delete(): Promise<void>;

  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  deleteDirectory(path: string): Promise<void>;
}

export function instanceOfStorageProvider(object: any): object is StorageProvider {
  return "storageType" in object && "isDirectory" in object && "getFileContent" in object && "saveFileContent" in object && 
    "rename" in object && "deleteChild" in object && "name" in object && "values" in object && "isImage" in object && 
    "loadImageInBrowser" in object && "readFile" in object && "writeFile" in object && "createDirectory" in object && 
    "deleteFile" in object && "deleteDirectory" in object;
}

//enum for storage type file or directory
export enum StorageType {
  FILE = "file",
  DIRECTORY = "directory",
}
