import { ChangeEvent, useState } from 'react';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  TextField,
  ToggleButton,
} from '@mui/material';
import { Icon } from '@osuresearch/iconography';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/hooks';
import { setReplaceFilter, setSearchFilter } from '@/features/workspace';
import { useImageSearch } from '@/hooks/useImageSearch';

export interface SearchReplaceFieldProps {}

export function SearchReplaceField({}: SearchReplaceFieldProps) {
  const search = useAppSelector((s) => s.workspace.search);
  const replace = useAppSelector((s) => s.workspace.replace);
  const dispatch = useDispatch();

  const { applyReplace } = useImageSearch();

  const onToggleRegex = () => {
    dispatch(
      setSearchFilter({
        ...search,
        regex: !search.regex,
      })
    );
  };

  const onSearchTerms = (e: ChangeEvent<HTMLInputElement>) => {
    const terms = e.currentTarget.value;
    if (terms === search.terms) {
      return;
    }

    // TODO: Throttle?
    dispatch(
      setSearchFilter({
        ...search,
        terms,
      })
    );
  };

  const onReplaceTerms = (e: ChangeEvent<HTMLInputElement>) => {
    const terms = e.currentTarget.value;
    if (terms === replace.terms) {
      return;
    }

    // TODO: Throttle?
    dispatch(
      setReplaceFilter({
        ...replace,
        terms,
      })
    );
  };

  const onApplyReplace = () => {
    if (
      window.confirm('Are you sure you want to apply this change to all files?')
    ) {
      applyReplace();
    }
  };

  return (
    <Stack component="form" gap={1}>
      <FormControl variant="outlined" size="small" hiddenLabel>
        <OutlinedInput
          id="search-tags"
          aria-label="Search"
          placeholder="Search"
          value={search.terms}
          onChange={onSearchTerms}
          endAdornment={
            <InputAdornment component={Box} position="end" mr={-1}>
              <ToggleButton
                value="regex"
                aria-label="Toggle regex"
                size="small"
                sx={{ padding: '2px' }}
                selected={search?.regex}
                onClick={onToggleRegex}
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
          value={replace.terms}
          onChange={onReplaceTerms}
          hiddenLabel
          fullWidth
        />

        <IconButton
          type="button"
          aria-label="Replace all"
          onClick={onApplyReplace}
        >
          <Icon name="replaceAll" size={26} />
        </IconButton>
      </Stack>
    </Stack>
  );
}
