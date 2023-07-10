import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Stage } from 'react-konva';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { useAppSelector } from '@/hooks';
import { InteractionMode, selectId, setIsDrawing, setRegions, setLabels } from '@/features/canvas';
import { openContextMenu } from '@/features/settings';

import { BaseImage } from './BaseImage';
import { Regions } from './Regions';
import { getRelativePointerPosition, newId } from './util';
import { LabelTool } from './LabelTool';
import { useElementSize } from '@/hooks/useElementSize';

export function Canvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const imageRef = useRef<Konva.Image>(null);

  const dispatch = useDispatch();

  const { ref, width, height } = useElementSize<HTMLDivElement>();

  const { imageWidth, imageHeight } = useAppSelector((s) => ({
    imageWidth: s.canvas.imageWidth,
    imageHeight: s.canvas.imageHeight,
  }));

  const regions = useAppSelector((s) => s.canvas.regions);
  const mode = useAppSelector((s) => s.canvas.interaction);
  const isDrawing = useAppSelector((s) => s.canvas.isDrawing);
  const scale = useAppSelector((s) => s.canvas.scale);
  const labels = useAppSelector((s) => s.canvas.labels);
  const image = useAppSelector((s) => s.canvas.current);

  // We only ever interact with a single Konva stage.
  // This is exposed as a global for some components that
  // can't operate in a React way.
  window.ActiveKonvaStage = stageRef.current;

  // On change of the loaded image, fill and center on the canvas.
  useEffect(() => {
    const newScale = Math.min(width / imageWidth, height / imageHeight);

    stageRef.current?.scale({ x: newScale, y: newScale });
    stageRef.current?.position({
      x: 0.5 * width - newScale * imageWidth * 0.5,
      y: 0.5 * height - newScale * imageHeight * 0.5,
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, imageWidth, imageHeight, stageRef]);

  const checkDeselect = (e: Konva.KonvaEventObject<any>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnImage = e.target === imageRef?.current;
    if (clickedOnEmpty || clickedOnImage) {
      dispatch(selectId(undefined));
    }
  }

  // Zoom relative to the cursor
  // Ref: https://konvajs.org/docs/sandbox/Zooming_Relative_To_Pointer.html
  const onZoom = (e: Konva.KonvaEventObject<any>) => {
    const stage = stageRef.current;
    if (!stage) return;

    e.evt.preventDefault();

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition() as Konva.Vector2d;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? -1 : 1;
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const SCALE_BY = 1.1;
    const newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
  }

  const onClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    checkDeselect(e);

    // Ignore context menu clicks
    if (e.evt.button !== 0) { // Left
      return;
    }

    // const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnImage = e.target === imageRef?.current;
    if (!clickedOnImage) {
      return;
    }

    const point = getRelativePointerPosition(
      e.target.getStage() as Konva.Stage
    );

    if (mode === InteractionMode.Mask) {
      dispatch(setIsDrawing(true));

      const region: Region = {
        id: newId(),
        color: '#000000',
        points: [point],
      };

      dispatch(setRegions([...regions, region]));
      return;
    }

    if (mode === InteractionMode.Label) {
      const label: Label = {
        id: newId(),
        color: Konva.Util.getRandomColor(),
        x: point.x,
        y: point.y,
        w: 200,
        h: 200,
      };

      dispatch(setLabels([...labels, label]));
      return;
    }

    if (mode === InteractionMode.BoxCut) {
      const label: Label = {
        id: newId(),
        color: '#000000',
        keepRatio: true,
        isBoxCut: true,
        x: point.x,
        y: point.y,
        w: 200,
        h: 200,
      };

      dispatch(setLabels([...labels, label]));
    }
  }

  const onDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) {
      return;
    }

    if (mode !== InteractionMode.Mask) {
      return;
    }

    const lastRegion = { ...regions[regions.length - 1] };
    const point = getRelativePointerPosition(
      e.target.getStage() as Konva.Stage
    );

    lastRegion.points = [...lastRegion.points, point];

    dispatch(setRegions([
      ...regions.slice(0, regions.length - 1),
      lastRegion
    ]));
  }

  const onStopDrawing = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) {
      return;
    }

    if (mode !== InteractionMode.Mask) {
      return;
    }

    const lastRegion = regions[regions.length - 1];
    if (lastRegion.points.length < 3) {
      dispatch(setRegions([
        ...regions.slice(0, regions.length - 1),
      ]));
    }

    dispatch(setIsDrawing(false));
  }

  const onContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    dispatch(openContextMenu({
      context: 'canvas',
      position: {
        x: e.evt.clientX,
        y: e.evt.clientY
      }
    }));
  }

  return (
    <Box ref={ref} width="100%" height="100%" overflow="hidden" sx={{ background: '#000' }}>
      <Stage
        ref={stageRef}
        className="canvas"
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        draggable={mode === InteractionMode.Pan}
        onTouchStart={checkDeselect}
        onWheel={onZoom}
        onMouseDown={onClick}
        onMouseMove={onDrag}
        onMouseUp={onStopDrawing}
        onContextMenu={onContextMenu}
      >
        <BaseImage ref={imageRef} />
        <Regions />
        <LabelTool />
      </Stage>
    </Box>
  )
}

