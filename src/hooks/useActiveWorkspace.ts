import { useDispatch } from "react-redux";
import { useAppSelector } from ".";
import { useEffect, useState } from "react";
import { setSearchFilter } from "@/features/workspace";
import { isMatch, searchTags } from "@/utils";

export function useActiveWorkspace() {
  const workspace = useAppSelector((s) => s.workspace.activeWorkspace);
  const images = useAppSelector((s) => s.workspace.activeWorkspace?.images ?? []);
  const search = useAppSelector((s) => s.workspace.search);
  const replace = useAppSelector((s) => s.workspace.replace);
  const dispatch = useDispatch();

  // Apply search filters
  let filteredImages = images;
  if (search.terms.length > 0) {
    filteredImages = filteredImages.filter((img) => isMatch(img, search))
  }

  // Untagged image filtering is a common search, so this is
  // also tracked independently.
  const untaggedImages = images.filter((img) => img.tags.length < 1);

  return {
    workspace,
    images,
    filteredImages,
    untaggedImages,

    search,
    replace,
  }
}
