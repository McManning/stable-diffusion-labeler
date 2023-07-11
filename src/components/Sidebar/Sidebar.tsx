import { ButtonBase, ButtonBaseProps, IconButton, Stack, Tooltip, alpha, styled } from "@mui/material";
import { Icon } from "@osuresearch/iconography";
import { SidebarButton } from "./SidebarButton";

const Root = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 44,
  borderRight: `1px solid #374151`, // TODO: add to palette
}));


export function Sidebar() {
  return (
    // Tagging, Sketching, Settings
    <Root>
      <SidebarButton title="Project" icon="project" active />
      <SidebarButton title="Search" icon="find"  />
      <SidebarButton title="Sketch" icon="sketch" />
    </Root>
  )
}
