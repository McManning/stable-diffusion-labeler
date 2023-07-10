/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, nativeTheme, dialog, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath, writeWorkspaceToDisk, addFolderImagesToWorkspace, readWorkspaceFromDisk, writeTagsToDisk, deleteImage } from './util';
import { randomUUID } from 'crypto';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => path.join(RESOURCES_PATH, ...paths);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system';
});

ipcMain.handle('workspace:open', async () => {
  const selection = await dialog.showOpenDialog({
    filters: [
      {
        name: 'Labeling Workspace',
        extensions: ['label-workspace'],
      }
    ],
    properties: ['openFile']
  });

  if (!selection.filePaths.length) {
    return undefined;
  }

  const workspace = readWorkspaceFromDisk(selection.filePaths[0]);

  if (workspace) {
    app.addRecentDocument(selection.filePaths[0]);
  }

  return workspace;
});

ipcMain.handle('workspace:save-as', async (event, workspace: Workspace) => {
  if (!workspace) {
    throw new Error('Expected workspace arg')
  }

  const selection = await dialog.showSaveDialog({
    filters: [
      {
        name: 'Labeling Workspace',
        extensions: ['label-workspace'],
      }
    ],
  });

  if (!selection.filePath) {
    return workspace;
  }

  workspace.id = randomUUID();
  workspace.path = selection.filePath;

  writeWorkspaceToDisk(selection.filePath, workspace);

  app.addRecentDocument(selection.filePath);

  return workspace;
});

ipcMain.handle('workspace:add-folder', async (event, workspace: Workspace) => {
  if (!workspace) {
    throw new Error('Expected workspace arg')
  }

  const selection = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (selection.canceled || selection.filePaths.length < 1) {
    return workspace;
  }

  return addFolderImagesToWorkspace(selection.filePaths[0], workspace);
});

ipcMain.handle('workspace:save', async (event, workspace: Workspace) => {
  if (!workspace) {
    throw new Error('Expected workspace arg')
  }

  // Hasn't been saved already yet. Ignore.
  if (!workspace.path) {
    return workspace;
  }

  writeWorkspaceToDisk(workspace.path, workspace);

  app.addRecentDocument(workspace.path)
  return workspace
})

ipcMain.handle('tags:generate', async (event, workspace: Workspace) => {
  console.log('generate tags', workspace);
})

ipcMain.handle('image:save-tags', async (event, image: TrainingImage) => {
  writeTagsToDisk(image);
})

ipcMain.handle('image:delete', async (event, image: TrainingImage) => {
  deleteImage(image);
})

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();

    protocol.registerFileProtocol('file-protocol', (request, callback) => {
      const url = decodeURIComponent(
        request.url.replace('file-protocol://getTrainingImage/', '')
      );
      try {
        return callback(url);
      } catch (e) {
        console.error(e);
        return callback('404');
      }
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);