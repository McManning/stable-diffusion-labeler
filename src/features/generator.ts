import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import merge from 'lodash/merge';

import { DEFAULT_TEMPLATE, TEMPLATES } from '@/templates';

export type GeneratorState = {
  templates: GeneratorTemplate[]

  prompt: PromptSettings
  sampler: SamplerSettings
  controlNet: ControlNetSettings
  blend: BlendSettings

  /** Previously generated images */
  images: GeneratedImage[]

  /**
   * Are we currently generating new images
   */
  generating: boolean

  /** Last error while generating new images */
  error?: string

  /** "in progress" image being generated */
  progressImage?: InProgressImage
}

const initialState: GeneratorState = {
  templates: TEMPLATES,

  prompt: DEFAULT_TEMPLATE.prompt,
  sampler: DEFAULT_TEMPLATE.sampler,
  controlNet: DEFAULT_TEMPLATE.controlNet,
  blend: DEFAULT_TEMPLATE.blend,

  images: [],

  generating: false,
};

export const generator = createSlice({
  name: 'generator',
  initialState,
  reducers: {
    updatePrompt: (state, update: PayloadAction<Partial<PromptSettings>>) => {
      state.prompt = merge(state.blend, update.payload);
    },
    updateSampler: (state, update: PayloadAction<Partial<SamplerSettings>>) => {
      state.sampler = merge(state.sampler, update.payload);
    },
    updateControlNet: (state, update: PayloadAction<Partial<ControlNetSettings>>) => {
      state.controlNet = merge(state.controlNet, update.payload);
    },
    updateBlend: (state, update: PayloadAction<Partial<BlendSettings>>) => {
      state.blend = merge(state.blend, update.payload);
    },
    setGenerating: (state, value: PayloadAction<boolean>) => {
      state.generating = value.payload;
    },
    setError: (state, value: PayloadAction<string|undefined>) => {
      state.error = value.payload;
    },
    setProgressImage: (state, value: PayloadAction<InProgressImage|undefined>) => {
      state.progressImage = value.payload;
    },
    addImages: (state, images: PayloadAction<GeneratedImage[]>) => {
      state.images = [
        ...state.images,
        ...images.payload,
      ];
    },

    clearImages: (state) => {
      state.images = [];
    }
  }
});

export const {
  updatePrompt,
  updateSampler,
  updateControlNet,
  updateBlend,
  setGenerating,
  setError,
  setProgressImage,
  addImages,
  clearImages,
} = generator.actions;

export const { reducer } = generator;
