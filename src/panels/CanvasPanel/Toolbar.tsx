import { useDispatch } from 'react-redux';
import Konva from 'konva';
import { Button, Stack } from '@mui/material';
import { setInteractionMode, InteractionMode } from '@/features/canvas';
import { useAppSelector } from '@/hooks';
import {
  addImagesToWorkspace,
  deleteImages,
  setActiveWorkspace,
} from '@/features/workspace';

function CropModeTools() {
  const crops = useAppSelector((s) => s.canvas.crops);
  const image = useAppSelector((s) => s.canvas.current);
  const workspace = useAppSelector((s) => s.workspace.activeWorkspace);
  const dispatch = useDispatch();

  const onApplyCrops = async () => {
    // Iterate crops, run window.backend.saveImageCrop(image, crop) for each.
    const stage = Konva.stages[0];

    if (!image || !stage) return;

    // Iterate crop layers, pull dimensions, hide all layers but the source image,
    // capture region

    // Hide all layers but the image preview
    // const prevVisibleStates = stage.getLayers().map((layer) => {
    //   const isVisible = layer.isVisible();
    //   if (layer.id() !== 'Preview') {
    //     layer.visible(false);
    //   }
    //   return isVisible;
    // });

    const previewLayer = stage.getLayers().find((l) => l.id() === 'Preview');
    if (!previewLayer) {
      throw new Error('Could not find preview layer');
    }

    const scale = stage.scale();
    const position = stage.position();

    const cropPromises = crops.map((crop) => {
      // Export each crop into a data URI
      // TODO: Async wrapper
      // TODO: would toBlob be faster? Can I transfer blobs?

      const normalizedCrop = {
        ...crop,
        x: Math.round(crop.x),
        y: Math.round(crop.y),
        width: Math.round(crop.width),
        height: Math.round(crop.height),
      };

      // Position the clip for cropping
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: -normalizedCrop.x, y: -normalizedCrop.y });

      const dataUri = previewLayer.toDataURL({
        width: normalizedCrop.width,
        height: normalizedCrop.height,
      });

      if (!dataUri) {
        throw new Error('could not generate data Uri for crop layer');
      }

      // Save an image file into the workspace
      return window.backend.saveImageCrop(image, {
        ...normalizedCrop,
        dataUri,
      });
    });

    const cropImages = await Promise.all(cropPromises);

    stage.position(position);
    stage.scale(scale);

    // Add all cropped images to the workspace
    dispatch(addImagesToWorkspace(cropImages));

    // Delete the original
    dispatch(deleteImages([image]));

    // Move the selected image to the next in the list in the workspace.
  };

  if (crops.length < 1) {
    return;
  }

  return <Button onClick={onApplyCrops}>Apply {crops.length} crops</Button>;
}

export function Toolbar() {
  const dispatch = useDispatch();
  const mode = useAppSelector((s) => s.canvas.interaction);

  const toggleCropMode = () => {
    dispatch(
      setInteractionMode(
        mode !== InteractionMode.Crop
          ? InteractionMode.Crop
          : InteractionMode.Pan
      )
    );
  };

  return (
    <Stack
      direction="row"
      sx={{ position: 'absolute', bottom: 8, left: 8 }}
      gap={1}
    >
      <Button onClick={toggleCropMode}>
        {mode === InteractionMode.Crop ? 'Crop' : 'Pan'}
      </Button>

      {mode === InteractionMode.Crop && <CropModeTools />}
    </Stack>
  );
}
