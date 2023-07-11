import { ButtonBase, ButtonBaseProps, Tooltip, alpha, styled } from "@mui/material";
import { Icon } from "@osuresearch/iconography";

export interface SidebarButtonProps extends ButtonBaseProps {
  title: string
  icon: string
  active?: boolean
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
  const { title, icon } = props;

  return (
    <Tooltip title={title} placement="right" arrow>
      <Root aria-label={title} {...props}>
        <Icon name={icon} size={24} />
      </Root>
    </Tooltip>
  )
}
