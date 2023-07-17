import React, { useRef, useEffect, useState } from "react";
import { Box } from "@mui/material";
import Konva from "konva";
import { Rect, Stage } from "react-konva";
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/hooks';
import { useElementSize } from "@/hooks/useElementSize";
import { DoodleTool, PenSettings, selectId, setIsDrawing, setRegions, setScale } from '@/features/doodle';
import { openContextMenu } from '@/features/settings';

import { ReferenceLayer } from "./layers/ReferenceLayer";
import { getRelativePointerPosition, newId } from './util';
import { Tools } from "./Tools";
import { DrawLayer } from "./layers/DrawLayer";
import { Root } from "./Doodle.styles";
import { Dropzone } from "./Dropzone";
import { BoundaryLayer } from "./layers/BoundaryLayer";
import { GeneratedImages } from "./GeneratedImages";
import { BackgroundLayer } from "./layers/BackgroundLayer";
import { PreprocessorLayer } from "./layers/PreprocessorLayer";
import { GeneratedLayer } from "./layers/GeneratedLayer";

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;

export function DoodlePanel() {
  const stageRef = useRef<Konva.Stage>(null);
  const imageRef = useRef<Konva.Image>(null);
  const drawLayerRef = useRef<Konva.Layer>(null);

  const dispatch = useDispatch();

  const { ref, width, height } = useElementSize<HTMLDivElement>();

  const tool = useAppSelector((s) => s.doodle.tool);
  const toolSettings = useAppSelector((s) => s.doodle.toolSettings);
  const scale = useAppSelector((s) => s.doodle.scale);
  const samplerWidth = useAppSelector((s) => s.generator.sampler.width);
  const samplerHeight = useAppSelector((s) => s.generator.sampler.height);

  useEffect(() => {
    stageRef.current?.scale({ x: 1, y: 1 });
    stageRef.current?.position({
      x: 0.5 * width - (0.5 * samplerWidth),
      y: 0.5 * height - (0.5 * samplerHeight),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageRef, width, height, samplerWidth, samplerHeight]);

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
      toolSettings={toolSettings[tool]}
      scale={scale}
    >
      <Dropzone>
        <Stage
          id="doodle"
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
          <BackgroundLayer />
          <ReferenceLayer ref={imageRef} />
          <GeneratedLayer />
          <PreprocessorLayer />
          <DrawLayer ref={drawLayerRef} />
          <BoundaryLayer />
        </Stage>
        <Tools />
        <GeneratedImages />
      </Dropzone>
    </Root>
  )
}

