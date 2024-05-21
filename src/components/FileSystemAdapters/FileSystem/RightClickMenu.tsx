import { FilePlus, FolderPen, FolderPlus, Trash } from "lucide-react";
import * as ContextMenu from "@radix-ui/react-context-menu";

const RightClickMenu = ({ onCreateFile, onCreateFolder, onDelete, onRename }: 
  { 
    onCreateFile: (() => void) | undefined, 
    onCreateFolder: (() => void) | undefined,
    onDelete: () => void,
    onRename: () => void
  }) => {
  return (
    <ContextMenu.Portal
    >
      <ContextMenu.Content
        className={`min-w-[220px] bg-white rounded-md overflow-hidden p-[5px] z-40
        shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]`}

      > 
        {
          onCreateFile && (
            <ContextMenu.Item
              className={`text-sm leading-none rounded-md 
                flex items-center h-[25px] px-[5px] relative select-none outline-none 
                data-[disabled]:pointer-events-none 
                data-[highlighted]:bg-zinc-100`}
              onClick={() => {
                onCreateFile();
              }}
            >
              <FilePlus size={14} className="mr-[8px]" />
              <div>Create note</div>
            </ContextMenu.Item>
          )
        }
        {
          onCreateFolder && (
            <ContextMenu.Item
              className={`text-sm leading-none rounded-md 
                flex items-center h-[25px] px-[5px] relative select-none outline-none 
                data-[disabled]:pointer-events-none 
                data-[highlighted]:bg-zinc-100`}
              onClick={() => {
                onCreateFolder();
              }}
            >
              <FolderPlus size={14} className="mr-[8px]" />
              <div>Create folder</div>
            </ContextMenu.Item>
          )
        }
        <ContextMenu.Item
          className={`text-sm leading-none rounded-md 
            flex items-center h-[25px] px-[5px] relative select-none outline-none 
            data-[disabled]:pointer-events-none 
            data-[highlighted]:bg-zinc-100`}
          onClick={() => {
            onRename();
          }}
        >
          <FolderPen size={14} className="mr-[8px]" />
          <div>Rename</div>
        </ContextMenu.Item>
        <ContextMenu.Item
          className={`text-sm leading-none rounded-md 
            flex items-center h-[25px] px-[5px] relative select-none outline-none 
            data-[disabled]:pointer-events-none 
            data-[highlighted]:bg-zinc-100`}
          onClick={() => {
            onDelete();
          }}
        >
          <Trash size={14} className="mr-[8px]" />
          <div>Delete</div>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  );
};

export default RightClickMenu;
