import { Button } from '@mui/material';

export function ThemeButton() {
  return (
    <>
      <Button
        onClick={() => {
          window.backend.toggleDarkMode();
        }}
      >
        Toggle dark mode
      </Button>
      <Button
        onClick={() => {
          window.backend.activateSystemTheme();
        }}
      >
        Toggle system mode
      </Button>
    </>
  );
}
