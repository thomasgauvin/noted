import { useCommands, useActive } from "@remirror/react";
import { LucideBold, LucideBraces, LucideCode, LucideItalic, LucideQuote, LucideRedo2, LucideStrikethrough, LucideUndo2 } from "lucide-react";
import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider} from "@radix-ui/react-tooltip";

const RemirrorCustomToolbarCustomButton = ({
  onClick,
  active,
  disabled,
  children,
  description,
  shortcut
}: {
  onClick: () => void;
  active: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  description: string;
  shortcut: string | undefined;
}) => {

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger>
          <button
            onClick={onClick}
            style={{ fontWeight: active ? "bold" : undefined }}
            disabled={disabled}
            className={`bg-white hover:bg-zinc-200 px-3 py-2 cursor-pointer
              ${active ? "bg-zinc-100" : ""}
              ${disabled ? "cursor-not-allowed hover:bg-white opacity-20" : ""}
            `}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="mb-1 bg-zinc-800 text-white opacity-80 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs text-primary-foreground"
        >
          <p>{description} 
            {
              shortcut &&
              <>{
                  navigator.userAgent.includes('Macintosh') ? " (Cmd + " : " Ctrl + "
                }
                {
                  shortcut 
                }
              </>  
          }  
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const RemirrorCustomToolbarBoldButton = ({
}: {
}) => {
  const { toggleBold, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        onClick={() => {
          toggleBold();
          focus();
        }}
        active={active.bold()}
        disabled={!toggleBold.enabled()}
        description="Bold"
        shortcut="b"
        >
          <LucideBold />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarItalicButton = ({
}: {
}) => {
  const { toggleItalic, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        onClick={() => {
          toggleItalic();
          focus();
        }}
        active={active.italic()}
        disabled={!toggleItalic.enabled()}
        description="Italic"
        shortcut="i"
        >
          <LucideItalic />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarRedoButton = ({
}: {
}) => {
  const { redo, focus } = useCommands();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        onClick={() => {
          redo();
          focus();
        }}
        active={false}
        disabled={!redo.enabled()}
        description="Redo"
        shortcut="Shift + z"
        >
          <LucideRedo2 />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarStrikethroughButton = ({
}: {}) => {
  const { toggleStrike, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        onClick={() => {
          toggleStrike();
          focus();
        }}
        active={active.strike()}
        disabled={!toggleStrike.enabled()}
        description="Strikethrough "
        shortcut={undefined}
        >
          <LucideStrikethrough />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarUndoButton = ({
}: {
}) => {
  const { undo, focus } = useCommands();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        onClick={() => {
          undo();
          focus();
        }}
        active={false}
        disabled={!undo.enabled()}
        description="Undo"
        shortcut="z"
        >
          <LucideUndo2 />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarCodeblockButton = ({
}: {
}) => {
  const { toggleCodeBlock, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        onClick={() => {
          toggleCodeBlock();
          focus();
        }}
        active={active.codeBlock()}
        disabled={!toggleCodeBlock.enabled()}
        description="Code block"
        shortcut={undefined}
        >
          <LucideBraces />
        </RemirrorCustomToolbarCustomButton>

    </>
  );
};

export const RemirrorCustomToolbarCodeButton = ({
}: {
}) => {
  const { toggleCode, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        onClick={() => {
          toggleCode();
          focus();
        }}
        active={active.code()}
        disabled={!toggleCode.enabled()}
        description="Code"
        shortcut={undefined}
        >
          <LucideCode />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarBlockquoteButton = ({
}: {
}) => {
  const { toggleBlockquote, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        onClick={() => {
          toggleBlockquote();
          focus();
        }}
        active={active.blockquote()}
        disabled={!toggleBlockquote.enabled()}
        description="Blockquote"
        shortcut={undefined}
        >
          <LucideQuote />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};