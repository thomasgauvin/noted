import { useCommands, useActive, useHelpers } from "@remirror/react";
import { LucideBold, LucideBraces, LucideCode, LucideItalic, LucideQuote, LucideRedo2, LucideStrikethrough, LucideUndo2 } from "lucide-react";

const RemirrorCustomToolbarCustomButton = ({
  persistMarkdown,
  onClick,
  active,
  disabled,
  children,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
  onClick: () => void;
  active: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const { focus } = useCommands();

  return (
    <button
      onClick={onClick}
      style={{ fontWeight: active ? "bold" : undefined }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export const RemirrorCustomToolbarBoldButton = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { toggleBold, focus } = useCommands();
  const active = useActive();
  const { getMarkdown } = useHelpers();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        persistMarkdown={persistMarkdown}
        onClick={() => {
          toggleBold();
          focus();
        }}
        active={active.bold()}
        disabled={!toggleBold.enabled()}
        >
          <LucideBold />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarItalicButton = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { toggleItalic, focus } = useCommands();
  const active = useActive();
  const { getMarkdown } = useHelpers();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        persistMarkdown={persistMarkdown}
        onClick={() => {
          toggleItalic();
          focus();
        }}
        active={active.italic()}
        disabled={!toggleItalic.enabled()}
        >
          <LucideItalic />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarRedoButton = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { redo, focus } = useCommands();
  const active = useActive();
  const { getMarkdown } = useHelpers();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        persistMarkdown={persistMarkdown}
        onClick={() => {
          redo();
          focus();
        }}
        disabled={!redo.enabled()}
        >
          <LucideRedo2 />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarStrikethroughButton = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { toggleStrike, focus } = useCommands();
  const active = useActive();
  const { getMarkdown } = useHelpers();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        persistMarkdown={persistMarkdown}
        onClick={() => {
          toggleStrike();
          focus();
        }}
        active={active.strike()}
        disabled={!toggleStrike.enabled()}
        >
          <LucideStrikethrough />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarUndoButton = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { undo, focus } = useCommands();
  const active = useActive();
  const { getMarkdown } = useHelpers();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        persistMarkdown={persistMarkdown}
        onClick={() => {
          undo();
          focus();
        }}
        disabled={!undo.enabled()}
        >
          <LucideUndo2 />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarCodeblockButton = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { toggleCodeBlock, focus } = useCommands();
  const active = useActive();
  const { getMarkdown } = useHelpers();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        persistMarkdown={persistMarkdown}
        onClick={() => {
          toggleCodeBlock();
          focus();
        }}
        active={active.codeBlock()}
        disabled={!toggleCodeBlock.enabled()}
        >
          <LucideBraces />
        </RemirrorCustomToolbarCustomButton>

    </>
  );
};

export const RemirrorCustomToolbarCodeButton = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { toggleCode, focus } = useCommands();
  const active = useActive();
  const { getMarkdown } = useHelpers();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        persistMarkdown={persistMarkdown}
        onClick={() => {
          toggleCode();
          focus();
        }}
        active={active.code()}
        disabled={!toggleCode.enabled()}
        >
          <LucideCode />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};

export const RemirrorCustomToolbarBlockquoteButton = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { toggleBlockquote, focus } = useCommands();
  const active = useActive();
  const { getMarkdown } = useHelpers();

  return (
    <>
      <RemirrorCustomToolbarCustomButton
        persistMarkdown={persistMarkdown}
        onClick={() => {
          toggleBlockquote();
          focus();
        }}
        active={active.blockquote()}
        disabled={!toggleBlockquote.enabled()}
        >
          <LucideQuote />
        </RemirrorCustomToolbarCustomButton>
    </>
  );
};