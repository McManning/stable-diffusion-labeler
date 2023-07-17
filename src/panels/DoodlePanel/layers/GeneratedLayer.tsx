


import { forwardRef, useRef } from "react";
import Konva from "konva";
import { Image, Layer, Rect } from "react-konva";
import { useAppSelector } from "@/hooks";
import useImage from "use-image";

/**
 * Display the most recent batch of generated images and preprocessors
 */
export const GeneratedLayer = forwardRef<Konva.Layer, {}>((_, ref) => {
  const generatedImageOpacity = useAppSelector((s) => s.doodle.generatedImageOpacity);
  const preprocessedImageOpacity = useAppSelector((s) => s.doodle.preprocessedImageOpacity);

  const allImages = useAppSelector((s) => s.generator.images);
  const p = allImages.filter((i) => i.type === 'preprocessed');
  const g = allImages.filter((i) => i.type === 'txt2img');

  const latestPreprocessed = p.length > 0 ? p[p.length - 1] : undefined;
  const latestGenerated = g.length > 0 ? g[g.length - 1] : undefined;

  const [generated] = useImage(latestGenerated?.src ?? '');
  const [preprocessed] = useImage(latestPreprocessed?.src ?? '');

  // Preprocessors on the same layer so we can do composite blend ops
  return (
    <Layer id="generated" ref={ref} listening={false}>
      <Image image={generated} opacity={generatedImageOpacity} />
      <Image image={preprocessed} globalCompositeOperation="lighten" opacity={preprocessedImageOpacity} />
    </Layer>
  );
});
