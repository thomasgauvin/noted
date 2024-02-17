import { useCallback } from "react";
import { useHelpers, useKeymap } from "@remirror/react";
import { RemirrorMarkdownEditor } from "./RemirrorMarkdownEditor";
import DirectoryNode from "../../models/DirectoryNode";
import { useDebouncedCallback } from "use-debounce";
import { ImageExtensionAttributes } from "remirror/extensions";
import { DelayedPromiseCreator } from "@remirror/core";

// Hooks can be added to the context without the need for creating custom components
const hooks = [
  () => {
    const { getJSON } = useHelpers();

    const handleSaveShortcut = useCallback(
      ({ state }: any) => {
        console.log(`Save to backend: ${JSON.stringify(getJSON(state))}`);

        return true; // Prevents any further key handlers from being run.
      },
      [getJSON]
    );

    // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS
    useKeymap("Mod-s", handleSaveShortcut);
  },
];

export type DelayedImage = DelayedPromiseCreator<ImageExtensionAttributes>;

export interface FileWithProgress {
  file: File;
  progress: SetProgress;
}

interface SetProgress {
  // Define the SetProgress interface if not already available
  // You might need to adjust this based on your actual implementation
  setProgress: (progress: number) => void;
}

export const RemirrorComponent = ({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: DirectoryNode;
  setSelectedFile: (file: DirectoryNode) => void;
}) => {
  const debouncedPersistMarkdown = useDebouncedCallback(
    // function
    (markdown) => persistMarkdown(markdown),
    // delay in ms
    500
  );

  const handleMarkdownChange = (markdown: string) => {
    setSelectedFile(selectedFile?.updateFileContent(markdown).getCopy()); //updating state to cause rerender (direct updates to objects/objecttree do not cause rerender)
    debouncedPersistMarkdown(markdown);
  };

  const persistMarkdown = async (markdown: string) => {
    selectedFile?.updateFileContent(markdown);
    await selectedFile?.saveFileContent();
    setSelectedFile(selectedFile.getCopy()); //updating state to cause rerender (direct updates to objects/objecttree do not cause rerender)
  };

  const customUploadHandler = (files: FileWithProgress[]): DelayedImage[] => {
    const delayedImages: DelayedImage[] = [];

    files.forEach(({ file }) => {
      const delayedImage: DelayedImage =
        async (): Promise<ImageExtensionAttributes> => {
          // Your upload logic here
          // You may use XMLHttpRequest, fetch, or any other method for file upload
          const blob = new Blob([file], { type: file.type });
          const blobUrl = URL.createObjectURL(blob);

          const imageAttributes: ImageExtensionAttributes = {
            src: blobUrl,
            fileName: file.name, // You may adjust this based on your file naming requirements
            alt: file.name, // You may adjust this based on your file naming requirements
            title: file.name, // You may adjust this based on your file naming requirements
          };

          // Check if the parent directory handle exists
          if (selectedFile.parent?.directoryHandle) {
            const parentDirectoryHandle = selectedFile.parent.directoryHandle;

            // Create a new file in the parent directory using the file name
            try {
              console.log(
                "getting the writeable writing the blob to the file system"
              );

              const newFileHandle = await parentDirectoryHandle.getFileHandle(
                file.name,
                {
                  create: true,
                }
              );

              // Write the blob data to the new file

              console.log("writing the blob to the file system");
              console.log(blob.size);
              const writeAble = await newFileHandle.createWritable();
              await writeAble.write(blob);
              writeAble.close();

              selectedFile.replacedImages[blobUrl] = "./" + file.name;
            } catch (e) {
              console.error(e);
            }

            // Return the image attributes
            return imageAttributes;
          } else {
            // Handle the case where the parent directory handle doesn't exist
            // You may want to throw an error or handle it differently based on your requirements
            console.error("Parent directory handle not found.");
            return imageAttributes;
          }

          return imageAttributes;
        };

      delayedImages.push(delayedImage);
    });

    return delayedImages;
  };

  return (
    <div className="flex flex-col ">
      <div className=" overflow-hidden relative mb-10">
        <RemirrorMarkdownEditor
          key={selectedFile?.getFullPath()}
          initialContent={selectedFile?.fileContent}
          hooks={hooks}
          persistMarkdown={handleMarkdownChange}
          customUploadHandler={customUploadHandler}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        ></RemirrorMarkdownEditor>
      </div>
    </div>
  );
};
