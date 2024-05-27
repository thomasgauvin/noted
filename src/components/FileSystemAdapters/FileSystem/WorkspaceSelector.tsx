import { useEffect, useState } from "react";
import DirectoryNode, { createDirectoryNode } from "../../../models/DirectoryNode";
import { Button } from "../../ui/Button";
import * as Separator from '@radix-ui/react-separator';

export function WorkspaceSelector({
    setSelectedDirectory
  }: {
    setSelectedDirectory: (node: DirectoryNode) => void;
}){
    const [isSupported, setIsSupported] = useState(false);

    const handleDirectorySelect = async () => {
        try {
          //@ts-expect-error
          const directoryHandle = await window.showDirectoryPicker();
          if(!directoryHandle) return;

          setSelectedDirectory(
            await createDirectoryNode(directoryHandle, undefined)
          );
        } catch (error) {
          console.error("Error selecting directory:", error);
        }
    };

    const handleDecideLater = async () => {
      const emptyBrowserDirectory = new DirectoryNode(
        "Notes",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
        );

      setSelectedDirectory(emptyBrowserDirectory);
    }

    useEffect(() => {
        setIsSupported(typeof showDirectoryPicker === 'function');
    }, []);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-300">
        <div className="bg-white rounded shadow-md flex flex-col max-w-96">
          <div className="mx-8 mt-8 mb-4">
            <div className="flex flex-col space-y-1.5 ">
              <div className="text-center ">
                <h1 className="font-semibold text-lg leading-none tracking-tight mb-0.5">
                  Noted
                </h1>
                <p className="text-muted-foreground text-md">
                  A local-first open-source note taking app.
                </p>
              </div>
              <div className="my-4">
                <Separator.Root className="bg-zinc-200 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full my-[15px]" />
              </div>

              <div>
                <h3 className="font-semibold leading-none tracking-tight">
                  Save location
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select a location to save your notes
                </p>
              </div>
            </div>
            <div className="mt-4">
              {isSupported ? (
                <>
                  <div className="mt-2">
                    <Button
                      onClick={handleDirectorySelect}
                      className="rounded w-full "
                    >
                      Local folder
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Separator.Root className="bg-zinc-200 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full my-[15px]" />
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <Button
                      onClick={handleDecideLater}
                      className="rounded w-full hover:border-zinc-200"
                      variant={"link"}
                    >
                      Decide Later
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-red-700 text-sm italic">
                  This browser does not support file access at this time. Please
                  use a compatible browser (desktop versions of Google Chrome,
                  Microsoft Edge, or Opera) for direct file saving.
                </p>
              )}
              {/* <div className="my-2">
                <Button
                  onClick={() => {}}
                  className="rounded w-full hover:border-zinc-200 bg-zinc-100 hover:bg-zinc-200"
                  disabled={true}
                  title="Support for Google Drive is coming soon!"
                >
                  Google Drive
                </Button>
              </div>
              <div className="my-2">
                <Button
                  onClick={() => {}}
                  className="rounded w-full hover:border-zinc-200 bg-zinc-100 hover:bg-zinc-200"
                  disabled={true}
                  title="Support for GitHub is coming soon!"
                >
                  GitHub
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
}