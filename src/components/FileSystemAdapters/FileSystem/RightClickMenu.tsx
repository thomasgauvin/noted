import { Trash } from "lucide-react";
import * as ContextMenu from "@radix-ui/react-context-menu";

const RightClickMenu = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Content
        className={`min-w-[220px] bg-white rounded-md overflow-hidden p-[5px] 
        shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]`}
      >
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
