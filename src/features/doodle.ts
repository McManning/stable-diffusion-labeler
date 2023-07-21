import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToolSettings = {};

export type PenSettings = ToolSettings & {
  thickness: number;
};

export type EraserSettings = ToolSettings & {
  thickness: number;
};

export enum DoodleTool {
  Pan = 'Pan',
  Mask = 'Masking',
  BoxCut = 'Box Cut',
  References = 'References',
  Eraser = 'Erase',
  Pen = 'Pen',
}

type DoodleState = {
  tool: DoodleTool;

  toolSettings: Record<DoodleTool, ToolSettings>;

  isDrawing: boolean;

  /** Selected `Konva.Node` id */
  selectedId?: string;

  width: number;
  height: number;

  imageWidth: number;
  imageHeight: number;

  boundaryWidth: number;
  boundaryHeight: number;

  scale: number;
  brightness: number;

  regions: Region[];

  references: ImageReference[];

  /** Metadata associated with each layer.
   *
   * Note that a `DoodleLayer` is not one to one with a `Konva.Layer`.
   * Multiple `DoodleLayers` may exist within a single `Konva.Layer`
   * to support composite blending or other draw optimizations.
   */
  layers: DoodleLayer[];

  /** Current layer (by ID) the user is interacting with */
  activeLayer: string;
};

const initialState: DoodleState = {
  width: 0,
  height: 0,
  imageWidth: 100,
  imageHeight: 100,
  boundaryWidth: 512,
  boundaryHeight: 512,
  scale: 1,
  brightness: 1,

  tool: DoodleTool.Pen,

  toolSettings: {
    [DoodleTool.Pen]: {
      thickness: 4,
    },
    [DoodleTool.Eraser]: {
      thickness: 16,
    },
    [DoodleTool.BoxCut]: {},
    [DoodleTool.Mask]: {},
    [DoodleTool.Pan]: {},
    [DoodleTool.References]: {},
  },

  layers: [
    {
      id: 'Draw',
      visible: true,
      opacity: 1,
      konvaLayerId: 'draw',
    },
    {
      id: 'Reference',
      visible: true,
      opacity: 1,
      konvaLayerId: 'reference',
    },
    {
      id: 'Preprocess',
      visible: false,
      opacity: 0.3,
      konvaLayerId: 'generated',
    },
    {
      id: 'Preview',
      visible: true,
      opacity: 1,
      konvaLayerId: 'generated',
    },
  ],

  activeLayer: 'Draw',

  isDrawing: false,

  regions: [],
  references: [],
};

/**
 * Stateful information about the doodle canvas and what's currently being displayed
 */
export const doodle = createSlice({
  name: 'doodle',
  initialState,
  reducers: {
    setCanvasSize: (
      state,
      regions: PayloadAction<{ width: number; height: number }>
    ) => {
      state.width = regions.payload.width;
      state.height = regions.payload.height;
    },

    setImageSize: (
      state,
      regions: PayloadAction<{ width: number; height: number }>
    ) => {
      state.imageWidth = regions.payload.width;
      state.imageHeight = regions.payload.height;
    },

    setBoundarySize: (
      state,
      regions: PayloadAction<{ width: number; height: number }>
    ) => {
      state.boundaryWidth = regions.payload.width;
      state.boundaryHeight = regions.payload.height;
    },

    setRegions: (state, regions: PayloadAction<Region[]>) => {
      state.regions = regions.payload;
    },

    setLayers: (state, layers: PayloadAction<DoodleLayer[]>) => {
      state.layers = [...layers.payload];
    },

    selectId: (state, id: PayloadAction<string | undefined>) => {
      state.selectedId = id.payload;
    },

    setScale: (state, scale: PayloadAction<number>) => {
      state.scale = scale.payload;
    },

    setBrightness: (state, brightness: PayloadAction<number>) => {
      state.brightness = brightness.payload;
    },

    setTool: (state, mode: PayloadAction<DoodleTool>) => {
      state.tool = mode.payload;
    },

    setToolSettings: (
      state,
      settings: PayloadAction<{
        tool: DoodleTool;
        partialSettings: Partial<ToolSettings>;
      }>
    ) => {
      const prev = state.toolSettings[settings.payload.tool];

      state.toolSettings[settings.payload.tool] = {
        ...prev,
        ...settings.payload.partialSettings,
      };
    },

    setActiveLayer: (state, layer: PayloadAction<string>) => {
      state.activeLayer = layer.payload;
    },

    setIsDrawing: (state, drawing: PayloadAction<boolean>) => {
      state.isDrawing = drawing.payload;
    },

    setReferences: (state, references: PayloadAction<ImageReference[]>) => {
      state.references = references.payload;
    },

    addReference: (state, reference: PayloadAction<ImageReference>) => {
      const existing = state.references.find(
        (r) => r.id === reference.payload.id
      );

      // If the reference was already loaded, just display again.
      if (existing) {
        state.references = state.references.map((r) => ({
          ...r,
          hidden: r.id === reference.payload.id ? false : r.hidden,
        }));
      } else {
        state.references = [...state.references, reference.payload];
      }
    },

    removeReference: (state, reference: PayloadAction<ImageReference>) => {
      state.references = state.references.map((r) => ({
        ...r,
        hidden: r.id === reference.payload.id ? true : r.hidden,
      }));

      if (state.selectedId === reference.payload.id) {
        state.selectedId = undefined;
      }
    },
  },
});

export const {
  setCanvasSize,
  setImageSize,
  setBoundarySize,
  setRegions,
  setLayers,
  selectId,
  setScale,
  setBrightness,
  setIsDrawing,
  setTool,
  setToolSettings,
  setActiveLayer,
  setReferences,
  addReference,
  removeReference,
} = doodle.actions;

export const { reducer } = doodle;
