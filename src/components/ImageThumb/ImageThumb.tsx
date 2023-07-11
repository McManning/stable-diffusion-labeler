
import React, { memo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, BoxProps, ButtonBase, ButtonProps, styled } from '@mui/material';
import Image from 'mui-image';

import { useActiveImage } from '@/hooks/useActiveImage';
import { useActiveWorkspace } from '@/hooks/useActiveWorkspace';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import { useDragSelect } from '@/hooks/useDragSelect';
import { openContextMenu } from '@/features/settings';
import { setActiveImage } from '@/features/workspace';
import { searchTags } from '@/utils';
import { Thumbnail } from '../Thumbnail';

export type ImageThumbProps = {
  image: TrainingImage
  size: number
}

interface RootProps extends ButtonProps {
  isSelected?: boolean
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
  const { image: activeImage } = useActiveImage();
  const { setImage } = useCanvasInteractions();
  const dispatch = useDispatch();

  const onSelect = () => {
    // TODO: Detect shift+click or ctrl+click selection mode.
    setImage(image);
    dispatch(setActiveImage(image));
  }

  const onContextMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    dispatch(openContextMenu({
      context: 'image',
      data: image,
      position: {
        x: e.clientX,
        y: e.clientY,
      }
    }))
  }

  const isSelected = activeImage?.id === image?.id;

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

        <Tag>{image.tags.length} tags</Tag>
      </Root>
    </Box>
  );
}
