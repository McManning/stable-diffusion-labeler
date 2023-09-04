import { useDispatch } from 'react-redux';
import { setActiveWorkspace } from '@/features/workspace';
import { Button } from '@mui/material';

export function OpenWorkspaceButton() {
  const dispatch = useDispatch();

  const onClick = async () => {
    const workspace = await window.backend.openWorkspace();
    if (!workspace) {
      return;
    }

    dispatch(setActiveWorkspace(workspace));
  };

  return <Button onClick={onClick}>Open a workspace</Button>;
}
