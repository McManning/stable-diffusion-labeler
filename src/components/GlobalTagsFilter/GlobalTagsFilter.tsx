import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useGlobalTags } from "@/hooks/useGlobalTags";
import { Chip, Item, MenuButton, Section, Text, TextField } from "@osuresearch/ui"
import { useContext, useState } from "react"
import { Selection } from "react-stately"
import { GlobalTagsContext } from "@/panels/GlobalTagsPanel";

function FiltersMenu() {
  const { tags, categories, setCategories } = useContext(GlobalTagsContext);

  const onSelectionChange = (keys: Selection) => {
    const selected = Array.from(keys);

    setCategories(selected as string[]);
  }

  const count = categories.length;

  return (
    <MenuButton
      label={count > 0 ? `(${count})` : ''}
      onSelectionChange={onSelectionChange}
      selectedKeys={categories}
      selectionMode="multiple"
      h="100%"
    >
      <Section title="Filters">
        {Object.keys(tags).map((section) =>
          <Item key={section}>{section}</Item>
        )}
      </Section>
    </MenuButton>
  )
}

export function GlobalTagsFilter() {
  const { filter, setFilter } = useContext(GlobalTagsContext);

  return (
    <TextField
      name="search"
      aria-label="Search"
      placeholder="Search global tags"
      onChange={setFilter}
      renderRight={<FiltersMenu />}
    />
  )
}
