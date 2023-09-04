import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Konva from 'konva';
import { Image, Layer } from 'react-konva';
import useImage from 'use-image';
import { useAppSelector } from '@/hooks';
import { setCanvasSize, setImageSize, setScale } from '@/features/canvas';
import { useDispatch } from 'react-redux';

export const ImageLayer = forwardRef<Konva.Image, {}>((_, ref) => {
  const layerRef = useRef<Konva.Layer>(null);

  const width = useAppSelector((s) => s.canvas.width);
  const height = useAppSelector((s) => s.canvas.height);
  const brightness = useAppSelector((s) => s.canvas.brightness);

  const current = useAppSelector((s) => s.canvas.current);
  const dispatch = useDispatch();

  const [image] = useImage(
    `file-protocol://getTrainingImage/${current?.name}`,
    'anonymous'
  );

  useLayoutEffect(() => {
    if (!image) {
      return;
    }

    dispatch(
      setImageSize({
        width: image.width,
        height: image.height,
      })
    );
  }, [image, width, height, dispatch]);

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    const canvas = layerRef.current.getCanvas()._canvas;
    canvas.style.filter = `brightness(${(brightness + 1) * 100}%)`;
  }, [brightness]);

  return (
    <Layer id="Preview" ref={layerRef}>
      <Image ref={ref} image={image} />
    </Layer>
  );
});
