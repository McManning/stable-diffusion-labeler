import React, { useRef, useEffect, useState } from "react";
import { Box } from "@mui/material";
import Konva from "konva";
import { Stage } from "react-konva";
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/hooks';
import { useElementSize } from "@/hooks/useElementSize";
import { DoodleTool, selectId, setIsDrawing, setRegions, setScale } from '@/features/doodle';
import { openContextMenu } from '@/features/settings';

import { ReferenceLayer } from "./ReferenceLayer";
import { getRelativePointerPosition, newId } from './util';
import { Tools } from "./Tools";
import { DrawLayer } from "./DrawLayer";
import { Root } from "./Doodle.styles";
import { Dropzone } from "./Dropzone";
import { BoundaryLayer } from "./BoundaryLayer";

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;

export function Doodle() {
  const stageRef = useRef<Konva.Stage>(null);
  const imageRef = useRef<Konva.Image>(null);
  const drawLayerRef = useRef<Konva.Layer>(null);
  const [lastLine, setLastLine] = useState<Konva.Line>();

  const [isMMDDragging, setMMDDrag] = useState(false);

  const dispatch = useDispatch();

  const { ref, width, height } = useElementSize<HTMLDivElement>();

  const { imageWidth, imageHeight } = useAppSelector((s) => ({
    imageWidth: s.doodle.imageWidth,
    imageHeight: s.doodle.imageHeight,
  }));

  const regions = useAppSelector((s) => s.doodle.regions);
  const tool = useAppSelector((s) => s.doodle.tool);
  const strokeWidth = useAppSelector((s) => s.doodle.thickness);
  const isDrawing = useAppSelector((s) => s.doodle.isDrawing);
  const scale = useAppSelector((s) => s.doodle.scale);
  const image = useAppSelector((s) => s.doodle.current);

  // On change of the loaded image, fill and center on the canvas.
  // useEffect(() => {
  //   const newScale = Math.min(width / imageWidth, height / imageHeight);

  //   stageRef.current?.scale({ x: newScale, y: newScale });
  //   stageRef.current?.position({
  //     x: 0.5 * width - newScale * imageWidth * 0.5,
  //     y: 0.5 * height - newScale * imageHeight * 0.5,
  //   });

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [image, imageWidth, imageHeight, stageRef]);

  useEffect(() => {
    stageRef.current?.scale({ x: 1, y: 1 });
    stageRef.current?.position({
      x: 0.5 * width - (0.5 * 512),
      y: 0.5 * height - (0.5 * 512),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageRef, width, height]);

  useEffect(() => {
    // Global control over drag buttons for konva.
    // MMD while drawing, MMD or left button while manipulating shapes.
    // TODO: I hate this. Find a better method.
    if (tool === DoodleTool.Eraser || tool === DoodleTool.Pen) {
      Konva.dragButtons = [1];
    } else {
      Konva.dragButtons = [0, 1];
    }
  }, [tool]);

  const checkDeselect = (e: Konva.KonvaEventObject<any>) => {
    // deselect when clicked on empty canvas zone
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      dispatch(selectId(undefined));
    }
  }

  // Zoom relative to the cursor on mouse scroll (desktop mode)
  const onZoom = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    e.evt.preventDefault();

    const isModifierDown = e.evt.getModifierState('Control') || e.evt.getModifierState('Meta');
    if (!isModifierDown) {
      return;
    }

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition() as Konva.Vector2d;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;

    const SCALE_BY = 1.1;
    let newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);

    dispatch(setScale(newScale));
  }

  const onContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();

    const clickedOnEmpty = e.target === stage;
    if (clickedOnEmpty || !stage) {
      return;
    }

    const shape = e.target;
    const container = stage.container().getBoundingClientRect();
    const top = container.top + (stage.getPointerPosition()?.y ?? 0);
    const left = container.left + (stage.getPointerPosition()?.x ?? 0);

    // insert.
    // Ooorrr just e.evt.clientX/Y...

    dispatch(openContextMenu({
      context: 'canvas',
      position: {
        x: e.evt.clientX,
        y: e.evt.clientY
      }
    }));
  }

  return (
    <Root ref={ref}
      tool={tool}
      strokeWidth={strokeWidth}
      scale={scale}
    >
      <Dropzone>
        <Stage
          ref={stageRef}
          className="canvas"
          width={width}
          height={height}
          scaleX={scale}
          scaleY={scale}
          draggable

          // These events need to be on the stage to detect
          // whether we clicked the stage or an object on it.
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}

          onWheel={onZoom}


          onContextMenu={onContextMenu}
        >
          <ReferenceLayer ref={imageRef} />
          <DrawLayer ref={drawLayerRef} />
          <BoundaryLayer />
        </Stage>
        <Tools />
      </Dropzone>
    </Root>
  )
}

