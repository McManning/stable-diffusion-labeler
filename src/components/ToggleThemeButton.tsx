import { IconButton, useTheme } from '@osuresearch/ui';

// One day I'll add this to RUI...
export function ToggleThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <IconButton
      label="Toggle theme"
      size={20}
      p="sm"
      name={theme === 'light' ? 'moon' : 'sun'}
      onPress={
        () => setTheme(theme === 'light' ? 'dark' : 'light')
      }
    />
  );
}
