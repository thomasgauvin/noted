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

export const RemirrorCustomToolbar = ({}: {}) => {
  return (
    <div className="fixed bottom-0 z-30 my-4 justify-center items-center w-[36rem] lg:w-[48rem]">
      <div className="flex justify-center items-center ">
        <Menubar.Root className="border overflow-hidden inline-flex flex-shrink-0 bg-white rounded-full shadow-lg">
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
            <RemirrorCustomToolbarBoldButton />
            <RemirrorCustomToolbarItalicButton />
            <RemirrorCustomToolbarStrikethroughButton />
            <RemirrorCustomToolbarCodeButton />
            <div className="flex justify-center items-center">
              <Menubar.Separator className="h-8 w-0.5 bg-zinc-100" />
            </div>

            <RemirrorCustomToolbarBlockquoteButton />
            <RemirrorCustomToolbarCodeblockButton />
            <div className="flex justify-center items-center">
              <Menubar.Separator className="h-8 w-0.5 bg-zinc-100" />
            </div>
            <RemirrorCustomToolbarUndoButton />
            <RemirrorCustomToolbarRedoButton  />
          </Menubar.Menu>
        </Menubar.Root>
      </div>
    </div>
  );
};
