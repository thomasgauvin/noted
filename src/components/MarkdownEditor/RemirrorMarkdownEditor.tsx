//from https://github.com/remirror/remirror/blob/main/packages/remirror__react-editors/src/markdown/markdown-editor.tsx

//this component merely provides a WYSIWYG/Markdown editor
//any custom event handling, saving, etc. is to be completed in RemirrorComponent.tsx

import "@remirror/styles/all.css";

import { FC, PropsWithChildren, useCallback } from "react";
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
  ImageExtension,
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
  Remirror,
  useRemirror,
} from "@remirror/react";
import type { CreateEditorStateProps, Extension } from "remirror";
import type { RemirrorProps, UseThemeProps } from "@remirror/react";
import { useExtensionEvent } from "@remirror/react";
import { OnChangeMarkdown } from "./OnChangeMarkdown";
import { DelayedImage, FileWithProgress } from "./RemirrorComponent";
import { RemirrorCustomToolbar } from "./RemirrorCustomToolbar/RemirrorCustomToolbar";

import "./index.css";
import DirectoryNode from "../../models/DirectoryNode";

interface ReactEditorProps
  extends Pick<CreateEditorStateProps, "stringHandler">,
    Pick<RemirrorProps, "initialContent" | "editable" | "autoFocus" | "hooks"> {
  placeholder?: string;
  theme?: UseThemeProps["theme"];
  persistMarkdown?: (markdown: string) => void;
  customUploadHandler?: (files: FileWithProgress[]) => DelayedImage[];
  setSelectedFile: (file: DirectoryNode) => void;
  selectedFile: DirectoryNode;
}

export interface MarkdownEditorProps
  extends Partial<Omit<ReactEditorProps, "stringHandler">> {}

const OnClickLink = ({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: DirectoryNode | undefined;
  setSelectedFile: (file: DirectoryNode) => void | undefined;
}) => {
  useExtensionEvent(
    LinkExtension,
    "onClick",
    useCallback((_, data) => {
      if (!selectedFile) return false;

      const urlWithoutProtocol = data.href.replace(/(^\w+:|^)\/\//, ""); //remove protocol, even when remirror adds just //
      const urlWithHttps = "https://" + urlWithoutProtocol;
      const url = new URL(urlWithHttps);
      if (!url.host.startsWith(".")) {
        //open in new tab
        window.open(urlWithHttps, "_blank"); // Open the link in a new tab or window
        return true;
      }
      const filePath = decodeURI(urlWithoutProtocol);
      setSelectedFile(
        selectedFile.findNodeByRelativePath(filePath)?.getCopy() ?? selectedFile
      );
      return true;
    }, [])
  );

  return <></>;
};

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const RemirrorMarkdownEditor: FC<
  PropsWithChildren<MarkdownEditorProps>
> = ({
  placeholder,
  children,
  theme,
  persistMarkdown,
  customUploadHandler,
  selectedFile,
  setSelectedFile,
  ...rest
}) => {
  const extensions: () => Extension[] = useCallback(
    () => [
      new LinkExtension({
        defaultProtocol: "https://",
      }),
      new PlaceholderExtension({ placeholder: "Start typing here..." }),
      new BoldExtension(),
      new StrikeExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new BlockquoteExtension(),
      new BulletListExtension({ enableSpine: false }),
      new OrderedListExtension(),
      new ListItemExtension({
        priority: ExtensionPriority.High,
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
      new ImageExtension({
        //@ts-ignore
        uploadHandler: customUploadHandler,
      }),
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
      {...rest}
      classNames={["overflow-hidden", "outline-none", "prose", "prose-zinc"]}
    >
      {/* <MarkdownToolbar /> */}
      <RemirrorCustomToolbar/>
      <EditorComponent />
      <OnChangeMarkdown
        persistMarkdown={(markdown) => {
          if (persistMarkdown) persistMarkdown(markdown);
        }}
      />
      <OnClickLink
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile || (() => {})}
      />
      {children}
    </Remirror>
  );
};
