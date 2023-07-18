import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum DoodleTool {
  Pan = 'Pan',
  Mask = 'Masking',
  BoxCut = 'Box Cut',
  References = 'References',
  Eraser = 'Erase',
  Pen = 'Pen',
}

export type ImageReference = {
  id: string
  filename: string
  dataUri: string

  x: number
  y: number
  width: number
  height: number

  naturalWidth: number
  naturalHeight: number
}

export type ToolSettings = {

}

export type PenSettings = ToolSettings & {
  thickness: number
}

export type EraserSettings = ToolSettings & {
  thickness: number
}

type DoodleState = {
  tool: DoodleTool

  toolSettings: Record<DoodleTool, ToolSettings>;

  isDrawing: boolean

  selectedId?: string

  width: number
  height: number

  imageWidth: number
  imageHeight: number

  boundaryWidth: number
  boundaryHeight: number

  scale: number
  brightness: number

  regions: Region[]

  references: ImageReference[]

  preprocessedImageOpacity: number
  generatedImageOpacity: number
}

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
      thickness: 4,
    },
    [DoodleTool.BoxCut]: {},
    [DoodleTool.Mask]: {},
    [DoodleTool.Pan]: {},
    [DoodleTool.References]: {},
  },

  isDrawing: false,

  regions: [],
  references: [],

  generatedImageOpacity: 1,
  preprocessedImageOpacity: 0.4,
};

/**
 * Stateful information about the doodle canvas and what's currently being displayed
 */
export const doodle = createSlice({
  name: 'doodle',
  initialState,
  reducers: {
    setCanvasSize: (state, regions: PayloadAction<{ width: number, height: number }>) => {
      state.width = regions.payload.width;
      state.height = regions.payload.height;
    },

    setImageSize: (state, regions: PayloadAction<{ width: number, height: number }>) => {
      state.imageWidth = regions.payload.width;
      state.imageHeight = regions.payload.height;
    },

    setBoundarySize: (state, regions: PayloadAction<{ width: number, height: number }>) => {
      state.boundaryWidth = regions.payload.width;
      state.boundaryHeight = regions.payload.height;
    },

    setRegions: (state, regions: PayloadAction<Region[]>) => {
      state.regions = regions.payload;
    },

    selectId: (state, id: PayloadAction<string|undefined>) => {
      state.selectedId = id.payload;
    },

    setScale: (state, scale: PayloadAction<number>) => {
      state.scale = scale.payload;
    },

    setBrightness: (state, brightness: PayloadAction<number>) => {
      state.brightness = brightness.payload;
    },

    setPreprocessedImageOpacity: (state, opacity: PayloadAction<number>) => {
      state.preprocessedImageOpacity = opacity.payload;
    },

    setGeneratedImageOpacity: (state, opacity: PayloadAction<number>) => {
      state.generatedImageOpacity = opacity.payload;
    },

    setTool: (state, mode: PayloadAction<DoodleTool>) => {
      state.tool = mode.payload;
    },

    setToolSettings: (state, settings: PayloadAction<{ tool: DoodleTool, partialSettings: Partial<ToolSettings> }>) => {
      const prev = state.toolSettings[settings.payload.tool];

      state.toolSettings[settings.payload.tool] = {
        ...prev,
        ...settings.payload.partialSettings
      };
    },

    setIsDrawing: (state, drawing: PayloadAction<boolean>) => {
      state.isDrawing = drawing.payload;
    },

    setReferences: (state, references: PayloadAction<ImageReference[]>) => {
      state.references = references.payload;
    },
  }
});

export const {
  setCanvasSize,
  setImageSize,
  setBoundarySize,
  setRegions,
  selectId,
  setScale,
  setBrightness,
  setPreprocessedImageOpacity,
  setGeneratedImageOpacity,
  setIsDrawing,
  setTool,
  setToolSettings,
  setReferences,
} = doodle.actions;

export const { reducer } = doodle;
