import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks";
import { Box, Slider } from "@mui/material";
import { DoodleTool, PenSettings, setBrightness, setToolSettings } from "@/features/doodle";
import { PenSettingsField } from "./PenSettingsField";
import { EraserSettingsField } from "./EraserSettingsField";

export function ToolSettings() {
  const tool = useAppSelector((s) => s.doodle.tool);

  if (tool === DoodleTool.Pen) {
    return <PenSettingsField />;
  }

  if (tool === DoodleTool.Eraser) {
    return <EraserSettingsField />;
  }

  return null;
}
