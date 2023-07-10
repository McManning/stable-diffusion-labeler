import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DatasetTab = 'Unprocessed' | 'Processed' | 'Trashed';

type DatasetState = {
  tab: DatasetTab
  unprocessed: TrainingImage[]
  processed: TrainingImage[]
  trashed: TrainingImage[]
  selected: TrainingImage[]
}

const initialState: DatasetState = {
  tab: 'Unprocessed',
  unprocessed: [],
  processed: [],
  trashed: [],
  selected: [],
};

const dataset = createSlice({
  name: 'dataset',
  initialState,
  reducers: {
    setTab: (state, tab: PayloadAction<DatasetTab>) => {
      state.tab = tab.payload;
    },

    /**
     * Change the set of selected images
     */
    selectImages: (state, images: PayloadAction<TrainingImage[]>) => {
      state.selected = images.payload;
    },

    /**
     * Process an unprocessed image
     */
    processImage: (state, image: PayloadAction<TrainingImage>) => {
      state.unprocessed = state.processed.filter(
        (img) => img.name !== image.payload.name
      );

      state.processed = [...state.processed, image.payload];
    },

    /**
     * Throw unprocessed images into the trash
     */
    trashImages: (state, images: PayloadAction<TrainingImage[]>) => {
      state.unprocessed = state.unprocessed.filter(
        (img) => images.payload.findIndex((i) => i.name === img.name) < 0
      );

      state.trashed = [...state.trashed, ...images.payload];
    },

    /**
     * Recover unprocessed images from the trash
     */
    recoverImages: (state, images: PayloadAction<TrainingImage[]>) => {
      state.trashed = state.trashed.filter(
        (img) => images.payload.findIndex((i) => i.name === img.name) < 0
      );

      state.unprocessed = [...state.unprocessed, ...images.payload];
    },

  }
});

export const {
  setTab,
  selectImages,
  processImage,
  trashImages,
  recoverImages,
} = dataset.actions;

export const { reducer } = dataset;
