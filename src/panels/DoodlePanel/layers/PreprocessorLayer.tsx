


import { forwardRef, useRef } from "react";
import Konva from "konva";
import { Image, Layer, Rect } from "react-konva";
import { useAppSelector } from "@/hooks";
import useImage from "use-image";

/**
 * Display the most recent ControlNet preprocessor image
 */
export const PreprocessorLayer = forwardRef<Konva.Layer, {}>((_, ref) => {
  const width = useAppSelector((s) => s.generator.sampler.width);
  const height = useAppSelector((s) => s.generator.sampler.height);

  const images = useAppSelector((s) => s.generator.images);

  const preprocessed = images.filter((i) => i.type === 'preprocessed');
  const latest = preprocessed.length > 0 ? preprocessed[preprocessed.length - 1] : undefined;

  const [image] = useImage(latest?.src ?? '');

  return (
    <Layer id="preprocessor" ref={ref} listening={false}>
      {/* <Image image={image}
            globalCompositeOperation="color" /> */}
    </Layer>
  );
});
