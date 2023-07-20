import { forwardRef, useRef, useLayoutEffect, useEffect, useState } from "react";
import Konva from "konva";
import { Layer, Image, Text, Transformer } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import useImage from "use-image";

import { useAppSelector } from '@/hooks';
import { DoodleTool, ImageReference } from "@/features/doodle";
import { useCommandHistory } from "@/hooks/useCommandHistory";
import { TransformCommand } from "@/utils/commands";
import { getTransform } from "@/utils";

export interface ReferenceProps {
  reference: ImageReference
  onChange: (props: any) => void
  isSelected: boolean
  onSelect: (evt: KonvaEventObject<Event>) => void
}

const MINIMUM_RECT_SIZE = 5;

/**
 * Reference image rendered onto the canvas.
 *
 * References can be TRS transformed around the canvas
 */
export function Reference({ reference, isSelected, onSelect, onChange }: ReferenceProps) {
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [image] = useImage(reference.dataUri);
  const { push } = useCommandHistory();

  const tool = useAppSelector((s) => s.doodle.tool);

  // Transformer needs to be attached manually outside of React
  // Ref: https://konvajs.org/docs/react/Transformer.html
  useEffect(() => {
    if (isSelected && imageRef.current && trRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const showTransformer = isSelected && tool === DoodleTool.References;

  const [from, setFrom] = useState<Transform>();

  return (
    <>
      <Image
        image={image}
        onClick={onSelect}
        onTap={onSelect}
        ref={imageRef}
        draggable={showTransformer}
        // {...reference}

        onDragStart={() => {
          const node = imageRef.current;
          if (!node) {
            return;
          }

          setFrom(getTransform(node));
        }}
        onDragEnd={(e) => {
          const node = imageRef.current;
          if (!node || !from) return;

          const to = getTransform(node);
          push(new TransformCommand(node, from, to));

          // onChange({
          //   ...reference,
          //   x: e.target.x(),
          //   y: e.target.y(),
          // });
        }}
        onTransformStart={() => {
          const node = imageRef.current;
          if (!node) return;

          setFrom(getTransform(node));
        }}
        onTransformEnd={(e) => {
          const node = imageRef.current;
          if (!node || !from) return;

          const to = getTransform(node);
          push(new TransformCommand(node, from, to));

          // const scaleX = node.scaleX();
          // const scaleY = node.scaleY();

          // node.scaleX(1);
          // node.scaleY(1);

          // onChange({
          //   ...reference,
          //   x: node.x(),
          //   y: node.y(),
          //   width: Math.max(MINIMUM_RECT_SIZE, node.width() * scaleX),
          //   height: Math.max(node.height() * scaleY),
          // });
        }}
      />
      {/* <Text x={reference.x} y={reference.y} text={reference.id} fill="red" /> */}
      {showTransformer && (
        <Transformer
          ref={trRef}
          keepRatio={false}
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
