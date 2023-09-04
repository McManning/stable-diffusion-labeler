import { Stack, styled, ButtonBase } from '@mui/material';

const Root = styled('div')(({ theme }) => ({
  background: 'red',
  padding: 8,
  fontSize: 12,
}));

export function Logo() {
  return <Root>Logo!</Root>;
}
