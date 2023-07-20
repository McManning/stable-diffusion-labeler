
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

const Root = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  padding: 8,
}));


export function Tools() {
  const tool = useAppSelector((s) => s.doodle.tool);
  const { undo, redo } = useCommandHistory();

  const dispatch = useDispatch();

  // Global hotkey binds
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
    // ['X', () => {
    //   if (mode === InteractionMode.Mask) {
    //     clearMask();
    //   } else {
    //     removeSelected();
    //   }
    // }],
  ]);

  const onActivateTool = (e: React.MouseEvent<any>, newTool: DoodleTool | null) => {
    if (!newTool) {
      return;
    }

    dispatch(setTool(newTool));
  }

  return (
    <>
    <Root direction="row" gap={2}>
      <ToggleButtonGroup
        value={tool}
        exclusive
        onChange={onActivateTool}
        orientation="vertical"
        sx={{ background: '#000'}}>
        <ToolButton value={DoodleTool.Pen} icon="pen" />
        <ToolButton value={DoodleTool.Eraser} icon="eraser" />
        <ToolButton value={DoodleTool.Pan} icon="pan" />
        <ToolButton value={DoodleTool.References} icon="images" />
      </ToggleButtonGroup>
      <ToolSettings />
    </Root>

    <Stack
      direction="row"
      position="absolute"
      right={8}
      top={8}
      gap={1}
    >
      <LayersField />
      <ClearDoodleButton />
      <ZoomField />
    </Stack>
    </>
  )
}
