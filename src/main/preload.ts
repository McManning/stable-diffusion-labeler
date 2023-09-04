// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { createMainWorldApi, SHARED_FUNCTIONS } from './events/shared';

const electronHandler = {
  store: {
    // TODO: Strict typing to electron-store keys. This kind of sucks.
    // Guidance from https://electron-react-boilerplate.js.org/docs/electron-store
    get<T>(key: string) {
      return ipcRenderer.sendSync('electron-store-get', key) as T;
    },
    set<T extends any>(property: string, value: T) {
      ipcRenderer.send('electron-store-set', property, value);
    },
  },
  mainWindow: {
    toggleFullScreen() {
      ipcRenderer.send('toggle-full-screen');
    },
    exit() {
      ipcRenderer.send('exit');
    },
    reload() {
      ipcRenderer.send('reload');
    },
    openDevTools() {
      ipcRenderer.send('open-devtools');
    },
  },
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

// contextBridge.exposeInMainWorld('backend', createEventMap(ipcRenderer.invoke));
contextBridge.exposeInMainWorld(
  'backend',
  createMainWorldApi(SHARED_FUNCTIONS, ipcRenderer.invoke)
);

export type ElectronHandler = typeof electronHandler;
