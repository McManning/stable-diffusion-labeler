
import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton, styled } from '@mui/material';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import { Icon } from '@osuresearch/iconography';

export type ImageViewMode = 'thumbnails' | 'details';

export interface ImageViewModeButtonGroupProps {
  value: ImageViewMode
  onChange: (value: ImageViewMode) => void
}

const SmallToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: 4,
}));

export function ImageViewModeButtonGroup({ value, onChange }: ImageViewModeButtonGroupProps) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(e, v) => v && onChange(v)}
      aria-label="Image view mode"
    >
      <SmallToggleButton value="thumbnails" aria-label="large thumbnails">
        <Icon name="gridView" size={24} />
      </SmallToggleButton>
      <SmallToggleButton value="details" aria-label="details">
        <Icon name="listView" size={24} />
      </SmallToggleButton>
    </ToggleButtonGroup>
  );
}
