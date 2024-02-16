import { useState, useEffect } from "react";
import DirectoryNode from "../../models/DirectoryNode";
import { RemirrorComponent } from "./RemirrorComponent";
import { useDebouncedCallback } from "use-debounce";
import TextareaAutosize from 'react-textarea-autosize';

export const FileEditor = ({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: DirectoryNode | undefined;
  setSelectedFile: (file: DirectoryNode | undefined) => Promise<void> | undefined;
}) => {

  const [title, setTitle] = useState(selectedFile?.getName() || "Untitled");

  const debouncedChangeFileName = useDebouncedCallback(
    async ({ value }) => {
      console.log('debounced callback')
      await selectedFile?.renameFile(value);
      setSelectedFile(selectedFile?.getCopy());
    },
    700
  );

  useEffect(() => {
    setTitle(selectedFile?.getName() || "Untitled");
  }, [selectedFile]);

  const handleOnChangeFileName = async (
    e: React.FormEvent<HTMLTextAreaElement>
  ) => {
    setTitle(e.currentTarget.value);

    if (selectedFile) {
      try {
        debouncedChangeFileName({ value: e.currentTarget.value });
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!selectedFile) return <></>;

  return (
    <>
      <TextareaAutosize 
        placeholder="Untitled"
        value={title}
        onChange={handleOnChangeFileName}
        className="text-5xl font-bold w-full bg-transparent focus:outline-none pb-4 resize-none"
      />
      <RemirrorComponent
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
    </>
  );
};
