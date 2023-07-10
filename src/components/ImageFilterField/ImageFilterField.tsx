import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { Item, MenuButton, Section, TextField } from "@osuresearch/ui"
import { useState } from "react"
import { Selection } from "react-stately"

export type ImageFilterFieldProps = {

}

function FiltersMenu() {
  const { untaggedOnly, setUntaggedOnly } = useActiveWorkspace();

  const onSelectionChange = (keys: Selection) => {
    const selected = Array.from(keys);

    setUntaggedOnly(selected.includes('untagged'));
  }

  const selection: Selection = new Set();
  if (untaggedOnly) {
    selection.add('untagged');
  }

  const count = Array.from(selection).length;

  return (
    <MenuButton
      label={count > 0 ? `(${count})` : ''}
      onSelectionChange={onSelectionChange}
      selectedKeys={selection}
      selectionMode="multiple"
      h="100%"
    >
      <Section title="Filters">
        <Item key="untagged">Untagged</Item>
      </Section>
    </MenuButton>
  )
}

export function ImageFilterField(props: ImageFilterFieldProps) {
  const { search, setSearch, images } = useActiveWorkspace();

  return (
    <TextField
      name="search"
      aria-label="Search"
      placeholder={`Search ${images.length} images`}
      value={search}
      onChange={setSearch}
      renderRight={<FiltersMenu />}
    />
  )
}
