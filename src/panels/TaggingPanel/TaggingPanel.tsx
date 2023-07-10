import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { TabPanel, Item, TextAreaField, Text, Stack, ExternalLink, TextField } from '@osuresearch/ui';

import { useActiveImage } from '@/hooks/useActiveImage';
import { TagsHelpDisclosure } from './TagsHelpDisclosure';
import { TagsField } from '@/components/TagsField';
import { Panel } from '@/components/Panel';

export function ImageInfoPanel() {
  const [text, setText] = useState('');
  const { image, setTags } = useActiveImage();

  useEffect(() => {
    setText(image?.tags.join(', ') ?? '');
  }, [image]);

  const onUpdateTags = (tags: string) => {
    if (text !== tags) {
      setText(tags);
      setTags(tags?.split(',') ?? []);
    }
  }

  return (
    <Panel padding={2}>
      <TagsField
        label="Tags"
        name="tags"
        value={text}
        onChange={onUpdateTags}
      />
      {/* <TagsHelpDisclosure /> */}
    </Panel>
  )
}
