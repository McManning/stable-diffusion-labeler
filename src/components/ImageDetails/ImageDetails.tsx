import React, { useRef } from 'react';
import {
  Box,
  ButtonProps,
  ButtonBase,
  Stack,
  Typography,
  alpha,
  styled,
} from '@mui/material';

import { useActiveImage } from '@/hooks/useActiveImage';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import { Thumbnail } from '../Thumbnail';
import {
  addToSelection,
  deleteImages,
  setActiveImage,
} from '@/features/workspace';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/hooks';
import { openContextMenu } from '@/features/settings';

export interface ImageDetailsProps {
  image: TrainingImage;

  /** Fixed height of this item in a virtual list */
  height: number;

  /**
   * Should the image display tag matches
   * against current search/replace filters
   */
  isFiltered?: boolean;
}

interface RootProps extends ButtonProps {
  isSelected?: boolean;
}

const Root = styled(ButtonBase)<RootProps>(({ isSelected, theme }) => ({
  // outline: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
  width: '100%',
  padding: 2,
  justifyContent: 'left',
  textAlign: 'left',
  background: isSelected ? alpha(theme.palette.primary.main, 0.1) : undefined,
}));

export function ImageDetails({ image, height, isFiltered }: ImageDetailsProps) {
  const { image: activeImage } = useActiveImage();
  const { setImage } = useCanvasInteractions();
  const dispatch = useDispatch();

  const selectedImages = useAppSelector((s) => s.workspace.selected);

  // TODO: Consolidate code. This is all duplicated with
  // ImageThumb.

  const onSelect = (e: React.MouseEvent) => {
    // Multi-select mode
    if (e.ctrlKey) {
      dispatch(addToSelection([image]));
      return;
    }

    setImage(image);
    dispatch(setActiveImage(image));
  };

  const onDelete = () => {
    dispatch(deleteImages([image]));
  };

  const onContextMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    dispatch(
      openContextMenu({
        context: 'Edit Image',
        position: {
          x: e.clientX,
          y: e.clientY,
        },
        options: [
          { label: 'Delete', action: onDelete },
          {
            label: 'Reveal in File Explorer',
            action: () => window.backend.revealFile(image.name),
          },
        ],
      })
    );
  };

  const isSelected =
    selectedImages.find((s) => s.id === image.id) !== undefined;

  // TODO: Fetch naturalWidth/naturalHeight of the
  // underlying image after it's loaded.
  // mui-image doesn't seem to pass refs down.

  return (
    <Box sx={{ height }}>
      <Root
        type="button"
        onClick={onSelect}
        onContextMenu={onContextMenu}
        isSelected={isSelected}
      >
        <Stack direction="row" gap={1}>
          <Thumbnail image={image} isSelected={isSelected} size={height - 4} />

          <Stack gap={0.5} mt={1}>
            {!isFiltered && (
              <Typography
                color={image.tags.length < 1 ? 'error' : 'text.primary'}
              >
                {image.tags.length} tags
              </Typography>
            )}
            <Box
              whiteSpace="nowrap"
              fontSize="small"
              color="text.secondary"
              textOverflow="ellipsis"
            >
              {/* 1920&times;1080 &middot;  */}
              {image.id}
            </Box>
          </Stack>
        </Stack>
      </Root>
    </Box>
  );
}
