import Konva from "konva";



/**
 * Abstraction around manipulating the Doodle Konva stage
 */
export function useDoodleStage() {

  const getStage = () => {
    // Konva keeps a global reference of stages. We use that for identifying ours.
    const stage = Konva.stages.find((s) => s.id() === 'doodle');
    if (!stage) {
      throw new Error('Missing stage with id "doodle"');
    }

    return stage;
  }

  const getLayerById = (id: string) => {
    const layer = getStage().getLayers().find((l) => l.id() === id);
    if (!layer) {
      throw new Error(`Missing layer with id '${id}'`);
    }

    return layer;
  }

  return {
    getLayerById,
    clearDrawLayer: async () => {
      const draw = getLayerById('draw');
      const lines = draw.find('Line');
      lines.forEach((line) => line.destroy());

      // TODO: Dumb cool animated version that eats away all the lines
    },
    clearAllLayers: async () => {

    },
    exportDrawLayer: async (width: number, height: number) => {
      const stage = getStage();
      const drawLayer = getLayerById('draw');

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
