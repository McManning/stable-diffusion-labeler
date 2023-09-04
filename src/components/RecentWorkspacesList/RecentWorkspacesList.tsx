import { setActiveWorkspace } from '@/features/workspace';
import { Stack, Link, Typography, Button, Divider } from '@mui/material';
import { useDispatch } from 'react-redux';

function getWorkspaceName(path: string) {
  const normalized = path.replaceAll('\\', '/');

  return normalized.substring(
    normalized.lastIndexOf('/') + 1,
    path.length - 16
  );
}

export function RecentWorkspacesList() {
  const dispatch = useDispatch();

  const recentWorkspaces = window.electron.store.get(
    'recentWorkspaces'
  ) as string[];

  const onOpenWorkspace = async (path: string) => {
    const workspace = await window.backend.openWorkspace(path);
    if (!workspace) {
      return;
    }

    dispatch(setActiveWorkspace(workspace));
  };

  const onClear = () => {
    window.electron.store.set('recentWorkspaces', []);
  };

  return (
    <Stack p={1} gap={1}>
      <Typography>Recent workspaces</Typography>
      {recentWorkspaces.length < 1 && (
        <Typography fontSize={14} color="text.secondary">
          No recent workspaces
        </Typography>
      )}
      <Stack>
        {recentWorkspaces.map((path) => (
          <Link
            component="button"
            sx={{ textAlign: 'left' }}
            key={path}
            onClick={() => onOpenWorkspace(path)}
          >
            {getWorkspaceName(path)}
          </Link>
        ))}
      </Stack>
      <Divider />
      <Link
        color="text.secondary"
        component="button"
        sx={{ textAlign: 'left' }}
        onClick={onClear}
      >
        Clear recent workspaces
      </Link>
    </Stack>
  );
}
