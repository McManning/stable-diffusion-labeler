import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/hooks';
import { Box, Slider } from '@mui/material';
import {
  DoodleTool,
  EraserSettings,
  PenSettings,
  setBrightness,
  setToolSettings,
} from '@/features/doodle';

export function EraserSettingsField() {
  const settings = useAppSelector(
    (s) => s.doodle.toolSettings[DoodleTool.Eraser] as EraserSettings
  );

  const dispatch = useDispatch();

  const updateSettings = (partialSettings: Partial<EraserSettings>) => {
    dispatch(
      setToolSettings({
        tool: DoodleTool.Eraser,
        partialSettings,
      })
    );
  };

  const onChangeThickness = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    updateSettings({
      thickness: value as number,
    });
  };

  return (
    <Box mt={1}>
      <Slider
        orientation="vertical"
        aria-label="Thickness"
        value={settings.thickness}
        onChange={onChangeThickness}
        valueLabelDisplay="auto"
        min={1}
        max={128}
      />
    </Box>
  );
}
