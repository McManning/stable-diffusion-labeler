import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Operations that can be undone/redone in the workspace
 */
export type OperationStack = {
  current: number
  operations: Operation[]
}

export type WorkspaceState = {
  activeTab: 'project' | 'search' | 'doodle';

  activeWorkspace?: Workspace
  activeImage?: TrainingImage

  search: ImageSearchFilter
  replace: ImageReplaceFilter

  operations: OperationStack
}

const initialState: WorkspaceState = {
  activeTab: 'project',
  operations: {
    current: 0,
    operations: []
  },
  search: {
    terms: '',
    regex: false,
  },
  replace: {
    terms: ''
  }
};

/**
 * Stateful information about the workspace and what's currently being displayed
 */
export const workspace = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<WorkspaceState['activeTab']>) => {
      state.activeTab = action.payload;
    },

    setActiveWorkspace: (state, current: PayloadAction<Workspace | undefined>) => {
      state.activeWorkspace = current.payload;
    },

    setActiveImage: (state, current: PayloadAction<TrainingImage | undefined>) => {
      state.activeImage = current.payload;
    },

    updateWorkspace: (state, action: PayloadAction<Workspace>) => {
      window.workspace.save(action.payload);

      if (action.payload.id === state.activeWorkspace?.id) {
        state.activeWorkspace = action.payload;
      }
    },

    setSearchFilter: (state, action: PayloadAction<ImageSearchFilter | undefined>) => {
      state.search = action.payload;
    },

    setReplaceFilter: (state, action: PayloadAction<ImageReplaceFilter | undefined>) => {
      state.replace = action.payload;
    },

    deleteImages: (state, image: PayloadAction<TrainingImage[]>) => {
      image.payload.forEach(window.images.delete);

      const ids = image.payload.map((img) => img.id);

      // Remove the images from our workspace
      if (state.activeWorkspace?.images) {
        state.activeWorkspace.images = state.activeWorkspace.images.filter(
          (img) => !ids.includes(img.id)
        );
      }

      if (state.activeImage && ids.includes(state.activeImage.id)) {
        state.activeImage = undefined;
      }
    },

    undo: (state) => {

    },

    redo: (state) => {

    },

    /**
     * Update image data in the active workspace
     */
    updateImage: (state, action: PayloadAction<TrainingImage>) => {
      if (!state.activeWorkspace) {
        return;
      }

      const idx = state.activeWorkspace.images.findIndex(
        (img) => img.id === action.payload.id
      );

      if (idx !== undefined) {
        state.activeWorkspace.images[idx] = action.payload;

        // Persist tag changes
        window.tags.save(action.payload);

        // Remap the active image, if it's this image
        if (state.activeImage?.id === action.payload.id) {
          state.activeImage = action.payload;
        }
      }
    }
  }
});

export const {
  setActiveTab,
  setActiveWorkspace,
  setActiveImage,
  setSearchFilter,
  setReplaceFilter,
  updateImage,
  updateWorkspace,
  deleteImages,
  undo,
  redo,
} = workspace.actions;

export const { reducer } = workspace;
