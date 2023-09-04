import { Stack, styled, ButtonBase } from '@mui/material';
import { MenuItemData, NestedDropdown } from '../MuiNestedMenu';
import { useCallback, useMemo } from 'react';
import { store } from '@/store';
import { setActiveWorkspace, updateWorkspace } from '@/features/workspace';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '@/hooks';
import { HeaderButton } from './HeaderButton';
import { Logo } from './Logo';

function createNewWorkspace() {
  store.dispatch(
    setActiveWorkspace({
      id: uuidv4(),
      name: 'New Workspace',
      folders: [],
      images: [],
    })
  );
}

function closeWorkspace() {
  store.dispatch(setActiveWorkspace(undefined));
}

async function addFolderToWorkspace() {
  const workspace = store.getState().workspace.activeWorkspace;
  if (!workspace) {
    return;
  }

  const updatedWorkspace = await window.backend.addFolderToWorkspace(workspace);
  store.dispatch(updateWorkspace(updatedWorkspace));
}

async function saveWorkspaceAs() {
  const workspace = store.getState().workspace.activeWorkspace;
  if (!workspace) {
    return;
  }

  const updatedWorkspace = await window.backend.saveWorkspaceAs(workspace);
  store.dispatch(updateWorkspace(updatedWorkspace));
}

function clearRecentWorkspaces() {
  window.electron.store.set('recentWorkspaces', []);
  // TODO: Need to tap React state updates
}

async function openWorkspace(path?: string) {
  const workspace = await window.backend.openWorkspace(path);
  if (!workspace) {
    return;
  }

  store.dispatch(setActiveWorkspace(workspace));
}

export function Header() {
  const workspace = useAppSelector((s) => s.workspace.activeWorkspace);

  const fileMenuData = useMemo<MenuItemData>(
    () => ({
      label: 'File',
      items: [
        {
          label: 'New Workspace',
          callback: () => createNewWorkspace(),
        },
        {
          label: '---',
        },
        {
          label: 'Open Workspace...',
          callback: () => openWorkspace(),
        },
        {
          label: 'Open Recent',
          items: [
            ...window.electron.store
              .get<string[]>('recentWorkspaces')
              .map<MenuItemData>((path) => ({
                label: path,
                callback: () => openWorkspace(path),
              })),
            {
              label: '---',
            },
            {
              label: 'Clear recently opened',
              callback: () => clearRecentWorkspaces(),
            },
          ],
        },
        {
          label: '---',
        },
        {
          label: 'Add Folder to Workspace...',
          callback: () => addFolderToWorkspace(),
        },
        {
          label: 'Save Workspace As...',
          callback: () => saveWorkspaceAs(),
        },
        {
          label: '---',
        },
        {
          label: 'Close Workspace',
          callback: () => closeWorkspace(),
        },
        {
          label: '---',
        },
        {
          label: 'Exit',
          callback: () => window.electron.mainWindow.exit(),
        },
      ],
    }),
    [workspace]
  );

  const helpMenuData = useMemo<MenuItemData>(
    () => ({
      label: 'Help',
      items: [
        {
          label: 'Toggle Developer Tools',
          callback: () => window.electron.mainWindow.openDevTools(),
        },
        {
          label: 'Reload UI',
          callback: () => window.electron.mainWindow.reload(),
        },
        {
          label: '---',
        },
        {
          label: 'About',
          callback: (event, item) => 0,
        },
      ],
    }),
    []
  );

  return (
    <Stack direction="row">
      <Logo />
      <HeaderButton menuItemsData={fileMenuData} />
      <HeaderButton menuItemsData={helpMenuData} />
    </Stack>
  );
}
