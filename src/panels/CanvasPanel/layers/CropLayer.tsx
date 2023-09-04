import { Layer, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/hooks';
import {
  InteractionMode,
  createCrop,
  deleteCrop,
  selectNodeId,
  updateCrop,
} from '@/features/canvas';
import { CropRect } from '../nodes/CropRect';
import { getRelativePointerPosition, newId } from '../util';
import { useState } from 'react';

const OVERDRAW = 500;

export function CropLayer() {
  const dispatch = useDispatch();
  const crops = useAppSelector((s) => s.canvas.crops);
  const selectedId = useAppSelector((s) => s.canvas.selectedNodeId);
  const mode = useAppSelector((s) => s.canvas.interaction);
  const width = useAppSelector((s) => s.canvas.imageWidth);
  const height = useAppSelector((s) => s.canvas.imageHeight);

  const [draggingId, setDraggingId] = useState<string>();
  const [dragStart, setDragStart] = useState<Point>();

  const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnTarget = e.target.id() === 'crop-target';
    const clickedOnStage = e.target === e.target.getStage();
    const point = getRelativePointerPosition(e.target.getStage()!);

    if (e.evt.button !== 0) return;

    if (clickedOnTarget || clickedOnStage) {
      const crop = {
        id: `crop-${newId()}`,
        x: point.x,
        y: point.y,
        width: 1,
        height: 1,
      };

      dispatch(createCrop(crop));
      dispatch(selectNodeId(crop.id));

      // Drag on create
      setDraggingId(crop.id);
      setDragStart(point);
    }
  };

  const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!draggingId || !dragStart) return;

    const crop = crops.find((c) => c.id === draggingId);
    if (!crop) return;

    const point = getRelativePointerPosition(e.target.getStage()!);

    dispatch(
      updateCrop({
        ...crop,
        x: Math.min(dragStart.x, point.x),
        y: Math.min(dragStart.y, point.y),
        width: Math.abs(dragStart.x - point.x),
        height: Math.abs(dragStart.y - point.y),
      })
    );
  };

  const onMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return;

    if (draggingId) {
      // Delete small regions (e.g. accidental clicks)
      const crop = crops.find((c) => c.id === draggingId);
      if (crop && (crop?.width < 10 || crop?.height < 10)) {
        dispatch(deleteCrop(crop));
      }

      setDraggingId(undefined);
    }
  };

  return (
    <Layer
      id="cropping"
      visible={mode === InteractionMode.Crop}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      listening
    >
      {/* Capture rect for events  */}
      <Rect
        id="crop-target"
        x={-OVERDRAW}
        y={-OVERDRAW}
        width={width + OVERDRAW * 2}
        height={height + OVERDRAW * 2}
      />
      {crops.map((crop) => (
        <CropRect
          key={crop.id}
          crop={crop}
          isSelected={crop.id === selectedId}
          isDragging={crop.id === crop?.id}
        />
      ))}
    </Layer>
  );
}

CropLayer.displayName = 'CroppingLayer';
