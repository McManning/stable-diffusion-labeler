import { forwardRef, useRef } from 'react';
import Konva from 'konva';
import { Layer, Rect } from 'react-konva';
import { useAppSelector } from '@/hooks';

/**
 * Display a solid background color. Used for exporting PNGs with non-alpha backgrounds
 */
export const BackgroundLayer = forwardRef<Konva.Layer, {}>((_, ref) => {
  const width = useAppSelector((s) => s.generator.sampler.width);
  const height = useAppSelector((s) => s.generator.sampler.height);

  return (
    <Layer id="background" ref={ref} listening={false}>
      <Rect x={0} y={0} width={width} height={height} fill="#000000" />
    </Layer>
  );
});
