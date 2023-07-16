import { styled, ToggleButton, ToggleButtonProps } from "@mui/material";
import { Icon } from "@osuresearch/iconography";

export interface ToolButtonProps extends ToggleButtonProps {
  icon: string
}

const Root = styled(ToggleButton)(({ theme }) => ({

}));

export function ToolButton({ value, icon, ...props }: ToolButtonProps) {
  return (
    <Root {...props} value={value} aria-label={`${value} tool`}>
      <Icon name={icon} size={24} />
    </Root>
  )
}
