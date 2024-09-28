import DirectoryNode, { createDirectoryNode } from "../../../models/DirectoryNode";
import { Button } from "../../ui/Button";
import * as Separator from "@radix-ui/react-separator";

export function GettingStartedHelper({
  selectedFile,
  selectedDirectory,
  setSelectedDirectory
}: {
  selectedFile: DirectoryNode | null;
  selectedDirectory: DirectoryNode | null;
  setSelectedDirectory: (node: DirectoryNode | null) => void;
}) {

  const handleDirectorySelect = async () => {
    try {
      //@ts-expect-error
      const directoryHandle = await window.showDirectoryPicker();
      if (!directoryHandle) return;

      setSelectedDirectory(
        await createDirectoryNode(directoryHandle, undefined)
      );
    } catch (error) {
      console.error("Error selecting directory:", error);
    }
  };

  return (
    <div
      className="z-20 flex fixed top-[50%] left-[50%]
    transform translate-x-[-10%] translate-y-[-35%]
    "
    >
      <div className="bg-white rounded shadow-md">
        <div className="mx-8 mt-8 mb-4">
          <div className="flex flex-col space-y-1.5 ">
            <div className="text-center ">
              <h1 className="font-semibold text-lg leading-none tracking-tight mb-0.5">
                Paginary
              </h1>
              <p className="text-muted-foreground text-sm">
                A local-first open-source note taking app.
              </p>
            </div>
            <div className="my-2">
              <Separator.Root className="bg-zinc-200 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full my-[15px]" />
            </div>

            <div className="text-center">
              <div className="mb-2">
                <Button variant={"outline"} className="rounded w-full">
                  Create a new note
                </Button>
              </div>

              <div className="">
                <Button
                  variant={"link"}
                  className="rounded w-full font-normal "
                >
                  Select a location to save your notes
                </Button>
              </div>
              <div className="">
                <Button
                  variant={"link"}
                  className="rounded w-full font-normal"
                  onClick={handleDirectorySelect}
                >
                  Open an existing folder
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
