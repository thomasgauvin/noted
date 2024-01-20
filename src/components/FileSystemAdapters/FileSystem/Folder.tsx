import { useState } from "react";
import DirectoryNode from "../../../models/DirectoryNode";
import { ChevronRight } from "lucide-react";

export function Folder({
  node,
  depth,
  handleFileSelect,
}: {
  node: DirectoryNode | null;
  depth: number;
  handleFileSelect: (file: DirectoryNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  if (!node) return null;

  return (
    <div key={node.name}>
      {depth === 0 ? null : (
        <div
          className="p-2 hover:bg-zinc-200 rounded"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <ChevronRight />
          <h3 className="text-sm font-semibold">{node.name}</h3>
        </div>
      )}
      <div className={`ml-4 ${expanded ? "block" : "hidden"}`}>
        {node.children.map((child) => (
          <div key={child.name}>
            {child.children.length === 0 ? ( // Render file
              <div
                className={`ml-${(depth + 1) * 20} cursor-pointer
                text-sm
                  p-2 hover:bg-zinc-200 rounded ${
                    child.unsavedChanges ? "italic" : ""
                  }`}
                onClick={() => {
                  handleFileSelect(child);
                }}
              >
                {child.name}
                {child.unsavedChanges ? "*" : ""}
              </div>
            ) : (
              <Folder
                node={child}
                depth={depth + 1}
                handleFileSelect={handleFileSelect}
              /> // Recursively render directory
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
