import Konva from "konva";
import { useAppSelector } from ".";
import { useDispatch } from "react-redux";
import { setActiveLayer } from "@/features/doodle";



/**
 * Abstraction around manipulating the Doodle Konva stage
 */
export function useDoodleStage() {
  const activeLayer = useAppSelector((s) => s.doodle.activeLayer);
  const layers = useAppSelector((s) => s.doodle.layers);
  const dispatch = useDispatch();

  const getStage = () => {
    // Konva keeps a global reference of stages. We use that for identifying ours.
    const stage = Konva.stages.find((s) => s.id() === 'doodle');
    if (!stage) {
      throw new Error('Missing stage with id "doodle"');
    }

    return stage;
  }

  const getKonvaLayerById = (id: string) => {
    const layer = getStage().getLayers().find((l) => l.id() === id);
    if (!layer) {
      throw new Error(`Missing layer with id '${id}'`);
    }

    return layer;
  }

  // TODO: Export/import entire line batches. E.g. instead of importing from
  // images, I can also just doodle right on the canvas, export that, and
  // reimport in the same points data format (or SVG if I want to get fancy)

  return {
    getKonvaLayerById,

    getActiveLayer: () => {
      const layer = layers.find((l) => l.id === activeLayer);
      if (!layer) {
        throw new Error(`Missing layer with id '${activeLayer}'`);
      }
      return layer;
    },

    /**
     * Retrieve the `Konva.Layer` the active `DoodleLayer` is attached to
     */
    getActiveKonvaLayer: () => {
      const layer = layers.find((l) => l.id === activeLayer);
      if (!layer) {
        throw new Error(`Missing layer with id '${activeLayer}'`);
      }

      return getKonvaLayerById(layer.konvaLayerId);
    },

    /**
     * Set the active `DoodleLayer` by ID.
     *
     * The active layer will receive user interactions,
     * e.g. as the target for new reference images.
     *
     * @param id Known `DoodleLayer.id`
     */
    setActiveLayer: (id: string) => {
      const layer = layers.find((l) => l.id === id);
      if (!layer) {
        throw new Error(`Unknown layer '${id}'`);
      }

      dispatch(setActiveLayer(id));
    },

    exportDrawLayer: async (width: number, height: number) => {
      const stage = getStage();
      const drawLayer = getKonvaLayerById('draw');

      // Hide all layers that aren't the main drawing layer or
      // our background layer (ControlNet doesn't have alpha PNG support)
      getStage().getLayers()
        .filter((layer) => layer.id() !== 'draw' && layer.id() !== 'background')
        .forEach((layer) => layer.hide());

      // Zero out the TRS matrix of the stage before capturing
      const scale = stage.scale();
      const pos = stage.position();
      stage.scale({ x: 1, y: 1 }).position({ x: 0, y: 0 });

      const b64img = stage.toDataURL({
        x: 0,
        y: 0,
        width: width,
        height: height,
        pixelRatio: 1,
      });

      // Reset stage position and show all layers again
      stage.position(pos).scale(scale);
      getStage().getLayers().forEach((layer) => layer.show());

      return b64img;
    },
    zoomToFit: () => {
      alert('TODO');
    },
  }
}
