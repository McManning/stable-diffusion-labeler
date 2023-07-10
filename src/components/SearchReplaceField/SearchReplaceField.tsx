import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, TextField, ToggleButton } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import { Icon } from "@osuresearch/iconography";
import { useState } from "react";

export type SearchValue = {
  text: string
  regex: boolean
}

export type ReplaceValue = {
  text: string
}

export interface SearchReplaceFieldProps {
  onSearch: (search: SearchValue) => void;
  onPreviewReplace: (search: SearchValue, replace: ReplaceValue) => void;
  onReplace: (search: SearchValue, replace: ReplaceValue) => void;
}

export function SearchReplaceField({ onSearch, onPreviewReplace, onReplace }: SearchReplaceFieldProps) {
  const [search, setSearch] = useState<SearchValue>({ text: '', regex: false });
  const [replace, setReplace] = useState<ReplaceValue>({ text: '' });

  const updateSearch = (newSearch: SearchValue) => {
    if (search.text === newSearch.text && search.regex === newSearch.regex) {
      return;
    }

    setSearch(newSearch);

    onSearch(newSearch);
    if (replace.text) {
      onPreviewReplace(newSearch, replace);
    }
  }

  const updateReplace = (newReplace: ReplaceValue) => {
    setReplace(newReplace);

    if (replace.text !== newReplace.text) {
      onPreviewReplace(search, newReplace);
    }
  }

  const toggleRegex = () => {
    updateSearch({ ...search, regex: !search.regex })
  }

  return (
    <Stack component="form" gap={1}>
      <FormControl variant="outlined" size="small" hiddenLabel>
        <OutlinedInput
          id="search-tags"
          aria-label="Search"
          placeholder="Search"
          endAdornment={
            <InputAdornment component={Box} position="end" mr={-1}>
              <ToggleButton
                value="regex"
                aria-label="Toggle regex"
                size="small"
                sx={{ padding: '2px' }}
                selected={search.regex}
                onClick={toggleRegex}
              >
                <Icon name="regex" size={24} />
              </ToggleButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Stack direction="row">
        <TextField
          id="replace-tags"
          variant="outlined"
          size="small"
          aria-label="Replace"
          placeholder="Replace"
          hiddenLabel
          fullWidth
        />

        <IconButton type="button" aria-label="Replace all">
          <Icon name="replaceAll" size={26} />
        </IconButton>
      </Stack>
    </Stack>
  )
}
