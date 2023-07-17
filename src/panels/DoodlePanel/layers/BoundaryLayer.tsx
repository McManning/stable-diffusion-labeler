import { forwardRef, useRef } from "react";
import Konva from "konva";
import { Layer, Rect } from "react-konva";
import { useAppSelector } from "@/hooks";

const OVERDRAW_SIZE = 512;
const FILL_COLOR = 'rgba(0, 0, 0, 0.5)';

/**
 * Display the image boundary that will be sent to Stable Diffusion.
 *
 * Anything outside the boundary will be dimmed out.
 */
export const BoundaryLayer = forwardRef<Konva.Layer, {}>((_, ref) => {
  // const width = useAppSelector((s) => s.doodle.boundaryWidth);
  // const height = useAppSelector((s) => s.doodle.boundaryHeight);

  const width = useAppSelector((s) => s.generator.sampler.width);
  const height = useAppSelector((s) => s.generator.sampler.height);

  return (
    <Layer id="boundary" ref={ref} listening={false}>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        outline
        stroke="#ffffff"
        strokeWidth={1}
        dash={[ 10, 10 ]}
      />
      <Rect x={-OVERDRAW_SIZE} y={-OVERDRAW_SIZE} width={width + OVERDRAW_SIZE * 2} height={OVERDRAW_SIZE} fill={FILL_COLOR} />
      <Rect x={-OVERDRAW_SIZE} y={height} width={width + OVERDRAW_SIZE * 2} height={OVERDRAW_SIZE} fill={FILL_COLOR} />
      <Rect x={-OVERDRAW_SIZE} y={0} width={OVERDRAW_SIZE} height={height} fill={FILL_COLOR} />
      <Rect x={width} y={0} width={OVERDRAW_SIZE} height={height} fill={FILL_COLOR} />
    </Layer>
  );
});

