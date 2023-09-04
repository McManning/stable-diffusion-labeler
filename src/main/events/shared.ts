import { app, dialog, nativeTheme, shell } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import {
  addFolderImagesToWorkspace,
  addImagesToWorkspace,
  deleteImage,
  readWorkspaceFromDisk,
  reloadWorkspace,
  replaceTags,
  writeImageCropToDisk,
  writeTagsToDisk,
  writeWorkspaceToDisk,
} from '../util';
import settings from '../settings';

async function toggleDarkMode() {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  return nativeTheme.shouldUseDarkColors;
}

async function activateSystemTheme() {
  nativeTheme.themeSource = 'system';
}

async function openWorkspace(path?: string): Promise<Workspace | undefined> {
  let filePath = path;

  if (!filePath) {
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

    filePath = selection.filePaths[0];
  }

  const workspace = readWorkspaceFromDisk(filePath);
  addToRecentWorkspaces(filePath);

  return workspace;
}

function addToRecentWorkspaces(filePath: string) {
  // Add to top of recent workspaces
  const recent = settings.get('recentWorkspaces');
  settings.set('recentWorkspaces', [
    filePath,
    ...recent.filter((r) => r !== filePath),
  ]);

  // if (workspace) {
  //   app.addRecentDocument(selection.filePaths[0]);
  // }
}

async function saveWorkspace(workspace: Workspace): Promise<Workspace> {
  if (!workspace) {
    throw new Error('Expected workspace arg');
  }

  // Hasn't been saved already yet. Ignore.
  if (!workspace.path) {
    return workspace;
  }

  writeWorkspaceToDisk(workspace.path, workspace);
  addToRecentWorkspaces(workspace.path);
  return workspace;
}

async function saveWorkspaceAs(workspace: Workspace): Promise<Workspace> {
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
  addToRecentWorkspaces(selection.filePath);

  return workspace;
}

async function addFolderToWorkspace(workspace: Workspace) {
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
}

function revealFile(filePath: string) {
  shell.showItemInFolder(filePath);
}

type IpcRendererInvoke = <T>(event: string, ...args: any[]) => Promise<T>;

// functions exposed to the frontend and event map things
export const SHARED_FUNCTIONS = {
  toggleDarkMode,
  activateSystemTheme,
  openWorkspace,
  reloadWorkspace,
  saveWorkspace,
  saveWorkspaceAs,
  addFolderToWorkspace,
  addImagesToWorkspace,
  saveImageCrop: writeImageCropToDisk,
  saveImageTags: writeTagsToDisk,
  replaceAllTags: replaceTags,
  deleteImage,
  revealFile,
};

type SharedFunctionMap = typeof SHARED_FUNCTIONS;

/**
 * Retype the function map to methods that can be exposed in the Electron main world
 */
export type MainWorldApiFuncs = {
  [K in keyof SharedFunctionMap]: SharedFunctionMap[K];
};

/**
 * @author https://stackoverflow.com/a/51851844
 */
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

/**
 * Retype the function map to add an `IpcMainInvokeEvent` as the first
 * argument to each function.
 */
type IpcMainInvokeEventHandlerMap = {
  [K in keyof SharedFunctionMap]: (
    event: Electron.IpcMainInvokeEvent,
    ...args: ArgumentTypes<SharedFunctionMap[K]>
  ) => ReturnType<SharedFunctionMap[K]>;
};

/**
 * Replace each function in the function map with a method
 * that takes an `IpcMainInvokeEvent` as a first argument followed
 * by the original functions arguments.
 *
 * @param funcs
 * @returns
 */
export function createEventMapFromFuncs(funcs: SharedFunctionMap) {
  return (Object.keys(funcs) as Array<keyof SharedFunctionMap>).reduce(
    (agg, funcName) => {
      // Each electron event listener needs an additional event arg that we don't use.
      // I know I'm abusing `any` here but I'm lazy. I know the types reduce correctly.
      agg[funcName] = ((event: any, ...args: any[]) =>
        (funcs[funcName] as Function)(...args)) as any;
      return agg;
    },
    {} as IpcMainInvokeEventHandlerMap
  );
}

/**
 * Replace each function in the function map with an invoke method that takes
 * the function's name and the set of arguments.
 *
 * This is to support converting the function map over to a map for `ipcRenderer.invoke`
 * in order to expose shared functions to the Electron frontend.
 *
 * @param funcs
 * @param invoke Typically, `ipcRenderer.invoke`
 * @returns
 */
export function createMainWorldApi(
  funcs: SharedFunctionMap,
  invoke: IpcRendererInvoke
) {
  return (Object.keys(funcs) as Array<keyof SharedFunctionMap>).reduce(
    (agg, funcName) => {
      agg[funcName] = ((...args: any[]) => invoke(funcName, ...args)) as any;
      return agg;
    },
    {} as MainWorldApiFuncs
  );
}

// Usage:
// const evt = createEventMapFromFuncs(SHARED_FUNCTIONS);
// const mainWorldApi = createMainWorldApi(SHARED_FUNCTIONS, () => 0);
// mainWorldApi.writeImageCropToDisk({ id: 'trainingImageId' }, { width: 5 });
