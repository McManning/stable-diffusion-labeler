import { memo, useState } from 'react';
import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/hooks';
import { useElementSize } from '@/hooks/useElementSize';

import { ImageGrid } from '@/components/ImageGrid';
import { updateWorkspace } from '@/features/workspace';
import { useActiveWorkspace } from '@/hooks/useActiveWorkspace';
import { SearchReplaceField } from '@/components/SearchReplaceField';
import {
  ImageViewModeButtonGroup,
  ImageViewMode,
} from '@/components/ImageViewModeButtonGroup';
import { Panel } from '@/components/Panel';
import { ImageList } from '@/components/ImageList';
import { Unavailable } from './Unavailable';
import { useImageSearch } from '@/hooks/useImageSearch';
import { SearchResult } from './SearchResult';

function SearchPanelImpl() {
  const { workspace, images } = useActiveWorkspace();
  const { hits } = useImageSearch();

  const search = useAppSelector((s) => s.workspace.search);
  const replace = useAppSelector((s) => s.workspace.replace);
  const dispatch = useDispatch();

  const { ref, width, height } = useElementSize<HTMLDivElement>();

  const uniqueImageIds = new Set(hits.map((hit) => hit.image.id));

  const totalHits = hits.reduce((agg, hit) => agg + hit.tags.length, 0);

  if (!workspace) {
    return <Unavailable />;
  }

  return (
    <Panel overflow="hidden">
      <Stack height="100%" width="100%">
        {!workspace && <Typography>Open a workspace to search</Typography>}

        <Stack p={1} pb={0} gap={1}>
          <SearchReplaceField />
        </Stack>

        <Stack p={1} direction="row">
          <Typography color="text.secondary">
            {hits.length > 0 && `${totalHits} hits in ${hits.length} images`}
            {hits.length === 0 && 'No results found.'}
          </Typography>
        </Stack>

        <Box
          width="100%"
          height="100%"
          ref={ref}
          pl={1}
          sx={{ overflowY: 'scroll', overflowX: 'hidden' }}
        >
          {hits.map((hit) => (
            <SearchResult result={hit} />
          ))}
          {/* <ImageList
            images={images}
            width={width}
            height={height}
            isFiltered={search.terms.length > 0}
          /> */}
        </Box>
      </Stack>
    </Panel>
  );
}

export const SearchPanel = memo(SearchPanelImpl);
