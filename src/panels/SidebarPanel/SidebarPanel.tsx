import { Panel } from '@/components/Panel';
import { useAppSelector } from '@/hooks';
import { ProjectPanel } from '../ProjectPanel';
import { SearchPanel } from '../SearchPanel';
import { Alert } from '@mui/material';

export function SidebarPanel() {
  const activeTab = useAppSelector((s) => s.workspace.activeTab);

  if (activeTab === 'project') {
    return <ProjectPanel />;
  }

  if (activeTab === 'search') {
    return <SearchPanel />;
  }

  return (
    <Panel>
      <Alert severity="error">No panel for active tab: {activeTab}</Alert>
    </Panel>
  );
}
