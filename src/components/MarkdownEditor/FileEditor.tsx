import { useState, useEffect } from "react";
import DirectoryNode from "../../models/DirectoryNode";
import { RemirrorComponent } from "./RemirrorComponent";
import { useDebouncedCallback } from "use-debounce";
import TextareaAutosize from 'react-textarea-autosize';
import { useCommands } from "@remirror/react";

export const FileEditor = ({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: DirectoryNode | undefined;
  setSelectedFile: (file: DirectoryNode | undefined) => Promise<void> | undefined;
}) => {

  const [title, setTitle] = useState(selectedFile?.getName() || "Untitled");
  const [shouldFocus, setShouldFocus] = useState(false);

  const debouncedChangeFileName = useDebouncedCallback(
    async ({ value }) => {
      console.log('debounced callback')
      await selectedFile?.renameFile(value);
      setSelectedFile(selectedFile?.getCopy()); //force a rerender of the file system
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

  const handleOnKeyDown = (event : React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault(); // Prevents the default behavior of the Enter key in the textarea
      setShouldFocus(true);
    }
  }

  if (!selectedFile) return <></>;

  return (
    <>
      <TextareaAutosize 
        placeholder="Untitled"
        value={title}
        onChange={handleOnChangeFileName}
        onKeyDown={handleOnKeyDown}
        className="text-3xl md:text-4xl font-bold w-full bg-transparent focus:outline-none pb-4 resize-none overflow-clip"
      />
      <RemirrorComponent
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        shouldFocus={shouldFocus}
        setShouldFocus={setShouldFocus}
      />
    </>
  );
};
