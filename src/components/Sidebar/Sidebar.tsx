import { Stack, styled } from "@mui/material";
import { SidebarButton } from "./SidebarButton";

const Root = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 44,
  borderRight: `1px solid #374151`, // TODO: add to palette
}));

export function Sidebar() {
  return (
    <Root>
      <SidebarButton title="Project" icon="project" tab="project" />
      <SidebarButton title="Search" icon="find" tab="search" />
      <SidebarButton title="Doodle" icon="sketch" tab="doodle" />
    </Root>
  )
}
