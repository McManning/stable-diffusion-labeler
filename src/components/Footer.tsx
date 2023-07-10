import React from 'react';
import { Box, Text, useTheme } from '@osuresearch/ui';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <Box as="footer" gridArea="footer" bgc="light" p="sm">
      <Text>{theme === 'light' ? '💖' : '✨'} Chase McManning &times; Stable Diffusion</Text>
    </Box>
  )
}