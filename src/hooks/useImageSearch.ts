import { useDispatch } from 'react-redux';
import { useAppSelector } from '.';
import { useEffect, useState } from 'react';
import { setSearchFilter, updateWorkspace } from '@/features/workspace';
import { isMatch, searchTags } from '@/utils';

export function useImageSearch() {
  const images = useAppSelector(
    (s) => s.workspace.activeWorkspace?.images ?? []
  );
  const activeWorkspace = useAppSelector((s) => s.workspace.activeWorkspace);
  const search = useAppSelector((s) => s.workspace.search);
  const replace = useAppSelector((s) => s.workspace.replace);
  const dispatch = useDispatch();

  const [hits, setHits] = useState<ImageSearchResult[]>([]);

  useEffect(() => {
    if (search.terms.length < 1 && hits.length > 0) {
      setHits([]);
      return;
    }

    if (search.terms.length > 0) {
      const newHits: ImageSearchResult[] = [];

      images.forEach((image) => {
        const tags = searchTags(search, image.tags);
        if (tags.length < 1) return;

        newHits.push({
          image,
          tags: tags.map((match) => ({ match, replace: replace.terms })),
        });
      });

      setHits(newHits);
    }
  }, [search, replace, images]);

  // Untagged image filtering is a common search, so this is
  // also tracked independently.
  const untaggedImages = images.filter((img) => img.tags.length < 1);

  const applyReplace = async () => {
    if (!activeWorkspace) return;

    const updated = await window.backend.replaceAllTags(activeWorkspace, hits);
    dispatch(updateWorkspace(updated));
  };

  return {
    search,
    replace,
    images,
    untaggedImages,
    hits,
    applyReplace,
  };
}
