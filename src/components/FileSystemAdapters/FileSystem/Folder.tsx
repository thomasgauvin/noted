import { useState } from "react";
import DirectoryNode from "../../../models/DirectoryNode";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

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
          className="p-1 hover:bg-zinc-200/70 rounded flex"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {expanded ? (
            <ChevronDown className="h-5 w-5 cursor-pointer hover:bg-zinc-300 rounded" />
          ) : (
            <ChevronRight className="h-5 w-5 cursor-pointer hover:bg-zinc-300 rounded" />
          )}
          <div className="pl-0.5 text-sm">{node.name}</div>
        </div>
      )}
      <div
        className={`${depth === 0 ? "" : "ml-4"} ${
          expanded ? "block" : "hidden"
        }`}
      >
        {node.children.map((child) => (
          <div key={child.name}>
            {child.children.length === 0 ? ( // Render file
              <div
                className={`ml-${(depth + 1) * 20} cursor-pointer
                text-sm
                  p-1 hover:bg-zinc-200/70 rounded ${
                    child.unsavedChanges ? "italic" : ""
                  }`}
                onClick={() => {
                  handleFileSelect(child);
                }}
              >
                <div className="pl-1">
                  {child.name}
                  {child.unsavedChanges ? "*" : ""}
                </div>
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
