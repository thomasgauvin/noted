import DirectoryNode from "../../models/DirectoryNode";
import { RemirrorComponent } from "./RemirrorComponent";

export const FileEditor: React.FC = ({
  selectedFile,
}: {
  selectedFile: DirectoryNode | null;
}) => {
  return (
    <div className="flex-1">
      <TextField.Input size="3" placeholder="Search the docs…" />
      <RemirrorComponent selectedFile={selectedFile} />
    </div>
  );
};
