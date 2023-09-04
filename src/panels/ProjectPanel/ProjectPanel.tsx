import { memo, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import { useElementSize } from '@/hooks/useElementSize';

import { ImageGrid } from '@/components/ImageGrid/ImageGrid';
import { OpenWorkspaceButton } from '@/components/OpenWorkspaceButton';
import { useActiveWorkspace } from '@/hooks/useActiveWorkspace';
import {
  ImageViewModeButtonGroup,
  ImageViewMode,
} from '@/components/ImageViewModeButtonGroup';
import { updateWorkspace } from '@/features/workspace';
import { ImageList } from '@/components/ImageList';
import { Panel } from '@/components/Panel';
import { useImageSearch } from '@/hooks/useImageSearch';
import { RecentWorkspacesList } from '@/components/RecentWorkspacesList';

function ProjectPanelImpl() {
  const { workspace, images } = useActiveWorkspace();
  const { untaggedImages } = useImageSearch();
  const dispatch = useDispatch();

  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const [viewMode, setViewMode] = useState<ImageViewMode>('thumbnails');
  const [untagged, setUntagged] = useState(false);

  const onRename = (name: string | undefined) => {
    if (!workspace) return;

    dispatch(
      updateWorkspace({
        ...workspace,
        name: name ?? '',
      })
    );
  };

  const untaggedCount = untaggedImages.length;
  const imageList = untagged ? untaggedImages : images;

  return (
    <Panel>
      <Stack height="100%" width="100%" overflow="hidden">
        {!workspace && (
          <Stack direction="column" gap={1}>
            <OpenWorkspaceButton />
            <RecentWorkspacesList />
          </Stack>
        )}

        {workspace && (
          <Stack direction="row" p={1}>
            <Typography color="#9CA3AF">
              {' '}
              {/* TODO: Fix color */}
              {!untagged && (
                <>
                  {images.length} images &middot;
                  <Button
                    variant="text"
                    sx={{
                      padding: 0.5,
                      fontSize: '1rem',
                      verticalAlign: 'baseline',
                    }}
                    onClick={() => setUntagged(true)}
                  >
                    {untaggedCount} untagged
                  </Button>
                </>
              )}
              {untagged && (
                <>
                  {untaggedCount} untagged images &middot;
                  <Button
                    variant="text"
                    sx={{
                      padding: 0.5,
                      fontSize: '1rem',
                      verticalAlign: 'baseline',
                    }}
                    onClick={() => setUntagged(false)}
                  >
                    Show all
                  </Button>
                </>
              )}
            </Typography>

            <Box flexGrow={1} />
            <ImageViewModeButtonGroup value={viewMode} onChange={setViewMode} />
          </Stack>
        )}

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

        <Box width="100%" height="100%" ref={ref} pl={1}>
          {viewMode === 'thumbnails' && (
            <ImageGrid images={imageList} width={width} height={height} />
          )}
          {viewMode === 'details' && (
            <ImageList images={imageList} width={width} height={height} />
          )}
        </Box>
      </Stack>
    </Panel>
  );
}

export const ProjectPanel = memo(ProjectPanelImpl);
