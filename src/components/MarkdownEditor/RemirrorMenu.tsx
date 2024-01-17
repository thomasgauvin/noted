import { useEffect } from "react";
import { useCommands, useActive, useHelpers } from "@remirror/react";

export const Menu = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { toggleBold, focus } = useCommands();
  const active = useActive();
  const { getJSON, getMarkdown } = useHelpers();

  return (
    <button
      onClick={() => {
        toggleBold();
        focus();
        console.log(`Current Markdown: ${JSON.stringify(getMarkdown())}`);
        persistMarkdown(getMarkdown());
      }}
      style={{ fontWeight: active.bold() ? "bold" : undefined }}
      disabled={!toggleBold.enabled()}
    >
      B
    </button>
  );
};
