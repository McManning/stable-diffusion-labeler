import { createRoot } from 'react-dom/client';
import App from './App';
import { store } from '@/store';
import { setActiveWorkspace, updateWorkspace } from '@/features/workspace';
import { v4 as uuidv4 } from 'uuid';
import { loadAllIcons } from '@/icons';

loadAllIcons();

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);


// Events sent from main/menu.ts

window.electron.ipcRenderer.on('workspace:new', async () => {
  store.dispatch(setActiveWorkspace({
    id: uuidv4(),
    name: 'New Workspace',
    folders: [],
    images: [],
  }))
});

window.electron.ipcRenderer.on('workspace:add-folder', async () => {
  const workspace = store.getState().workspace.activeWorkspace;
  if (!workspace) {
    return;
  }

  const updatedWorkspace = await window.workspace.addFolder(workspace);
  store.dispatch(updateWorkspace(updatedWorkspace));
});

window.electron.ipcRenderer.on('workspace:open', async (event, data) => {
  const workspace = await window.workspace.open();
  if (!workspace) {
    return;
  }

  store.dispatch(setActiveWorkspace(workspace));
});

window.electron.ipcRenderer.on('workspace:save-as', async () => {
  const workspace = store.getState().workspace.activeWorkspace;
  if (!workspace) {
    return;
  }

  const updatedWorkspace = await window.workspace.saveAs(workspace);
  store.dispatch(updateWorkspace(updatedWorkspace));
});
