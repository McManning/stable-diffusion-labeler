import { Button } from "@osuresearch/ui";

declare global {
  interface Window {
    darkMode: {
      toggle: () => void;
      system: () => void;
    }
  }
}

export function ThemeButton() {
  return (
    <>
    <Button onPress={() => {
      window.darkMode.toggle();
    }}>Toggle dark mode</Button>
    <Button onPress={() => {
      window.darkMode.system();
    }}>Toggle system mode</Button>
</>
  )
}
