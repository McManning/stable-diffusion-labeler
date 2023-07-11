
import React, { useRef } from 'react';
import { Box, BoxProps, ButtonBase, Stack, Typography, alpha, styled } from '@mui/material';
import Image from 'mui-image';

import { useActiveImage } from '@/hooks/useActiveImage';
import { useActiveWorkspace } from '@/hooks/useActiveWorkspace';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import { Thumbnail } from '../Thumbnail';
import { TagsDiff } from '../TagsDiff';
import { setActiveImage } from '@/features/workspace';
import { useDispatch } from 'react-redux';

export interface ImageDetailsProps {
  image: TrainingImage

  /** Fixed height of this item in a virtual list */
  height: number

  /**
   * Should the image display tag matches
   * against current search/replace filters
   */
  isFiltered?: boolean
}

interface RootProps extends BoxProps {
  isSelected?: boolean
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
  const { search, replace } = useActiveWorkspace();
  const dispatch = useDispatch();

  const onSelect = () => {
    // TODO: Detect shift+click or ctrl+click selection mode.
    setImage(image);
    dispatch(setActiveImage(image));
  }

  const isSelected = activeImage?.id === image?.id;

  // TODO: Fetch naturalWidth/naturalHeight of the
  // underlying image after it's loaded.
  // mui-image doesn't seem to pass refs down.

  return (
    <Box sx={{ height }}>
      <Root type="button" onClick={onSelect} isSelected={isSelected}>
        <Stack direction="row" gap={1}>
          <Thumbnail image={image} isSelected={isSelected} size={height - 4} />

          <Stack gap={0.5} mt={1}>
            {isFiltered &&
              <TagsDiff tags={image.tags} search={search} replace={replace} />
            }
            {!isFiltered &&
              <Typography color={image.tags.length < 1 ? 'error' : 'text.primary'}>
                {image.tags.length} tags
              </Typography>
            }

            <Box whiteSpace="nowrap" fontSize="small" color="text.secondary" textOverflow="ellipsis">
              1920&times;1080 &middot; {image.id}
            </Box>
          </Stack>
        </Stack>
      </Root>
    </Box>
  )
}
