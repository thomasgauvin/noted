//import all the above from the same file
import { 
  RemirrorCustomToolbarBlockquoteButton,
  RemirrorCustomToolbarBoldButton,
  RemirrorCustomToolbarCodeButton,
  RemirrorCustomToolbarItalicButton,
  RemirrorCustomToolbarStrikethroughButton,
  RemirrorCustomToolbarCodeblockButton,
  RemirrorCustomToolbarUndoButton,
  RemirrorCustomToolbarRedoButton,
} from "./RemirrorCustomToolbarCustomButtons";

import {
  RemirrorCustomToolbarHeader1DropdownOption,
  RemirrorCustomToolbarHeader2DropdownOption,
  RemirrorCustomToolbarHeader3DropdownOption,
  RemirrorCustomToolbarHeader4DropdownOption,
  RemirrorCustomToolbarHeader5DropdownOption,
  RemirrorCustomToolbarHeader6DropdownOption,
  RemirrorCustomToolbarHeadingButton,
} from "./RemirrorCustomToolbarHeadingButton";

import * as Menubar from "@radix-ui/react-menubar";
import {
  ChevronRightIcon,
  LucideHeading,
  LucideHeading1,
  LucideHeading2,
  LucideHeading3,
  LucideHeading4,
  LucideHeading5,
  LucideHeading6,
} from "lucide-react";

export const RemirrorCustomToolbar = ({
  persistMarkdown,
}: {
  persistMarkdown: (markdown: string) => void | undefined;
}) => {
  return (
    <div>
      <Menubar.Root className="flex bg-white p-[3px] rounded-full shadow-lg">
        <Menubar.Menu>
          <Menubar.Trigger className="select-none">
              <RemirrorCustomToolbarHeadingButton />
          </Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content
              className="min-w-[12rem] bg-white shadow-md rounded-lg p-1 "
              align="start"
              sideOffset={5}
              alignOffset={-3}
            >
              <Menubar.Item className="">
                <RemirrorCustomToolbarHeader1DropdownOption />
              </Menubar.Item>
              <Menubar.Item className="">
                <RemirrorCustomToolbarHeader2DropdownOption />
              </Menubar.Item>
              <Menubar.Item className="">
                <RemirrorCustomToolbarHeader3DropdownOption />
              </Menubar.Item>
              <Menubar.Item className="">
                <RemirrorCustomToolbarHeader4DropdownOption />
              </Menubar.Item>
              <Menubar.Item className="">
                <RemirrorCustomToolbarHeader5DropdownOption />
              </Menubar.Item>
              <Menubar.Item className="">
                <RemirrorCustomToolbarHeader6DropdownOption />
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
          <RemirrorCustomToolbarBoldButton persistMarkdown={persistMarkdown} />
          <RemirrorCustomToolbarItalicButton
            persistMarkdown={persistMarkdown}
          />
          <RemirrorCustomToolbarStrikethroughButton
            persistMarkdown={persistMarkdown}
          />
          <RemirrorCustomToolbarCodeButton persistMarkdown={persistMarkdown} />
          <Menubar.Separator className="h-[1px] bg-violet6 m-[5px]" />

          <RemirrorCustomToolbarBlockquoteButton
            persistMarkdown={persistMarkdown}
          />
          <RemirrorCustomToolbarCodeblockButton
            persistMarkdown={persistMarkdown}
          />
          <Menubar.Separator className="h-[1px] bg-violet6 m-[5px]" />

          <RemirrorCustomToolbarUndoButton persistMarkdown={persistMarkdown} />
          <RemirrorCustomToolbarRedoButton persistMarkdown={persistMarkdown} />
        </Menubar.Menu>
      </Menubar.Root>
    </div>
  );
};
