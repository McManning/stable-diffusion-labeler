import { createContext } from "react";
import { Group, Stack, Text } from "@osuresearch/ui";
import numbro from "numbro";
import { useActiveImage } from "@/hooks/useActiveImage";
import { useBooruTags } from "@/hooks/useBooruTags";
import { getBooruCategoryColor } from "@/utils";
import { BooruTagsFilter } from "@/components/BooruTagsFilter";

export type IBooruTagsContext = ReturnType<typeof useBooruTags>;

export const BooruTagsContext = createContext<IBooruTagsContext>({} as IBooruTagsContext);

export function BooruTagsPanel() {
  const ctx = useBooruTags();
  const { image, setTags } = useActiveImage();

  const onAddTag = (tag: BooruTag) => {
    const current = image?.tags ?? [];

    if (current.includes(tag.value)) {
      return;
    }

    setTags([...current, tag.value]);
  }

  const { tags } = ctx;

  return (
    <BooruTagsContext.Provider value={ctx}>
      <div className="sticky top-0 z-10 p-sm bg-light-tint">
        <BooruTagsFilter />
      </div>
      {tags.map((tag) =>
        <Group mt="sm" key={tag.id} as="button" onClick={() => onAddTag(tag)} justify="apart" w="100%" px="md">
          <Text c={getBooruCategoryColor(tag.category ?? 0)}
            style={{ overflow: 'hidden' }}
          >{tag.label}</Text>

          <Text fs="xs" c="neutral-subtle">
            {numbro(tag.count).format({ average: true, totalLength: 2 })}
          </Text>
        </Group>
      )}
    </BooruTagsContext.Provider>
  )
}
