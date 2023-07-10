// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const electronHandler = {
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

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
});

// Workspace management API
contextBridge.exposeInMainWorld('workspace', {
  open: () => ipcRenderer.invoke('workspace:open'),
  save: (workspace: Workspace) => ipcRenderer.invoke('workspace:save', workspace),
  saveAs: (workspace: Workspace) => ipcRenderer.invoke('workspace:save-as', workspace),
  addFolder: (workspace: Workspace) => ipcRenderer.invoke('workspace:add-folder', workspace),
})

contextBridge.exposeInMainWorld('tags', {
  generate: (workspace: Workspace) => ipcRenderer.invoke('tags:generate', workspace),
  save: (image: TrainingImage) => ipcRenderer.invoke('image:save-tags', image),
});

contextBridge.exposeInMainWorld('images', {
  delete: (image: TrainingImage) => ipcRenderer.invoke('image:delete', image),
});


export type ElectronHandler = typeof electronHandler;
