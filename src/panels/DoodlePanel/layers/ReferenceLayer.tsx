import { forwardRef, useRef, useLayoutEffect, useEffect, useState } from "react";
import Konva from "konva";
import { Layer, Image, Rect, Transformer, Text } from "react-konva";
import useImage from "use-image";
import { useAppSelector } from '@/hooks';
import { useDispatch } from 'react-redux';
import { KonvaEventObject } from "konva/lib/Node";
import { DoodleTool, setReferences, selectId } from "@/features/doodle";
import { Reference } from "../Reference";

interface RectangleProps {
  shapeProps: any
  onChange: (props: any) => void
  isSelected: boolean
  onSelect: (evt: KonvaEventObject<Event>) => void
}

const MINIMUM_RECT_SIZE = 5;

function Rectangle({ shapeProps, isSelected, onSelect, onChange }: RectangleProps) {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const tool = useAppSelector((s) => s.doodle.tool);

  // Transformer needs to be attached manually outside of React
  // Ref: https://konvajs.org/docs/react/Transformer.html
  useEffect(() => {
    if (isSelected && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const showTransformer = isSelected && tool === DoodleTool.References;

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={tool === DoodleTool.References}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (!node) {
            return;
          }

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(MINIMUM_RECT_SIZE, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {showTransformer && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < MINIMUM_RECT_SIZE || newBox.height < MINIMUM_RECT_SIZE) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}

/**
 * Layer containing all reference images and ways to interact with those images
 * (dragging, scaling, etc)
 */
export const ReferenceLayer = forwardRef<Konva.Image, {}>((_, ref) => {
  const layerRef = useRef<Konva.Layer>(null);

  const selectedId = useAppSelector((s) => s.doodle.selectedId);
  const brightness = useAppSelector((s) => s.doodle.brightness);
  const references = useAppSelector((s) => s.doodle.references);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    const canvas = layerRef.current.getCanvas()._canvas;
    canvas.style.filter = `brightness(${(brightness ) * 100}%)`;
  }, [brightness]);

  return (
    <Layer id="reference" ref={layerRef}>
      {references.map((r, i) => (
        <Reference
          key={r.id}
          reference={r}
          isSelected={r.id === selectedId}
          onSelect={() => {
            dispatch(selectId(r.id));

            // Bring to front
            const refs = references.slice();
            const index = refs.findIndex((x) => x.id === r.id);

            refs.splice(index, 1);
            refs.push(r);
            dispatch(setReferences(refs));
          }}
          onChange={(newAttrs) => {
            const refs = references.slice();
            refs[i] = newAttrs;
            dispatch(setReferences(refs));
          }}
        />
      ))}
      {/* <Text x={0} y={0} text={selectedId ?? 'Not selected'} fill="red" /> */}
    </Layer>
  );
});
