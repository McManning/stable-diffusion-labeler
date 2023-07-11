import { searchTags } from "@/utils";
import { Typography } from "@mui/material";

export interface TagsDiffProps {
  tags: string[]
  search: ImageSearchFilter
  replace: ImageReplaceFilter
}

export function TagsDiff({ tags, search, replace }: TagsDiffProps) {
  const tag = searchTags(search, tags);

  // TODO: UX. Highlight, strikethrough, etc.

  if (tag && !replace.terms && !search.regex) {
    return <Typography>{tag}</Typography>;
  }

  return <Typography>{tag} to {replace.terms}</Typography>;
}
