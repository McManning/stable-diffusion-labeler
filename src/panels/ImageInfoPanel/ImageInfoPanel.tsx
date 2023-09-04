import React, { useEffect, useMemo, useState } from 'react';

import { useActiveImage } from '@/hooks/useActiveImage';
import { TagsHelpDisclosure } from './TagsHelpDisclosure';
import { TagsField } from '@/components/TagsField';
import { Panel } from '@/components/Panel';
import { useAppSelector } from '@/hooks';
import { Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateImages } from '@/features/workspace';

export function ImageInfoPanel() {
  const [text, setText] = useState('');
  const { image, setTags } = useActiveImage();
  const images = useAppSelector((s) => s.workspace.selected);
  const dispatch = useDispatch();

  // Common tags across all selected images
  const tags = useMemo(() => {
    if (images.length < 1) {
      return [];
    }

    let tags = [...images[0].tags];
    images.forEach((img) => {
      tags = tags.filter((t) => img.tags.includes(t));
    });

    return tags;
  }, [images]);

  useEffect(() => {
    setText(tags.join(', '));
  }, [tags]);

  const onUpdateTags = (updatedText: string) => {
    if (text === updatedText) {
      return;
    }

    setText(updatedText);

    const updatedTags = updatedText?.split(',') ?? [];

    // Simple case, singular image
    if (images.length === 1) {
      setTags(updatedTags);
    } else if (images.length > 1) {
      // Note that we don't support moving tags around here. Since
      // common tags may be in any order relative to other per-image tags,
      // we don't want to guess placement.
      const added = updatedTags.filter((tag) => !tags.includes(tag));
      const removed = tags.filter((tag) => !updatedTags.includes(tag));

      const updatedImages = images.map((img) => {
        return {
          ...img,
          tags: Array.from(
            new Set([
              ...img.tags.filter((tag) => !removed.includes(tag)),
              ...added,
            ])
          ),
        };
      });

      dispatch(updateImages(updatedImages));
    }
  };

  return (
    <Panel padding={2}>
      <TagsField
        label={
          images.length > 1 ? `Common tags for ${images.length} images` : 'Tags'
        }
        name="tags"
        value={text}
        onChange={onUpdateTags}
        allowDragDrop={images.length === 1}
      />
      {/* <TagsHelpDisclosure /> */}

      {images.length > 1 && (
        <Stack>
          {images.map((img) => (
            <Typography key={img.id} color="text.secondary" fontSize={14}>
              {img.id}: {img.tags.join(', ')}
            </Typography>
          ))}
        </Stack>
      )}
    </Panel>
  );
}
