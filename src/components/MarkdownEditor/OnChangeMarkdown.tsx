import { useCallback } from "react";
import { useHelpers, useDocChanged } from "@remirror/react";
import { useDebouncedCallback } from "use-debounce";

export const OnChangeMarkdown = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  const { getMarkdown } = useHelpers();
  const debouncedPersistMarkdown = useDebouncedCallback(
    ({ state }) => {
      console.log('debounced callback')
      const markdown = getMarkdown(state);
      persistMarkdown(markdown);
    },
    500
  );


  useDocChanged(
    useCallback(
      ({ state }) => {
        debouncedPersistMarkdown({ state });
      },
      [debouncedPersistMarkdown]
    )
  );

  return null;
};
