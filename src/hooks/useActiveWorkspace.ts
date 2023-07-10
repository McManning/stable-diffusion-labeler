import { useDispatch } from "react-redux";
import { useAppSelector } from ".";
import { useEffect, useState } from "react";
import { setSearchFilter } from "@/features/workspace";
import { searchTags } from "@/utils";

export function useActiveWorkspace() {
  const workspace = useAppSelector((s) => s.workspace.activeWorkspace);
  const allImages = useAppSelector((s) => s.workspace.activeWorkspace?.images ?? []);
  const filter = useAppSelector((s) => s.workspace.filter);
  const dispatch = useDispatch();

  let images = allImages;
  if (filter?.terms) {
    images = images.filter((img) => searchTags(filter.terms ?? '', img.tags));
  }

  if (filter?.untagged) {
    images = images.filter((img) => img.tags.length < 1);
  }

  return {
    workspace,
    images,

    // Search / filtering
    search: filter?.terms,

    setSearch: (terms?: string) => dispatch(setSearchFilter({
      ...filter,
      terms
    })),

    untaggedOnly: filter?.untagged,
    setUntaggedOnly: (untagged?: boolean) => dispatch(setSearchFilter({
      ...filter,
      untagged
    })),
  }
}
