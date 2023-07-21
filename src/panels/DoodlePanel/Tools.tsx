import React from 'react';
import { useHotkeys } from '@mantine/hooks';
import { useAppSelector } from '@/hooks';
import { useDispatch } from 'react-redux';
import { Box, Stack, ToggleButtonGroup, styled } from '@mui/material';

import { DoodleTool, setTool } from '@/features/doodle';
import { ToolButton } from './ToolButton';
import { ToolSettings } from './ToolSettings';
import { ZoomField } from './ZoomField';
import { ClearDoodleButton } from './ClearDoodleButton';
import { LayersField } from './LayersField';
import { useCommandHistory } from '@/hooks/useCommandHistory';
import { RemoveReferenceCommand } from '@/utils/commands';
import { useDoodleStage } from '@/hooks/useDoodleStage';

const Root = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  padding: 8,
}));

export function Tools() {
  const tool = useAppSelector((s) => s.doodle.tool);
  const selectedId = useAppSelector((s) => s.doodle.selectedId);
  const references = useAppSelector((s) => s.doodle.references);
  const layers = useAppSelector((s) => s.doodle.layers);
  const { getKonvaLayerById } = useDoodleStage();

  const { undo, redo, push } = useCommandHistory();

  const dispatch = useDispatch();

  /**
   * Delete selected reference
   */
  const onDelete = () => {
    const selected = references.find((r) => r.id === selectedId);

    if (selected) {
      push(new RemoveReferenceCommand(selected));
    }
  };

  // Global hotkey binds
  // TODO: Move this elsewhere?
  useHotkeys([
    ['S', () => dispatch(setTool(DoodleTool.Pan))],
    ['D', () => dispatch(setTool(DoodleTool.Pen))],
    ['E', () => dispatch(setTool(DoodleTool.Eraser))],
    ['R', () => dispatch(setTool(DoodleTool.References))],
    ['V', () => dispatch(setTool(DoodleTool.BoxCut))],
    ['mod + E', () => dispatch(setTool(DoodleTool.Eraser))],

    ['mod + Z', () => undo()],
    ['mod + shift + Z', () => redo()],
    ['mod + Y', () => redo()],

    ['Backspace', onDelete],
    ['Delete', onDelete],
  ]);

  const onActivateTool = (
    e: React.MouseEvent<any>,
    newTool: DoodleTool | null
  ) => {
    if (!newTool) {
      return;
    }

    dispatch(setTool(newTool));
  };

  return (
    <>
      <Root direction="row" gap={2}>
        <ToggleButtonGroup
          value={tool}
          exclusive
          onChange={onActivateTool}
          orientation="vertical"
          sx={{ background: '#000' }}
        >
          <ToolButton value={DoodleTool.Pen} icon="pen" />
          <ToolButton value={DoodleTool.Eraser} icon="eraser" />
          <ToolButton value={DoodleTool.Pan} icon="pan" />
          <ToolButton value={DoodleTool.References} icon="images" />
        </ToggleButtonGroup>
        <ToolSettings />
      </Root>

      <Stack direction="row" position="absolute" right={8} top={8} gap={1}>
        <LayersField />
        <ClearDoodleButton />
        <ZoomField />
      </Stack>
    </>
  );
}
