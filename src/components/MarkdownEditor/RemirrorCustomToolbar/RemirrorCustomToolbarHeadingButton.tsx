import { useCommands, useActive } from "@remirror/react";
import {
  LucideHeading,
  LucideHeading1,
  LucideHeading2,
  LucideHeading3,
  LucideHeading4,
  LucideHeading5,
  LucideHeading6,
} from "lucide-react";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
  TooltipProvider,
} from "@radix-ui/react-tooltip";


export const RemirrorCustomToolbarHeadingButton = () => {
  const active = useActive();
  const { toggleHeading } = useCommands();

  const isHeadingActive = active.heading({level: 1}) || active.heading({level: 2}) || active.heading({level: 3}) || active.heading({level: 4}) || active.heading({level: 5}) || active.heading({level: 6});
  const isEnabled = toggleHeading.enabled({level: 1}) || toggleHeading.enabled({level: 2}) || toggleHeading.enabled({level: 3}) || toggleHeading.enabled({level: 4}) || toggleHeading.enabled({level: 5}) || toggleHeading.enabled({ level: 6 });

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger>
          <button
            className={`bg-white hover:bg-zinc-100 px-3 py-2
          
          
            ${isHeadingActive ? "bg-zinc-100 " : ""}  
            ${isEnabled ? "" : "cursor-not-allowed hover:bg-white opacity-20"}
            `}
          >
            <LucideHeading />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className={`mb-1 bg-zinc-800 text-white 
            opacity-80 z-50 overflow-hidden rounded-md px-3 py-1.5 
            text-xs text-primary-foreground
          `}
        >
          <p>Headings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const RemirrorCustomToolbarHeadingDropdownOption = ({
  onClick,
  active,
  disabled,
  children,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  disabled: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      style={{ fontWeight: active ? "bold" : undefined }}
      disabled={disabled}
      className={`flex items-center p-2 space-x-2 
      justify-between w-full bg-white outline-none hover:bg-gray-100 
      hover:border-none rounded-md
      ${active ? "bg-zinc-100" : ""}
      ${disabled ? "cursor-not-allowed hover:bg-white opacity-20" : ""}
      `}
    >
      {children}
    </button>
  );
};

export const RemirrorCustomToolbarHeader1DropdownOption = () => {
  const { toggleHeading, focus } = useCommands();
  const active = useActive();

  return (
    <RemirrorCustomToolbarHeadingDropdownOption
      onClick={() => {
        toggleHeading({ level: 1 });
        focus();
      }}
      active={active.heading({ level: 1 })}
      disabled={!toggleHeading.enabled({ level: 1 })}
    >
      <LucideHeading1 />
      <span>Heading 1</span>
    </RemirrorCustomToolbarHeadingDropdownOption>
  );
};

export const RemirrorCustomToolbarHeader2DropdownOption = () => {
  const { toggleHeading, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarHeadingDropdownOption
        onClick={() => {
          toggleHeading({ level: 2 });
          focus();
        }}
        active={active.heading({ level: 2 })}
        disabled={!toggleHeading.enabled({ level: 2 })}
      >
        <LucideHeading2 />
        <span>Heading 2</span>
      </RemirrorCustomToolbarHeadingDropdownOption>
    </>
  );
};

export const RemirrorCustomToolbarHeader3DropdownOption = () => {
  const { toggleHeading, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarHeadingDropdownOption
        onClick={() => {
          toggleHeading({ level: 3 });
          focus();
        }}
        active={active.heading({ level: 3 })}
        disabled={!toggleHeading.enabled({ level: 3 })}
      >
        <LucideHeading3 />
        <span>Heading 3</span>
      </RemirrorCustomToolbarHeadingDropdownOption>
    </>
  );
};

export const RemirrorCustomToolbarHeader4DropdownOption = () => {
  const { toggleHeading, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarHeadingDropdownOption
        onClick={() => {
          toggleHeading({ level: 4 });
          focus();
        }}
        active={active.heading({ level: 4 })}
        disabled={!toggleHeading.enabled({ level: 4 })}
      >
        <LucideHeading4 />
        <span>Heading 4</span>
      </RemirrorCustomToolbarHeadingDropdownOption>
    </>
  );
};

export const RemirrorCustomToolbarHeader5DropdownOption = () => {
  const { toggleHeading, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarHeadingDropdownOption
        onClick={() => {
          toggleHeading({ level: 5 });
          focus();
        }}
        active={active.heading({ level: 5 })}
        disabled={!toggleHeading.enabled({ level: 5 })}
      >
        <LucideHeading5 />
        <span>Heading 5</span>
      </RemirrorCustomToolbarHeadingDropdownOption>
    </>
  );
};

export const RemirrorCustomToolbarHeader6DropdownOption = () => {
  const { toggleHeading, focus } = useCommands();
  const active = useActive();

  return (
    <>
      <RemirrorCustomToolbarHeadingDropdownOption
        onClick={() => {
          toggleHeading({ level: 6 });
          focus();
        }}
        active={active.heading({ level: 6 })}
        disabled={!toggleHeading.enabled({ level: 6 })}
      >
        <LucideHeading6 />
        <span>Heading 6</span>
      </RemirrorCustomToolbarHeadingDropdownOption>
    </>
  );
};
