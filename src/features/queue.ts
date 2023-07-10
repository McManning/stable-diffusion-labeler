import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DatasetTab = 'Unprocessed' | 'Processed' | 'Trashed';

// import type { RootState } from '../store';

type DatasetState = {
  images: TrainingImage[]
}

const initialState: DatasetState = {
  images: [],
};

const queue = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    /**
     * Add new images to be processed
     */
    addImages: (state, images: PayloadAction<TrainingImage[]>) => {
      state.images = [...state.images, ...images.payload];
    },


  }
});

export const {
  addImages,
} = queue.actions;

export const { reducer } = queue;
