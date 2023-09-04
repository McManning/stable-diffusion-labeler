import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Operations that can be undone/redone in the workspace
 */
export type OperationStack = {
  current: number;
  operations: Operation[];
};

export type WorkspaceState = {
  activeTab: 'project' | 'search' | 'doodle';

  activeWorkspace?: Workspace;
  activeImage?: TrainingImage;

  selected: TrainingImage[];

  search: ImageSearchFilter;
  replace: ImageReplaceFilter;

  operations: OperationStack;
};

const initialState: WorkspaceState = {
  activeTab: 'project',
  selected: [],
  operations: {
    current: 0,
    operations: [],
  },
  search: {
    terms: '',
    regex: false,
  },
  replace: {
    terms: '',
  },
};

/**
 * Stateful information about the workspace and what's currently being displayed.
 *
 * Interaction between the backend API and workspace changes happens through
 * this slice to keep everything in sync.
 */
export const workspace = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setActiveTab: (
      state,
      action: PayloadAction<WorkspaceState['activeTab']>
    ) => {
      state.activeTab = action.payload;
    },

    setActiveWorkspace: (
      state,
      current: PayloadAction<Workspace | undefined>
    ) => {
      state.activeWorkspace = current.payload;
    },

    setActiveImage: (
      state,
      current: PayloadAction<TrainingImage | undefined>
    ) => {
      state.activeImage = current.payload;

      state.selected = current.payload ? [current.payload] : [];
    },

    addToSelection: (state, images: PayloadAction<TrainingImage[]>) => {
      state.selected = [...state.selected];
      images.payload.forEach((img) => {
        if (!state.selected.find((i) => i.id === img.id)) {
          state.selected.push(img);
        }
      });
    },

    updateWorkspace: (state, action: PayloadAction<Workspace>) => {
      window.backend.saveWorkspace(action.payload);

      if (action.payload.id === state.activeWorkspace?.id) {
        state.activeWorkspace = action.payload;
      }
    },

    setSearchFilter: (state, action: PayloadAction<ImageSearchFilter>) => {
      state.search = action.payload;
    },

    setReplaceFilter: (state, action: PayloadAction<ImageReplaceFilter>) => {
      state.replace = action.payload;
    },

    deleteImages: (state, image: PayloadAction<TrainingImage[]>) => {
      image.payload.forEach(window.backend.deleteImage);

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

    undo: (state) => {},

    redo: (state) => {},

    /**
     * Update image data in the active workspace
     */
    updateImages: (state, action: PayloadAction<TrainingImage[]>) => {
      if (!state.activeWorkspace) {
        return;
      }

      let needsSelectionUpdate = false;

      for (const img of action.payload) {
        const idx = state.activeWorkspace.images.findIndex(
          (existing) => img.id === existing.id
        );

        if (idx !== undefined) {
          state.activeWorkspace.images[idx] = img;

          // Persist tag changes
          window.backend.saveImageTags(img);

          // Remap the active image, if it's this image
          if (state.activeImage?.id === img.id) {
            state.activeImage = img;
          }

          const selectedCopy = state.selected.findIndex(
            (sel) => sel.id === img.id
          );
          if (selectedCopy >= 0) {
            needsSelectionUpdate = true;
            state.selected[selectedCopy] = img;
          }
        }
      }

      // If selected images contains any of the modified images,
      // update the selected images list to match changes
      if (needsSelectionUpdate) {
        state.selected = [...state.selected];
      }
    },

    addImagesToWorkspace: (state, action: PayloadAction<TrainingImage[]>) => {
      if (!state.activeWorkspace) {
        return;
      }

      // // Notify backend
      // window.backend.addImagesToWorkspace(
      //   { ...state.activeWorkspace },
      //   action.payload
      // );

      // Apply locally. Since the new files are added to the same workspace directory,
      // we don't need to worry about pushing it to the backend. Next workspace
      // reload will pull them anyway.
      state.activeWorkspace.images = [
        ...state.activeWorkspace.images,
        ...action.payload,
      ];
    },
  },
});

export const {
  setActiveTab,
  setActiveWorkspace,
  setActiveImage,
  addToSelection,
  addImagesToWorkspace,
  setSearchFilter,
  setReplaceFilter,
  updateImages,
  updateWorkspace,
  deleteImages,
  undo,
  redo,
} = workspace.actions;

export const { reducer } = workspace;
