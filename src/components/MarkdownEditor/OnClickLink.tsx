import { FC, PropsWithChildren, useCallback } from "react";

import { useExtensionEvent } from "@remirror/react";
import DirectoryNode from "../../models/DirectoryNode";
import { LinkExtension } from "remirror/extensions";

export const OnClickLink = ({
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
