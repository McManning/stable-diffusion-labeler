import { Box, Slider } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks";
import { setBrightness, setGeneratedImageOpacity, setPreprocessedImageOpacity } from "@/features/doodle";

export function ReferenceSettingsField() {

  const settings = useAppSelector((s) => s.doodle.toolSettings);
  const brightness = useAppSelector((s) => s.doodle.brightness);
  const generatedImageOpacity = useAppSelector((s) => s.doodle.generatedImageOpacity);
  const preprocessedImageOpacity = useAppSelector((s) => s.doodle.preprocessedImageOpacity);

  const dispatch = useDispatch();

  const onChangeBrightness = (event: Event, value: number | number[], activeThumb: number) => {
    dispatch(setBrightness(value as number));
  }

  const onChangeGeneratedImageOpacity = (event: Event, value: number | number[], activeThumb: number) => {
    dispatch(setGeneratedImageOpacity(value as number));
  }

  const onChangePreprocessedImageOpacity = (event: Event, value: number | number[], activeThumb: number) => {
    dispatch(setPreprocessedImageOpacity(value as number));
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

      {/* TODO: Move these. I'm just lazily adding it here for now  */}
      <Slider
        orientation="vertical"
        aria-label="Brightness"
        value={generatedImageOpacity}
        onChange={onChangeGeneratedImageOpacity}
        valueLabelDisplay="auto"
        min={0}
        max={1}
        step={0.01}
      />

      <Slider
        orientation="vertical"
        aria-label="Brightness"
        value={preprocessedImageOpacity}
        onChange={onChangePreprocessedImageOpacity}
        valueLabelDisplay="auto"
        min={0}
        max={1}
        step={0.01}
      />
    </Box>
  );
}
