import { Box, Slider } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks";
import { setBrightness } from "@/features/doodle";

export function ReferenceSettingsField() {

  const settings = useAppSelector((s) => s.doodle.toolSettings);
  const brightness = useAppSelector((s) => s.doodle.brightness);
  const scale = useAppSelector((s) => s.doodle.scale);

  const dispatch = useDispatch();

  const onChangeBrightness = (event: Event, value: number | number[], activeThumb: number) => {
    dispatch(setBrightness(value as number));
  }

  return (
    <Box mt={1}>
      <Slider
        orientation="vertical"
        aria-label="Brightness"
        value={brightness}
        onChange={onChangeBrightness}
        valueLabelDisplay="auto"
        // valueLabelFormat={(value) => `Brightness: ${value}`}
        min={0}
        max={1}
        step={0.01}
      />
    </Box>
  );
}
