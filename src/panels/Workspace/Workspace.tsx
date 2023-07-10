
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/hooks";
import { useElementSize } from "@/hooks/useElementSize";

import { ImageGrid } from "./ImageGrid";
import { updateWorkspace } from "@/features/workspace";
import { OpenWorkspaceButton } from "../../components/OpenWorkspaceButton";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { ImageFilterField } from "@/components/ImageFilterField";
import { TextField } from "@osuresearch/ui";
import { SearchReplaceField } from "@/components/SearchReplaceField";
import { theme } from "@/renderer/theme";
import { memo, useState } from "react";
import { ImageViewModeButtonGroup, ImageViewMode } from "@/components/ImageViewModeButtonGroup";

function WorkspacePanel() {
  const { workspace, images } = useActiveWorkspace();
  const dispatch = useDispatch();

  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const [viewMode, setViewMode] = useState<ImageViewMode>('thumbnails');

  const onRename = (name: string | undefined) => {
    if (!workspace) return;

    dispatch(updateWorkspace({
      ...workspace,
      name: name ?? ''
    }));
  }

  const untaggedCount = images.filter((i) => i.tags.length < 1).length;

  return (
    <Stack height="100%" overflow="hidden" sx={{ background: theme.palette.background.paper }}>
      {!workspace &&
        <Stack direction="column" alignItems="center" spacing={2}>
          You have not yet opened a workspace.
          <OpenWorkspaceButton />
        </Stack>
      }

      {workspace &&
      <>
        <Stack p={1} pb={0} gap={1}>
          <SearchReplaceField />
        </Stack>
        <Stack p={1} direction="row">
          <Typography color="#9CA3AF"> {/* TODO: Fix color */}
            {images.length} images &middot;
            <Button variant="text" sx={{  padding: 0.5, fontSize: '1rem', verticalAlign: 'baseline' }}>
              {untaggedCount} untagged
            </Button>
          </Typography>

          <Box flexGrow={1} />
          <ImageViewModeButtonGroup value={viewMode} onChange={setViewMode} />
        </Stack>
      </>
      }

      {/* {workspace &&
        <Stack>
          <TextField
            name="name"
            aria-label="Workspace name"
            value={workspace.name}
            onChange={onRename}
          />
          <ImageFilterField />
        </Stack>
      } */}

      <Box width="100%" height="100%" ref={ref}>
        <ImageGrid
          count={images.length}
          width={width}
          height={height}
          thumbnailSize={160}
        />
      </Box>
    </Stack>
  );
}

export const Workspace = memo(WorkspacePanel);
