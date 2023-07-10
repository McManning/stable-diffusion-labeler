
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { ipcMain } from 'electron';
import '@fontsource-variable/inter';

import { store } from '@/store';
import { FlexLayout } from '@/components/FlexLayout';

// import './App.css';
// import './App.rui.css';
import { theme } from './theme';

export default function App() {
  const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // useEffect(() => {
  //   // Ask the main process for user settings
  //   window.ipc.send('load-settings');

  //   ipcMain.handle()

  //   // On the main process loading user settings, apply to state.
  //   window.ipc.on('load-settings', (payload: any) => {

  //   });

  //   // On the main process changing working directory
  //   window.ipc.on('open-directory', (payload: any) => {
  //     // dispatch things
  //   });

  //   return () => {
  //     window.ipc.removeAllListeners('load-settings');
  //     window.ipc.removeAllListeners('open-directory');
  //   }
  // }, []);

  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Box sx={{
          width: '100vw',
          height: '100vh'
        }}>
          <FlexLayout />
        </Box>
      </ThemeProvider>
    </ReduxProvider>
  );
}
