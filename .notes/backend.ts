import { app, dialog, nativeTheme } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import {
  addFolderImagesToWorkspace,
  addImagesToWorkspace,
  cropImage,
  deleteImage,
  readWorkspaceFromDisk,
  reloadWorkspace,
  replaceTags,
  writeImageCropToDisk,
  writeTagsToDisk,
  writeWorkspaceToDisk,
} from '../util';
import { createEventMap } from './frontend';

type ElectronEventListener = (
  event: Electron.IpcMainInvokeEvent,
  ...args: any[]
) => Promise<void> | any;

type ElectronEventMap = {
  [K in keyof ReturnType<typeof createEventMap>]: ElectronEventListener;
};

// TODO: Somehow generate createEventMap equivalent solely from this object.
// I don't want to have to use both to add methods and proxies to invoke().
// Essentially, each one is just a utility function except with the event as a first arg.
// If we can proxy it all directly to util functions of the same name, and then
// have that list of functions also wired s.t. the frontend has access, it'd make
// everything a hell of a lot easier.

export const BACKEND_EVENTS: ElectronEventMap = {
  toggleDarkMode: () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  },

  activateSystemTheme: () => {
    nativeTheme.themeSource = 'system';
  },

  openWorkspace: async () => {
    const selection = await dialog.showOpenDialog({
      filters: [
        {
          name: 'Labeling Workspace',
          extensions: ['label-workspace'],
        },
      ],
      properties: ['openFile'],
    });

    if (!selection.filePaths.length) {
      return undefined;
    }

    const workspace = readWorkspaceFromDisk(selection.filePaths[0]);

    if (workspace) {
      app.addRecentDocument(selection.filePaths[0]);
    }

    return workspace;
  },
  reloadWorkspace: async (event, workspace: Workspace) => {
    return reloadWorkspace(workspace);
  },
  saveWorkspace: async (event, workspace: Workspace) => {
    if (!workspace) {
      throw new Error('Expected workspace arg');
    }

    // Hasn't been saved already yet. Ignore.
    if (!workspace.path) {
      return workspace;
    }

    writeWorkspaceToDisk(workspace.path, workspace);

    app.addRecentDocument(workspace.path);
    return workspace;
  },
  saveWorkspaceAs: async (event, workspace: Workspace) => {
    if (!workspace) {
      throw new Error('Expected workspace arg');
    }

    const selection = await dialog.showSaveDialog({
      filters: [
        {
          name: 'Labeling Workspace',
          extensions: ['label-workspace'],
        },
      ],
    });

    if (!selection.filePath) {
      return workspace;
    }

    workspace.id = uuidv4();
    workspace.path = selection.filePath;

    writeWorkspaceToDisk(selection.filePath, workspace);

    return workspace;
  },
  addFolderToWorkspace: async (event, workspace: Workspace) => {
    if (!workspace) {
      throw new Error('Expected workspace arg');
    }

    const selection = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (selection.canceled || selection.filePaths.length < 1) {
      return workspace;
    }

    return addFolderImagesToWorkspace(selection.filePaths[0], workspace);
  },
  addImagesToWorkspace: async (
    event,
    workspace: Workspace,
    images: TrainingImage[],
    insertAfter?: TrainingImage
  ) => {
    return addImagesToWorkspace(workspace, images, insertAfter);
  },
  saveImageCrop: async (event, image: TrainingImage, crop: Crop) => {
    return writeImageCropToDisk(image, crop);
  },
  saveImageTags: async (event, image: TrainingImage) => {
    writeTagsToDisk(image);
  },
  replaceAllTags: async (
    event,
    workspace: Workspace,
    replacements: ImageSearchResult[]
  ) => {
    replaceTags(workspace, replacements);
    return workspace;
  },
  deleteImage: async (event, image: TrainingImage) => {
    deleteImage(image);
  },
};
