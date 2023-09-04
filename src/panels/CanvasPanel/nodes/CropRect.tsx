import { useRef, useEffect, useState, useMemo } from 'react';
import {
  InteractionMode,
  deleteCrop,
  selectNodeId,
  updateCrop,
} from '@/features/canvas';
import { useAppSelector } from '@/hooks';
import Konva from 'konva';
import { Transformer, Rect, Text } from 'react-konva';
import { useDispatch } from 'react-redux';
import { useHotkeys } from '@mantine/hooks';
import { Button } from '@osuresearch/ui';
import { openContextMenu } from '@/features/settings';
import { Divider } from '@mui/material';

export type CropRectProps = {
  crop: Crop;
  isSelected: boolean;
  isDragging: boolean;
};

export function CropRect({ crop, isSelected, isDragging }: CropRectProps) {
  const dispatch = useDispatch();
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!trRef.current || !shapeRef.current) return;

    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();

      // Make sure the transform tool is always above other layers
      trRef.current.setZIndex(99999);
    }
  }, [isSelected]);

  const onClick = () => {
    dispatch(selectNodeId(crop.id));
  };

  const onChange = (newState: Crop) => {
    dispatch(updateCrop(newState));
  };

  const onDelete = () => {
    dispatch(deleteCrop(crop));
  };

  useHotkeys([
    [
      'Delete',
      () => {
        if (isSelected) {
          onDelete();
        }
      },
    ],
  ]);

  const lockToSquare = (size: number) => {
    dispatch(
      updateCrop({
        ...crop,
        width: size,
        height: size,
        fixedSize: true,
      })
    );
  };

  const update = (state: Partial<Crop>) => {
    dispatch(
      updateCrop({
        ...crop,
        ...state,
      })
    );
  };

  const onContextMenu = (e: Konva.KonvaPointerEvent) => {
    dispatch(
      openContextMenu({
        position: { x: e.evt.pageX, y: e.evt.pageY },
        context: 'Edit Crop',
        options: [
          {
            label: 'Free resize',
            action: () => update({ fixedSize: false }),
            icon: !crop.fixedSize ? 'check' : 'blank',
          },
          {
            label: 'Lock to 512x512',
            action: () => lockToSquare(512),
            icon: crop.fixedSize && crop.height === 512 ? 'check' : 'blank',
          },
          {
            label: 'Lock to 768x768',
            action: () => lockToSquare(768),
            icon: crop.fixedSize && crop.height === 768 ? 'check' : 'blank',
          },
          {
            label: 'Lock to 1024x1024',
            action: () => lockToSquare(1024),
            icon: crop.fixedSize && crop.height === 1024 ? 'check' : 'blank',
          },
          'divider',
          { label: 'Delete', action: onDelete, accelerator: 'Delete' },
        ],
      })
    );
  };

  return (
    <>
      <Rect
        onClick={onClick}
        onTap={onClick}
        ref={shapeRef}
        x={crop.x}
        y={crop.y}
        width={crop.width}
        height={crop.height}
        stroke="#ff0000"
        fill="#11000066"
        draggable
        listening
        onContextMenu={onContextMenu}
        onDragMove={(e) => {
          onChange({
            ...crop,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={() => {
          const node = shapeRef.current;
          if (!node) return;

          // Grab and unset scale so we can compute
          // a normalized rect
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...crop,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      <Text
        x={crop.x + 5}
        y={crop.y + 5}
        width={crop.width}
        height={crop.height}
        fontFamily="Calibri"
        fontSize={16}
        fill="#fff"
        opacity={1}
        text={`${Math.round(crop.width)} x ${Math.round(crop.height)}`}
        listening={false}
      />
      <Text
        x={crop.x + 5}
        y={crop.y + 24}
        width={crop.width}
        height={crop.height}
        fontFamily="Calibri"
        fontSize={14}
        fill="#ddd"
        opacity={1}
        text={crop.id}
        listening={false}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          resizeEnabled={!crop.fixedSize}
          keepRatio={false}
          ignoreStroke
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
