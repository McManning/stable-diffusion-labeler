
import { Box, styled } from '@mui/material';
import React from 'react';

const Root = styled(Box)(({ theme }) => ({
  height: 40,

}));

export function Header() {
  return (
    <Root>
      content
    </Root>
  )
}
