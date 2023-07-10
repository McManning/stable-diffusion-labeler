
import React, { createContext, forwardRef, useEffect, useState } from 'react';
import { Group, Item, CheckboxSetField, Text, Stack, TextField } from '@osuresearch/ui';
import { useActiveImage } from '@/hooks/useActiveImage';
import { useGlobalTags } from '@/hooks/useGlobalTags';
import { GlobalTagsFilter } from '@/components/GlobalTagsFilter';

export type IGlobalTagsContext = ReturnType<typeof useGlobalTags>;

export const GlobalTagsContext = createContext<IGlobalTagsContext>({} as IGlobalTagsContext);

export function GlobalTagsPanel() {
  const ctx = useGlobalTags();
  const { image, setTags } = useActiveImage();

  const onAddTag = (tag: string) => {
    const current = image?.tags ?? [];

    if (current.includes(tag)) {
      return;
    }

    setTags([...current, tag]);
  }

  const { tags } = ctx;

  return (
    <GlobalTagsContext.Provider value={ctx}>
      <Stack w="100%" align="stretch" px="sm">
        <GlobalTagsFilter />

        {Object.keys(tags).map((section) =>
          <Stack key="section" pb="md">
            <Text fs="sm" c="neutral-subtle">{section}</Text>
            {tags[section].map((tag) =>
              <Group key={tag} as="button" onClick={() => onAddTag(tag)} justify="apart" w="100%">
                <Text>{tag}</Text>
                <Text fs="xs" c="neutral-subtle">
                  xx
                </Text>
              </Group>
            )}
          </Stack>
        )}
      </Stack>
    </GlobalTagsContext.Provider>
  )
}
