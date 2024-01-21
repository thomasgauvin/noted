//from https://github.com/remirror/remirror/blob/main/packages/remirror__react-editors/src/markdown/markdown-editor.tsx

//this component merely provides a WYSIWYG/Markdown editor
//any custom event handling, saving, etc. is to be completed in RemirrorComponent.tsx

import "@remirror/styles/all.css";

import React, { FC, PropsWithChildren, useCallback } from "react";
import jsx from "refractor/lang/jsx.js";
import typescript from "refractor/lang/typescript.js";
import { ExtensionPriority } from "remirror";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  TableExtension,
  TrailingNodeExtension,
} from "remirror/extensions";
import {
  EditorComponent,
  MarkdownToolbar,
  OnChangeJSON,
  Remirror,
  useHelpers,
  useRemirror,
} from "@remirror/react";
import type { CreateEditorStateProps, Extension } from "remirror";
import type { RemirrorProps, UseThemeProps } from "@remirror/react";
import { Menu as CustomMenu } from "./RemirrorMenu";
import { OnChangeMarkdown } from "./OnChangeMarkdown";
import "./index.css";

interface ReactEditorProps
  extends Pick<CreateEditorStateProps, "stringHandler">,
    Pick<RemirrorProps, "initialContent" | "editable" | "autoFocus" | "hooks"> {
  placeholder?: string;
  theme?: UseThemeProps["theme"];
  persistMarkdown?: (markdown: string) => void;
}

export interface MarkdownEditorProps
  extends Partial<Omit<ReactEditorProps, "stringHandler">> {}

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const RemirrorMarkdownEditor: FC<
  PropsWithChildren<MarkdownEditorProps>
> = ({ placeholder, children, theme, persistMarkdown, ...rest }) => {
  const extensions: () => Extension[] = useCallback(
    () => [
      new LinkExtension({ autoLink: true }),
      new PlaceholderExtension({ placeholder }),
      new BoldExtension(),
      new StrikeExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new BlockquoteExtension(),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new ListItemExtension({
        priority: ExtensionPriority.High,
        enableCollapsible: true,
      }),
      new CodeExtension(),
      new CodeBlockExtension({ supportedLanguages: [jsx, typescript] }),
      new TrailingNodeExtension(),
      new TableExtension(),
      new MarkdownExtension({ copyAsMarkdown: false }),
      /**
       * `HardBreakExtension` allows us to create a newline inside paragraphs.
       * e.g. in a list item
       */
      new HardBreakExtension(),
    ],
    [placeholder]
  );

  const { manager } = useRemirror({
    extensions,
    stringHandler: "markdown",
  });

  return (
    <Remirror
      manager={manager}
      autoFocus
      {...rest}
      classNames={["overflow-hidden"]}
    >
      {/* <MarkdownToolbar /> */}
      <EditorComponent />
      <OnChangeMarkdown
        persistMarkdown={(markdown) => {
          if (persistMarkdown) persistMarkdown(markdown);
        }}
      />
      {children}
    </Remirror>
  );
};
