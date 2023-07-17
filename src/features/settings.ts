import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import merge from 'lodash/merge';

// import type { RootState } from '../store';

export type ContextMenuState = {
  position: Point
  context: string
  data?: any
}

export type SettingsState = {
  contextMenu?: ContextMenuState
  integrations: IntegrationSettings

  maxGPUCanvasSize: number
}

const initialState: SettingsState = {
  integrations: {
    sdapi: 'http://localhost:7860/sdapi/v1',
    booruApi: 'https://danbooru.donmai.us/autocomplete.json?search[type]=tag_query&version=1&limit=20&search[query]={terms}',
  },
  maxGPUCanvasSize: 1280 * 1280,
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

    updateIntegrations: (state, integrations: PayloadAction<IntegrationSettings>) => {
      state.integrations = merge(state.integrations, integrations.payload);
    },
  },
});

export const {
  openContextMenu,
  closeContextMenu,
  updateIntegrations,
} = settings.actions;

export const { reducer } = settings;
