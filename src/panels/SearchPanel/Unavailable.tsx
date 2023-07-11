import { Panel } from "@/components/Panel";
import { Typography } from "@mui/material";

export function Unavailable() {
  return (
    <Panel p={3} justifyContent="center">
      <Typography color="text.secondary">Open a workspace to search</Typography>
    </Panel>
  )
}
