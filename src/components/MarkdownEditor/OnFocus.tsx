
import { useCommands } from "@remirror/react";

export const OnFocus = ({
  shouldFocus,
  setShouldFocus
}: {
  shouldFocus: boolean
  setShouldFocus: (shouldFocus: boolean) => void
}) => {
  const { focus } = useCommands();

  if(shouldFocus){
    console.log('focus')
    console.log(shouldFocus)
    focus();
    setShouldFocus(false);
  }

  return <></>;
};
