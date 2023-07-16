import { WorkspaceState, setActiveTab } from "@/features/workspace";
import { useAppSelector } from "@/hooks";
import { ButtonBase, ButtonBaseProps, Tooltip, alpha, styled } from "@mui/material";
import { Icon } from "@osuresearch/iconography";
import { useDispatch } from "react-redux";

export interface SidebarButtonProps extends ButtonBaseProps {
  title: string
  icon: string
  active?: boolean
  tab: WorkspaceState['activeTab']
}

const Root = styled(ButtonBase)<SidebarButtonProps>(({ active, theme }) => ({
  padding: '8px 0px',
  color: alpha(theme.palette.action.active, 0.7),
  border: '2px solid transparent',
  borderLeftColor: active ? theme.palette.primary.main : undefined,
  '&:hover': {
    color: theme.palette.action.active,
  },
}));

export function SidebarButton(props: SidebarButtonProps) {
  const { title, tab, icon } = props;
  const activeTab = useAppSelector((s) => s.workspace.activeTab);
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(setActiveTab((tab)));
  }

  return (
    <Tooltip title={title} placement="right" arrow>
      <Root aria-label={title} {...props} onClick={onClick} active={activeTab === tab}>
        <Icon name={icon} size={24} />
      </Root>
    </Tooltip>
  )
}
