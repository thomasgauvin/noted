import { useState } from "react";
import { LocalFileSystem } from "../components/FileSystemAdapters/FileSystem/LocalFileSystem";
import { FileEditor } from "../components/MarkdownEditor/FileEditor";
import DirectoryNode from "../models/DirectoryNode";

export const EditorPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DirectoryNode | null>(null); // [selectedFile, setSelectedFile
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(
    null
  );

  return (
    <div className="EditorPage flex h-dvh w-vw overflow-hidden">
      <LocalFileSystem
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        selectedFileName={selectedFileContent}
        setSelectedFileName={setSelectedFileName}
        selectedFileContent={selectedFileContent}
        setSelectedFileContent={setSelectedFileContent}
      />
      <FileEditor selectedFile={selectedFile} />
    </div>
  );
};
