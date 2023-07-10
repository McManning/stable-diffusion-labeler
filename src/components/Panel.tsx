import { Box, BoxProps, styled } from "@mui/material";

export interface PanelProps extends BoxProps {
  focused?: boolean
}

export const Panel = styled(Box)<PanelProps>(({ focused, theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  width: '100%',
  display: 'flex',
}));
