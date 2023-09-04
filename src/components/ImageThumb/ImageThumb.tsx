import React, { memo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  BoxProps,
  ButtonBase,
  ButtonProps,
  Typography,
  styled,
} from '@mui/material';
import Image from 'mui-image';

import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import { openContextMenu } from '@/features/settings';
import {
  addToSelection,
  deleteImages,
  setActiveImage,
} from '@/features/workspace';
import { useAppSelector } from '@/hooks';

export type ImageThumbProps = {
  image: TrainingImage;
  size: number;
};

interface RootProps extends ButtonProps {
  isSelected?: boolean;
}

const Root = styled(ButtonBase)<RootProps>(({ isSelected, theme }) => ({
  padding: 2,
  outline: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
  borderRadius: 9,
  width: '100%',
  height: '100%',
  background: isSelected
    ? '#111827' // theme.palette.primary.dark
    : theme.palette.background.default,
}));

const Tag = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 4,
  position: 'absolute',
  top: 4,
  left: 4,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 3,
}));

export function ImageThumb({ image, size }: ImageThumbProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const selectedImages = useAppSelector((s) => s.workspace.selected);

  const { setImage } = useCanvasInteractions();
  const dispatch = useDispatch();

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

  return (
    <Box sx={{ width: size, height: size }} padding={0.25}>
      <Root
        ref={ref}
        type="button"
        onClick={onSelect}
        onContextMenu={onContextMenu}
        isSelected={isSelected}
      >
        {/* {search && <TagSearch>{searchTags(search, image.tags)}</TagSearch>} */}
        <Image
          alt=""
          fit="contain"
          src={`file-protocol://getTrainingImage/${image.name}`}
          width="100%"
          height="100%"
          // shift="right"
          // distance="50px"
          duration={500}
        />

        <Tag>
          <Typography
            fontSize={12}
            color={image.tags.length < 1 ? 'error' : 'text.primary'}
          >
            {image.tags.length} tags
          </Typography>
        </Tag>
      </Root>
    </Box>
  );
}
