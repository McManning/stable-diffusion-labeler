import React from 'react';
import { VisuallyHidden } from "@osuresearch/ui";

export function SkipLink() {
  return (
    <VisuallyHidden>
      <a href="#content">Skip to main content</a>
    </VisuallyHidden>
  );
}
