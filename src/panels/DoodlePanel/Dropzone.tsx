import { uniqueId } from 'lodash';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';

import { DoodleTool, selectId, setTool } from '@/features/doodle';
import { useAppSelector } from '@/hooks';
import { useCommandHistory } from '@/hooks/useCommandHistory';
import { useDoodleStage } from '@/hooks/useDoodleStage';
import { AddReferenceCommand } from '@/utils/commands';

export interface DropzoneProps {
  children: React.ReactNode;
}

function fileToImageReference(
  file: File,
  layerId: string
): Promise<ImageReference> {
  return new Promise((resolve) => {
    const dataUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        id: uniqueId(),
        filename: file.name,
        dataUri: dataUrl,
        layerId,
        // x: 0,
        // y: 0,
        // width: img.width,
        // height: img.height,
        naturalWidth: img.width,
        naturalHeight: img.height,
      });

      // Don't want to release, need it for Konva.
      // URL.revokeObjectURL(img.src);
    };

    img.src = dataUrl;
  });
}

/**
 * Wrapper around the canvas that accepts image files to be
 * inserted as reference files into the active layer
 */
export function Dropzone({ children }: DropzoneProps) {
  const references = useAppSelector((s) => s.doodle.references);
  const { getKonvaLayerById } = useDoodleStage();
  const { push } = useCommandHistory();

  const dispatch = useDispatch();

  const onDrop = useCallback(
    async (files: File[]) => {
      if (files.length < 1) {
        return;
      }

      // TODO: Preference check (or automatic) here.
      // Whatever the active layer is - that's what we add new files to.
      // BUT! There should be a preference for always loading images to the reference layer.

      const reference = await fileToImageReference(files[0], 'Reference');

      push(new AddReferenceCommand(reference));

      // Merge into existing references on the canvas
      // dispatch(setReferences([...references, ...newReferences]));

      // Select the first reference in the batch to manipulate.
      // (don't have multi-select support atm, so just pick one)
      dispatch(setTool(DoodleTool.References));
      dispatch(selectId(reference.id));
    },
    [dispatch, push]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: {
      'image/*': [],
    },
  });

  return (
    <div {...getRootProps()} style={{ outline: 'none' }}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
}
