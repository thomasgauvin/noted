import DirectoryNode, { createDirectoryNode } from "../../../models/DirectoryNode";
import { Button } from "../../ui/Button";
import * as Separator from '@radix-ui/react-separator';

export function WorkspaceSelector({
    setSelectedDirectory
  }: {
    setSelectedDirectory: (node: DirectoryNode) => void;
}){

    const handleDirectorySelect = async () => {
        try {
          const directoryHandle = await (window as any).showDirectoryPicker();
          if(!directoryHandle) return;
          setSelectedDirectory(
            await createDirectoryNode(directoryHandle, undefined)
          );
        } catch (error) {
          console.error("Error selecting directory:", error);
        }
      };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-300 bg-opacity-75">
            <div className="bg-white p-8 rounded shadow-md flex flex-col max-w-96">
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
                    <Separator.Root className="bg-zinc-200 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full my-[15px]"/>
                </div>

                <div>
                    <h3 className="font-semibold leading-none tracking-tight">
                        Select a folder
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Select a new empty folder or select an existing folder that will contain your notes.
                    </p>
                </div>

            </div>
            <div className="mt-4">
                <Button
                    onClick={handleDirectorySelect}
                    className="rounded w-full hover:border-zinc-200"
                >
                Select directory
                </Button>
            </div>
            </div>
        </div>
    );
}