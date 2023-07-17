import { Stack, StackProps, styled } from "@mui/material";

export interface PanelProps extends StackProps {
  focused?: boolean
}

export const Panel = styled(Stack)<PanelProps>(({ focused, theme }) => ({
  justifyContent: 'start',
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  width: '100%',
  padding: 16,
}));
