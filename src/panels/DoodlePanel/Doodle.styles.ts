import {
  DoodleTool,
  PenSettings,
  ToolSettings,
  doodle,
} from '@/features/doodle';
import { Box, BoxProps, styled } from '@mui/material';

export interface RootProps {
  tool: DoodleTool;
  toolSettings: ToolSettings;
  scale: number;
}

// TODO: Optimize. This gets executed every mouse down
function makePenCursor(strokeWidth: number, scale: number) {
  const size = strokeWidth * scale;
  const xpad = 0; // strokeWidth * 0.5;

  // the X is correct, the circle is not.

  // const template = `
  //   <svg xmlns="http://www.w3.org/2000/svg" height="${strokeWidth * 2}" width="${strokeWidth * 2}">
  //     <circle cx="${size * 0.5}" cy="${size * 0.5}" r="100%" stroke="red" stroke-width="1" fill="green" />
  //     <line x1="${size - xpad}" y1="${size - xpad}" x2="${xpad}" y2="${xpad}" stroke="red" />
  //     <line x1="${xpad}" y1="${size - xpad}" x2="${size - xpad}" y2="${xpad}" stroke="red" />
  //   </svg>
  // `;

  const template = `
    <svg xmlns="http://www.w3.org/2000/svg" height="${size}" width="${size}">
      <line x1="${size / 2}" y1="${0}" x2="${
    size / 2
  }" y2="${size}" stroke="white" />
      <line x1="${0}" y1="${size / 2}" x2="${size}" y2="${
    size / 2
  }" stroke="white" />
    </svg>
  `;

  // <line x1="12" y1="12" x2="20" y2="20" stroke="white" />
  // <line x1="20" y1="12" x2="12" y2="20" stroke="white" />

  const encoded = template
    .replaceAll('<', '%3C')
    .replaceAll('>', '%3E')
    .replaceAll('"', "'")
    .replaceAll('\n', '')
    .trim();

  console.log(encoded);

  return `url("data:image/svg+xml,${encoded}") ${size * 0.5} ${
    size * 0.5
  }, crosshair;`;
}

function computeCursor({ tool, toolSettings, scale }: RootProps) {
  if (tool === DoodleTool.References || tool === DoodleTool.Pan) {
    return 'grab';
  }

  if (tool === DoodleTool.Pen || tool === DoodleTool.Eraser) {
    return makePenCursor((toolSettings as PenSettings).thickness, scale);
  }

  return 'initial';
}

// grab, grabbing, zoom-in, crosshair, move,

export const Root = styled(Box)<RootProps>((props) => ({
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  position: 'relative',
  background: '#000000',

  cursor: computeCursor(props),
}));
