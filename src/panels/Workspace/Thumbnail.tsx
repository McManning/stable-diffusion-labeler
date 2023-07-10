import React, { memo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, BoxProps, ButtonBase, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useActiveImage } from '@/hooks/useActiveImage';
import { useActiveWorkspace } from '@/hooks/useActiveWorkspace';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import { useDragSelect } from '@/hooks/useDragSelect';
import { openContextMenu } from '@/features/settings';
import { setActiveImage } from '@/features/workspace';
import { searchTags } from '@/utils';
import Image from 'mui-image';

export type ImageProps = {
  width: number
  height: number
  index: number
}

interface ThumbnailButtonProps extends ButtonProps {
  active?: boolean
}

const ThumbnailButton = styled(ButtonBase)<ThumbnailButtonProps>(({ active, theme }) => ({
  padding: 2,
  outline: active ? `2px solid ${theme.palette.primary.main}` : 'none',
  borderRadius: 9,
  width: '100%',
  height: '100%',
  background: active
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

export function Thumbnail({ index, width, height }: ImageProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { image: activeImage } = useActiveImage();
  const { images, search } = useActiveWorkspace();
  const { setImage } = useCanvasInteractions();
  const dispatch = useDispatch();

  const ds = useDragSelect();

  const image = images[index];

  useEffect(() => {
    const element = ref.current as unknown as HTMLElement;
    if (!element || !ds) return;

    ds.addSelectables(element);

    return () => {
      ds.removeSelectables(element)
    }
  }, [ds, ref]);

  useEffect(() => {
    if (!ds) return;

    const id = ds.subscribe('callback', (e: any) => {
      // do something
      console.log(e)
    });

    return () => {
      ds.unsubscribe('callback', undefined, id)
    }
  }, []);

  const onSelect = () => {
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

  const isActiveImage = activeImage?.id === image?.id;

  if (!image) {
    return null;
  }

  return (
    <Box sx={{ width, height }} padding={0.25}>
      <ThumbnailButton
        ref={ref}
        type="button"
        onMouseDown={onSelect}
        onContextMenu={onContextMenu}
        active={isActiveImage}
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

        {!search && <Tag>{image.tags.length} tags</Tag>}
      </ThumbnailButton>
    </Box>
  );
}
