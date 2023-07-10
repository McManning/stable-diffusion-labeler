import { Chip, Item, MenuButton, Section, Text, TextField } from "@osuresearch/ui"
import { useContext, useState } from "react"
import { Selection } from "react-stately"
import { BooruTagsContext } from "@/panels/BooruTagsPanel";

function FiltersMenu() {
  const { categories, setCategories } = useContext(BooruTagsContext);

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
        <Item key="Artist"><Text c="accent05">Artist</Text></Item>
        <Item key="General"><Text c="accent01">General</Text></Item>
        <Item key="Copyright"><Text c="accent02">Copyright</Text></Item>
        <Item key="Character"><Text c="accent03">Character</Text></Item>
        <Item key="Meta"><Text c="accent04">Meta</Text></Item>
      </Section>
    </MenuButton>
  )
}

export function BooruTagsFilter() {
  const { setFilter } = useContext(BooruTagsContext);

  return (
    <TextField
      mt="-sm"
      name="search"
      aria-label="Search"
      placeholder="Search booru tags"
      onChange={setFilter}
      renderRight={<FiltersMenu />}
    />
  )
}
