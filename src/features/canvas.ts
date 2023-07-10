import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum InteractionMode {
  Pan,
  Mask,
  BoxCut,
  Label,
  Erase,
}

export type InteractionState = {
  interaction: InteractionMode
  isDrawing: boolean
  editLabel?: Label
  selectedId?: number
}

type CanvasState = InteractionState & {
  width: number
  height: number
  imageWidth: number
  imageHeight: number
  scale: number
  brightness: number

  current?: TrainingImage
  regions: Region[]
  labels: Label[]
}

const initialState: CanvasState = {
  width: 0,
  height: 0,
  imageWidth: 100,
  imageHeight: 100,
  scale: 1,
  brightness: 0,

  interaction: InteractionMode.Pan,
  isDrawing: false,

  labels: [],
  regions: [],
};

/**
 * Stateful information about the canvas and what's currently being displayed
 */
export const canvas = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setImage: (state, current: PayloadAction<TrainingImage | undefined>) => {
      state.current = current.payload;
      // TODO: Image dimensions, etc.

      // Reset our state for this image
      state.regions = [];
      state.labels = [];
      state.scale = 1;
      state.selectedId = undefined;
      state.brightness = 0;
      state.interaction = InteractionMode.Pan;
    },

    setCanvasSize: (state, regions: PayloadAction<{ width: number, height: number }>) => {
      state.width = regions.payload.width;
      state.height = regions.payload.height;
    },

    setImageSize: (state, regions: PayloadAction<{ width: number, height: number }>) => {
      state.imageWidth = regions.payload.width;
      state.imageHeight = regions.payload.height;
    },

    setRegions: (state, regions: PayloadAction<Region[]>) => {
      state.regions = regions.payload;
    },

    setLabels: (state, labels: PayloadAction<Label[]>) => {
      state.labels = labels.payload;
    },

    selectId: (state, id: PayloadAction<number|undefined>) => {
      state.selectedId = id.payload;
    },

    setScale: (state, scale: PayloadAction<number>) => {
      state.scale = scale.payload;
    },

    setBrightness: (state, brightness: PayloadAction<number>) => {
      state.brightness = brightness.payload;
    },

    setInteractionMode: (state, mode: PayloadAction<InteractionMode>) => {
      state.interaction = mode.payload;
    },

    setIsDrawing: (state, drawing: PayloadAction<boolean>) => {
      state.isDrawing = drawing.payload;
    },

    editLabel: (state, label: PayloadAction<Label | undefined>) => {
      state.editLabel = label.payload;
    },
  }
});

export const {
  setImage,
  setCanvasSize,
  setImageSize,
  setRegions,
  setLabels,
  selectId,
  setScale,
  setBrightness,
  setIsDrawing,
  setInteractionMode,
  editLabel,
} = canvas.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export const { reducer } = canvas;
