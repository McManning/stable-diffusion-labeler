import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Stage } from 'react-konva';
import { useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';

import { useAppSelector } from '@/hooks';
import {
  InteractionMode,
  selectId,
  setIsDrawing,
  setRegions,
  setLabels,
  setInteractionMode,
  selectNodeId,
  createCrop,
} from '@/features/canvas';
import { openContextMenu } from '@/features/settings';

import { Regions } from './Regions';
import { getRelativePointerPosition, newId } from './util';
import { LabelTool } from './LabelTool';
import { useElementSize } from '@/hooks/useElementSize';
import { CropLayer } from './layers/CropLayer';
import { Toolbar } from './Toolbar';
import { ImageLayer } from './layers/ImageLayer';

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;

export function CanvasPanel() {
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
  const selectedNodeId = useAppSelector((s) => s.canvas.selectedNodeId);

  // On change of the loaded image, fill and center on the canvas.
  useEffect(() => {
    if (!stageRef.current) return;

    // Reset stage
    if (imageWidth < 1 || imageHeight < 1) {
      stageRef.current.scale({ x: 1, y: 1 });
      stageRef.current.position({ x: 0, y: 0 });
      return;
    }

    const newScale = Math.min(width / imageWidth, height / imageHeight);

    stageRef.current.scale({ x: newScale, y: newScale });
    stageRef.current.position({
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
  };

  const onClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    checkDeselect(e);

    // Ignore context menu clicks
    if (e.evt.button !== 0) {
      // Left
      return;
    }

    // const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnImage = e.target === imageRef?.current;
    const clickedOnStage = e.target === e.target.getStage();

    const clickedOnId = e.target.id();
    const point = getRelativePointerPosition(e.target.getStage()!);

    if (mode === InteractionMode.Crop) {
      if (clickedOnImage || clickedOnStage) {
        const id = `crop-${newId()}`;
        dispatch(
          createCrop({
            id,
            x: point.x,
            y: point.y,
            width: 768,
            height: 768,
          })
        );

        dispatch(selectNodeId(id));
      }
      return;
    }

    if (!clickedOnImage) {
      return;
    }

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
  };

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

    dispatch(setRegions([...regions.slice(0, regions.length - 1), lastRegion]));
  };

  const onStopDrawing = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) {
      return;
    }

    if (mode !== InteractionMode.Mask) {
      return;
    }

    const lastRegion = regions[regions.length - 1];
    if (lastRegion.points.length < 3) {
      dispatch(setRegions([...regions.slice(0, regions.length - 1)]));
    }

    dispatch(setIsDrawing(false));
  };

  const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // MMD activates stage drag on desktop (transform drags are all left click)
    if (e.evt.button === 1) {
      stageRef.current?.startDrag(e);
    }
  };

  const onMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 1) {
      stageRef.current?.stopDrag(e);
    }
  };

  // Zoom relative to the cursor on mouse scroll (desktop mode)
  const onZoom = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    e.evt.preventDefault();

    const isModifierDown =
      e.evt.getModifierState('Control') || e.evt.getModifierState('Meta');
    if (!isModifierDown) {
      return;
    }

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition()!;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;

    const SCALE_BY = 1.1;
    let newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);

    stage.scaleX(newScale);
    stage.scaleY(newScale);
  };

  return (
    <Box
      ref={ref}
      width="100%"
      height="100%"
      overflow="hidden"
      sx={{ background: '#000' }}
    >
      <Stage
        ref={stageRef}
        className="canvas"
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onWheel={onZoom}
      >
        <ImageLayer ref={imageRef} />
        <CropLayer />
      </Stage>
      <Toolbar />
    </Box>
  );
}
