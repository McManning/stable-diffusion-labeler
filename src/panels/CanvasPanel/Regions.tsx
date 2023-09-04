import React, { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Layer, Line } from 'react-konva'
import { useAppSelector } from '@/hooks';
import { selectId } from '@/features/canvas';

export function Regions() {
  const layerRef = useRef<Konva.Layer>(null);
  const regions = useAppSelector((s) => s.canvas.regions);
  const selectedRegion = useAppSelector((s) => s.canvas.selectedId);

  return (
    <Layer ref={layerRef}>
      {regions.map((region) => {
        const isSelected = region.id === selectedRegion;
        return (
          <React.Fragment key={region.id}>
            {/* first we need to erase previous drawings */}
            {/* we can do it with  destination-out blend mode */}
            <Line
              // globalCompositeOperation="destination-out"
              points={region.points.flatMap((p) => [p.x, p.y])}
              fill="black"
              // opacity={0.9}
              listening={false}
              closed
            />

            {/* then we just draw new region */}
            <Line
              name="region"
              points={region.points.flatMap((p) => [p.x, p.y])}
              fill={region.color}
              closeds
              opacity={isSelected ? 0.9 : 0.8}
              listening={false}
              // onClick={() => {
              //   selectId(region.id);
              // }}
            />
          </React.Fragment>
        );
      })}
    </Layer>
  );
};
