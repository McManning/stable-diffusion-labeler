import { DoodleTool, ImageReference, selectId, setReferences, setTool } from '@/features/doodle';
import { useAppSelector } from '@/hooks';
import { useCommandHistory } from '@/hooks/useCommandHistory';
import { useDoodleStage } from '@/hooks/useDoodleStage';
import { AddReferenceCommand } from '@/utils/commands';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';

export interface DropzoneProps {
  children: React.ReactNode
}


function fileToImageReference(file: File): Promise<ImageReference> {
  return new Promise((resolve) => {
    const dataUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        id: file.name,
        filename: file.name,
        dataUri: dataUrl,
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
        naturalWidth: img.width,
        naturalHeight: img.height,
      });

      // Don't want to release, need it for Konva.
      // URL.revokeObjectURL(img.src);
    }

    img.src = dataUrl;
  });
}

/**
 * Wrapper around the canvas that accepts image files to be
 * inserted as reference files into the active layer
 */
export function Dropzone({ children }: DropzoneProps) {
  const references = useAppSelector((s) => s.doodle.references);
  const { getLayerById } = useDoodleStage();
  const { push } = useCommandHistory();

  const dispatch = useDispatch();

  const onDrop = useCallback(async (files: File[]) => {
    if (files.length < 1) {
      return;
    }

    const reference = await fileToImageReference(files[0]);

    const layer = getLayerById('reference');

    push(new AddReferenceCommand(layer, reference));

    // Merge into existing references on the canvas
    // dispatch(setReferences([...references, ...newReferences]));

    // Select the first reference in the batch to manipulate.
    // (don't have multi-select support atm, so just pick one)
    dispatch(setTool(DoodleTool.References));
    dispatch(selectId(reference.id));

  }, [references, dispatch, push, getLayerById]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: {
      'image/*': [],
    }
  });

  return (
    <div {...getRootProps()} style={{ outline: 'none' }}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
}
