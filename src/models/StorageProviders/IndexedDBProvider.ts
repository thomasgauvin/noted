import { addMdExtension } from "../MarkdownHelpers";
import { StorageProvider } from "./StorageProviderInterface";

//this class provides access to the IndexedDB storage of the browser
export class IndexedDBProvider implements StorageProvider {
  isDirectory(): boolean {
    throw new Error("Method not implemented.");
  }
  isFile(): boolean {
    throw new Error("Method not implemented.");
  }
  getHandler(): FileSystemFileHandle | FileSystemDirectoryHandle {
    throw new Error("Method not implemented.");
  }
  getFileTextContent(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getFileArrayBuffer(): Promise<ArrayBuffer> {
    throw new Error("Method not implemented.");
  }
  saveFileContent(content: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  rename(newName: string, oldParent: StorageProvider | null, newParent?: StorageProvider | null | undefined): Promise<StorageProvider> {
    throw new Error("Method not implemented.");
  }
  deleteChild(child: StorageProvider): Promise<void> {
    throw new Error("Method not implemented.");
  }
  name(): string {
    throw new Error("Method not implemented.");
  }
  values(): Promise<StorageProvider[]> {
    throw new Error("Method not implemented.");
  }
  isImage(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  loadImageInBrowser(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  copyTo(target: StorageProvider): Promise<StorageProvider> {
    throw new Error("Method not implemented.");
  }
  createDirectory(path: string): Promise<StorageProvider> {
    throw new Error("Method not implemented.");
  }
  createFile(storageProvider: StorageProvider): Promise<StorageProvider> {
    throw new Error("Method not implemented.");
  }
  createFileFromPath(path: string): Promise<StorageProvider> {
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

}