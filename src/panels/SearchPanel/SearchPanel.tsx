
import { memo, useState } from "react";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/hooks";
import { useElementSize } from "@/hooks/useElementSize";

import { ImageGrid } from "@/components/ImageGrid";
import { updateWorkspace } from "@/features/workspace";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { SearchReplaceField } from "@/components/SearchReplaceField";
import { ImageViewModeButtonGroup, ImageViewMode } from "@/components/ImageViewModeButtonGroup";
import { theme } from "@/renderer/theme";
import { Panel } from "@/components/Panel";
import { ImageList } from "@/components/ImageList";
import { Unavailable } from "./Unavailable";

function SearchPanelImpl() {
  const { workspace, images: allImages, filteredImages } = useActiveWorkspace();
  const dispatch = useDispatch();

  const { ref, width, height } = useElementSize<HTMLDivElement>();

  // const untaggedCount = images.filter((i) => i.tags.length < 1).length;

  const images = filteredImages !== undefined ? filteredImages : allImages;
  const count = images.length;

  if (!workspace) {
    return (
      <Unavailable />
    )
  }

  return (
    <Panel overflow="hidden">
      <Stack height="100%" width="100%">
        {!workspace &&
          <Typography>Open a workspace to search</Typography>
        }

        <Stack p={1} pb={0} gap={1}>
          <SearchReplaceField />
        </Stack>

        <Stack p={1} direction="row">
          <Typography color="#9CA3AF"> {/* TODO: Fix color */}

          {count > 0 && `${count} images`}
          {count === 0 && 'No results found.'}
          </Typography>
        </Stack>

        <Box width="100%" height="100%" ref={ref} pl={1}>
          <ImageList images={images} width={width} height={height} isFiltered />
        </Box>
      </Stack>
    </Panel>
  );
}

export const SearchPanel = memo(SearchPanelImpl);
