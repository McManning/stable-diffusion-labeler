import { useAppSelector } from '@/hooks';
import { PenSettingsField } from './PenSettingsField';
import { EraserSettingsField } from './EraserSettingsField';
import { DoodleTool } from '@/features/doodle';

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
