import React, { useEffect, useRef } from 'react';
import Konva from 'konva';

import { Layer, Rect, Transformer, Label as KonvaLabel, Text } from 'react-konva'
import { useAppSelector } from '@/hooks';
import { InteractionMode, Label, selectId, setLabels } from '@/features/canvas';
import { useDispatch } from 'react-redux';

type Props = {
  label: Label
  isSelected: boolean
  onSelect: (e: Konva.KonvaPointerEvent) => void
  onChange: (label: Label) => void
}

const LabelRect = ({
  label,
  isSelected,
  onSelect,
  onChange
}: Props) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const mode = useAppSelector(s => s.canvas.interaction);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();

      // Make sure the transform tool is always above other layers
      trRef.current.setZIndex(99999);
    }
  }, [isSelected]);

  // Use either the label's text content or a fallback
  const text = label.text ?? `Label ${label.id} - ${label.color}`;

  const enabled = (mode === InteractionMode.Label && !label.isBoxCut)
    || (mode === InteractionMode.BoxCut && label.isBoxCut);

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        x={label.x}
        y={label.y}
        width={label.w}
        height={label.h}
        stroke={label.color}
        fill={label.color}
        opacity={0.75}
        draggable
        // globalCompositeOperation="xor"
        listening={enabled}
        onDragEnd={(e) => {
          onChange({
            ...label,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (!node) return;

          // Grab and unset scale so we can compute
          // a normalized rect
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...label,
            x: node.x(),
            y: node.y(),
            w: Math.max(5, node.width() * scaleX),
            h: Math.max(5, node.height() * scaleY),
          });
        }}
      >
      </Rect>
      <Text
        x={label.x + 5}
        y={label.y + 5}
        width={label.w}
        height={label.h}
        fontFamily="Calibri"
        fontSize={16}
        fill={'#000000'} //TODO: a11y
        opacity={1}
        text={text}
        listening={false}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          keepRatio={label.keepRatio ?? false}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
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
};

export function LabelTool() {
  const dispatch = useDispatch();
  const layerRef = useRef<Konva.Layer>(null);
  const labels = useAppSelector(s => s.canvas.labels);
  const selectedId = useAppSelector(s => s.canvas.selectedId);

  return (
    <Layer ref={layerRef}>
      {labels.map((label, idx) =>
        <LabelRect
          key={idx}
          label={label}
          isSelected={label.id === selectedId}
          onSelect={() => dispatch(selectId(label.id))}
          onChange={(label) => {
            console.log(label);
            const copy = [...labels];
            copy[idx] = label;
            dispatch(setLabels(copy));
          }}
        />
      )}
    </Layer>
  )
}
