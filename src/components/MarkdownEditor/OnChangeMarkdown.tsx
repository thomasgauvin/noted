import { useCallback } from "react";
import { useHelpers, useDocChanged } from "@remirror/react";

export const OnChangeMarkdown = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { getMarkdown } = useHelpers();

  useDocChanged(
    useCallback(
      ({ state }) => {
        const markdown = getMarkdown(state);
        persistMarkdown(markdown);
      },
      [persistMarkdown, getMarkdown]
    )
  );

  return null;
};
