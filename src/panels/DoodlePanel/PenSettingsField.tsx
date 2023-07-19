import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks";
import { Box, Slider } from "@mui/material";
import { DoodleTool, PenSettings, setBrightness, setToolSettings } from "@/features/doodle";

export function PenSettingsField() {
  const settings = useAppSelector((s) => s.doodle.toolSettings[DoodleTool.Pen] as PenSettings);

  const dispatch = useDispatch();

  const updateSettings = (partialSettings: Partial<PenSettings>) => {
    dispatch(setToolSettings({
      tool: DoodleTool.Pen,
      partialSettings
    }));
  }

  const onChangeThickness = (event: Event, value: number | number[], activeThumb: number) => {
    updateSettings({
      thickness: value as number
    });
  }

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
