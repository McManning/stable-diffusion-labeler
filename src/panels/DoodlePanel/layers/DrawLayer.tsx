import { forwardRef, useRef, useState } from "react";
import Konva from "konva";
import { Circle, Layer, Rect } from "react-konva";
import { getRelativePointerPosition, mergeRefs, newId } from "../util";
import { DoodleTool, PenSettings, setIsDrawing } from "@/features/doodle";
import { useAppSelector } from "@/hooks";
import { useDispatch } from "react-redux";

const OVERDRAW_SIZE = 512;

export const DrawLayer = forwardRef<Konva.Layer, {}>((_, ref) => {
  const [lastLine, setLastLine] = useState<Konva.Line>();
  const drawLayerRef = useRef<Konva.Layer>(null);

  const tool = useAppSelector((s) => s.doodle.tool);
  const toolSettings = useAppSelector((s) => s.doodle.toolSettings[s.doodle.tool]);
  const layerSettings = useAppSelector((s) => s.doodle.layers.find((l) => l.id === 'Draw'));
  const isDrawing = useAppSelector((s) => s.doodle.isDrawing);
  const width = useAppSelector((s) => s.generator.sampler.width);
  const height = useAppSelector((s) => s.generator.sampler.height);

  const dispatch = useDispatch();

  let strokeWidth = 0;
  if ((toolSettings as PenSettings).thickness) {
    strokeWidth = (toolSettings as PenSettings).thickness;
  }

  const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Ignore context menu clicks
    if (e.evt.button !== 0) { // Left
      return;
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

    if (tool === DoodleTool.Pen || tool === DoodleTool.Eraser) {
      dispatch(setIsDrawing(true));

      setLastLine(() => {
        const line = new Konva.Line({
          stroke: '#ffffff',
          strokeWidth,
          tension: 0.5, // ??
          globalCompositeOperation:
            tool === DoodleTool.Eraser ? 'destination-out' : 'source-over',
          lineCap: 'round',
          lineJoin: 'round',
          points: [point.x, point.y, point.x, point.y],
          shadowForStrokeEnabled: false,
        });

        drawLayerRef.current?.add(line);
        return line;
      });
    }
  }

  const onDrag = (e: Konva.KonvaEventObject<MouseEvent|TouchEvent>) => {
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
  }

  const onStopDrawing = (e: Konva.KonvaEventObject<MouseEvent|TouchEvent>) => {
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
  }

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

