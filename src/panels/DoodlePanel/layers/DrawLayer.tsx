import { forwardRef, useRef, useState } from 'react';
import Konva from 'konva';
import { Circle, Layer, Rect } from 'react-konva';

import {
  DoodleTool,
  EraserSettings,
  PenSettings,
  setIsDrawing,
  setTool,
} from '@/features/doodle';
import { useAppSelector } from '@/hooks';
import { useDispatch } from 'react-redux';
import { useCommandHistory } from '@/hooks/useCommandHistory';
import { DrawCommand, EraseCommand } from '@/utils/commands';
import { getRelativePointerPosition, mergeRefs, newId } from '../util';

const OVERDRAW_SIZE = 512;

export const DrawLayer = forwardRef<Konva.Layer, {}>((_, ref) => {
  const [lastLine, setLastLine] = useState<Konva.Line>();
  const drawLayerRef = useRef<Konva.Layer>(null);

  const tool = useAppSelector((s) => s.doodle.tool);
  const toolSettings = useAppSelector(
    (s) => s.doodle.toolSettings[s.doodle.tool]
  );
  const eraserSettings = useAppSelector(
    (s) => s.doodle.toolSettings[DoodleTool.Eraser]
  );
  const layerSettings = useAppSelector((s) =>
    s.doodle.layers.find((l) => l.id === 'Draw')
  );
  const isDrawing = useAppSelector((s) => s.doodle.isDrawing);
  const width = useAppSelector((s) => s.generator.sampler.width);
  const height = useAppSelector((s) => s.generator.sampler.height);

  const [prevTool, setPrevTool] = useState<DoodleTool>();

  const { push } = useCommandHistory();

  const dispatch = useDispatch();

  const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Ignore middle click panning
    if (e.evt.button === 1) {
      return;
    }

    // Temporarily activate the eraser on right click
    if (e.evt.button === 2) {
      setPrevTool(tool);
      dispatch(setTool(DoodleTool.Eraser));
    }

    const point = getRelativePointerPosition(
      e.target.getStage() as Konva.Stage
    );

    // if (tool === DoodleTool.Mask) {
    //   dispatch(setIsDrawing(true));

    //   const region: Region = {
    //     id: newId(),
    //     color: '#000000',
    //     points: [point],
    //   };

    //   dispatch(setRegions([...regions, region]));
    //   return;
    // }

    const isEraser = tool === DoodleTool.Eraser || e.evt.button === 2;

    let strokeWidth = 0;
    if (isEraser) {
      strokeWidth = (eraserSettings as EraserSettings).thickness;
    } else {
      strokeWidth = (toolSettings as PenSettings).thickness;
    }

    if (tool === DoodleTool.Pen || isEraser) {
      dispatch(setIsDrawing(true));

      setLastLine(() => {
        if (!drawLayerRef.current) {
          throw new Error('Missing Draw Layer');
        }

        const line = new Konva.Line({
          stroke: '#ffffff',
          strokeWidth,
          tension: 0.5, // ??
          globalCompositeOperation: isEraser
            ? 'destination-out'
            : 'source-over',
          lineCap: 'round',
          lineJoin: 'round',
          points: [point.x, point.y, point.x, point.y],
          shadowForStrokeEnabled: false,
        });

        if (isEraser) {
          push(new EraseCommand(drawLayerRef.current, line));
        } else {
          push(new DrawCommand(drawLayerRef.current, line));
        }

        return line;
      });
    }
  };

  const onDrag = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing) {
      return;
    }

    // Disable scrolling on touch devices
    e.evt.preventDefault();

    const point = getRelativePointerPosition(
      e.target.getStage() as Konva.Stage
    );

    // if (tool === DoodleTool.Mask) {
    //   const lastRegion = { ...regions[regions.length - 1] };
    //   lastRegion.points = [...lastRegion.points, point];

    //   dispatch(setRegions([
    //     ...regions.slice(0, regions.length - 1),
    //     lastRegion
    //   ]));
    // }

    if ((tool === DoodleTool.Pen || tool === DoodleTool.Eraser) && lastLine) {
      const newPoints = lastLine.points().concat([point.x, point.y]);
      lastLine.points(newPoints);
    }
  };

  const onStopDrawing = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    // If we were using a temp tool, switch back to the previous
    if (prevTool) {
      dispatch(setTool(prevTool));
      setPrevTool(undefined);
    }

    if (!isDrawing) {
      return;
    }

    // if (tool === DoodleTool.Mask) {
    //   const lastRegion = regions[regions.length - 1];
    //   if (lastRegion.points.length < 3) {
    //     dispatch(setRegions([
    //       ...regions.slice(0, regions.length - 1),
    //     ]));
    //   }
    // }

    if (tool === DoodleTool.Pen) {
    }

    dispatch(setIsDrawing(false));
  };

  // Only listen for events while using draw tools.
  // This'll let other layers (e.g. references) be manipulated when
  // we're in the appropriate tool mode for that.
  const listening = tool === DoodleTool.Pen || tool === DoodleTool.Eraser;

  // Rect is used for receiving mouse events for the draw tool while active.
  return (
    <Layer
      id="draw"
      ref={mergeRefs(ref, drawLayerRef)}
      listening={listening}
      onMouseDown={onMouseDown}
      onMouseMove={onDrag}
      onMouseUp={onStopDrawing}
      onMouseLeave={onStopDrawing}
      onTouchMove={onDrag}
      onTouchEnd={onStopDrawing}
      visible={layerSettings?.visible}
      opacity={layerSettings?.opacity}
    >
      <Rect
        x={-OVERDRAW_SIZE}
        y={-OVERDRAW_SIZE}
        width={width + OVERDRAW_SIZE * 2}
        height={height + OVERDRAW_SIZE * 2}
      />
    </Layer>
  );
});
