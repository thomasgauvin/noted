// Add ".md" extension to a file name
export function addMdExtension(fileName: string | undefined) :string | null {
  if (!fileName) {
    return null;
  }
  return fileName.endsWith(".md") ? fileName : `${fileName}.md`;
};

// Remove ".md" extension from a file name
export function removeMdExtension(fileName: string | undefined) : string | null {
  if (!fileName) {
    return null;
  }
  return fileName.endsWith(".md") ? fileName.slice(0, -3) : fileName;
};

export function extractFrontmatter(
  markdownContent: string
): {
  markdownContent: string;
  frontmatter: string | null;
} {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---\n/;
  const match = markdownContent.match(frontmatterRegex);
  if (match) {
    return {
      markdownContent: markdownContent.replace(match[0], ""),
      frontmatter: match[1].trim(),
    };
  } else {
    return {
      markdownContent,
      frontmatter: null,
    };
  }
};
