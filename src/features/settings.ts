import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// import type { RootState } from '../store';

export type StableDiffusionSettings = {
  /**
   * Stable Diffusion Web UI API
   */
  sdapi: string

  /**
   * Booru tags API
   */
  booru: string
}

export type IntegrationSettings = StableDiffusionSettings & {
  // TODO: RunPod, Drive, and other things?
}

export type ContextMenuState = {
  position: Point
  context: string
  data?: any
}

export type SettingsState = {
  contextMenu?: ContextMenuState
  integrations: IntegrationSettings
}

const initialState: SettingsState = {
  integrations: {
    sdapi: 'http://localhost:7860/sdapi/v1',
    booru: 'https://danbooru.donmai.us/autocomplete.json?search[type]=tag_query&version=1&limit=20&search[query]=',
  }
};

/**
 * Global application settings (hokeys, API connections, etc)
 */
const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    openContextMenu: (state, ctx: PayloadAction<ContextMenuState>) => {
      state.contextMenu = ctx.payload;
    },

    closeContextMenu: (state) => {
      state.contextMenu = undefined;
    },

    setIntegrations: (state, integrations: PayloadAction<IntegrationSettings>) => {
      state.integrations = integrations.payload;
    },
  },
});

export const {
  openContextMenu,
  closeContextMenu,
  setIntegrations,
} = settings.actions;

export const { reducer } = settings;
