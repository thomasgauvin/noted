import DirectoryNode from "../../models/DirectoryNode";
import { RemirrorComponent } from "./RemirrorComponent";

export const FileEditor: React.FC = ({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: DirectoryNode | null;
  setSelectedFile: (file: DirectoryNode) => void;
}) => {
  const handleOnChangeFileName = async (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    if (selectedFile) {
      try {
        await selectedFile.renameFile(e.currentTarget.value);
        setSelectedFile(selectedFile.getCopy());
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <input
        placeholder="Untitled"
        value={selectedFile?.getName()}
        onChange={handleOnChangeFileName}
        className="text-5xl font-bold w-full bg-transparent focus:outline-none pb-4"
      />
      <RemirrorComponent
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
    </>
  );
};
