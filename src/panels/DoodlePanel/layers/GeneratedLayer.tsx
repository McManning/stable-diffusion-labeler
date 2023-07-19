
import { forwardRef, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Image, Layer, Rect } from "react-konva";
import { useAppSelector } from "@/hooks";
import useImage from "use-image";

function ProgressImage({ opacity, visible }: { opacity?: number, visible?: boolean }) {
  const progressImage = useAppSelector((s) => s.generator.progressImage);
  const sampler = useAppSelector((s) => s.generator.sampler);

  // Double buffered to avoid flickering while loading new image states
  const [prevImage, setPrevImage] = useState<HTMLImageElement>();
  const [image, imageState] = useImage(progressImage?.src ?? '');

  useEffect(() => {
    if (imageState === 'loaded' && image?.src !== prevImage?.src) {
      setPrevImage(image);
    }
  }, [prevImage, image, imageState]);

  return (
    <Image
      image={prevImage}
      opacity={opacity}
      visible={visible}
      width={sampler.width}
      height={sampler.height}
    />
  )
}

/**
 * Display the most recent batch of generated images and preprocessors
 */
export const GeneratedLayer = forwardRef<Konva.Layer, {}>((_, ref) => {
  const previewSettings = useAppSelector((s) => s.doodle.layers.find((l) => l.id === 'Preview'));
  const preprocessSettings = useAppSelector((s) => s.doodle.layers.find((l) => l.id === 'Preprocess'));

  const allImages = useAppSelector((s) => s.generator.images);
  const generating = useAppSelector((s) => s.generator.generating);

  const p = allImages.filter((i) => i.type === 'preprocessed');
  const g = allImages.filter((i) => i.type === 'txt2img');

  const latestPreprocessed = p.length > 0 ? p[p.length - 1] : undefined;
  const latestGenerated = g.length > 0 ? g[g.length - 1] : undefined;

  const [generated] = useImage(latestGenerated?.src ?? '');
  const [preprocessed] = useImage(latestPreprocessed?.src ?? '');

  // Preprocessors on the same layer so we can do composite blend ops
  return (
    <Layer id="generated" ref={ref} listening={false}>
      <Image
        image={generated}
        opacity={previewSettings?.opacity}
        visible={previewSettings?.visible}
      />
      <Image
        image={preprocessed}
        globalCompositeOperation="lighter"
        opacity={preprocessSettings?.opacity}
        visible={preprocessSettings?.visible}
      />
      {generating &&
        <ProgressImage
          opacity={previewSettings?.opacity}
          visible={previewSettings?.visible}
        />
      }
    </Layer>
  );
});
