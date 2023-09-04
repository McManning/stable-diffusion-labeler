import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import '@fontsource-variable/inter';

import '@fontsource-variable/nunito-sans';
import '@fontsource/source-serif-pro';
import '@fontsource/source-serif-pro/900.css';

import { store } from '@/store';
import { FlexLayout } from '@/components/FlexLayout';

import { theme } from './theme';
import { Sidebar } from '@/components/Sidebar';
import { ContextMenu } from '@/components/ContextMenu';
import { Header } from '@/components/Header';

export default function App() {
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
        <Header />
        <Stack direction="row">
          <Sidebar />
          <FlexLayout />
          <ContextMenu />
        </Stack>
      </ThemeProvider>
    </ReduxProvider>
  );
}
