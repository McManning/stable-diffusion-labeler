import { Box, Button, CssBaseline, TextField, ThemeProvider, Toolbar, createTheme } from "@mui/material";
import { Navbar } from "./Navbar";
import { FlexLayout } from "./FlexLayout";

// declare module '@mui/material/styles' {
//   interface Theme {
//     status: {
//       danger: string;
//     };
//   }

//   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     status?: {
//       danger?: string;
//     };

//     overrides: Object,
//     props: Object
//   }
// }

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5893df',
    },
    secondary: {
      main: '#2ec5d3',
    },
    background: {
      default: '#192231',
      paper: '#24344d',
    },
  },
  typography: {
    fontFamily: '\'Inter Variable\', sans-serif'
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      }
    },
    MuiAppBar: {
      defaultProps: {
        color: 'inherit',
      },
      styleOverrides: {
        colorInherit: {
          backgroundColor: '#689f38',
          color: '#fff',
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      }
    },
  }
});

export function MuiDemo() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
        <Box sx={{
          width: '100vw',
          height: '100vh'
        }}>
          {/* <Navbar />
          <Toolbar />
          I am your content now.

          <Button variant="outlined">Hi</Button>
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
           */}
          <FlexLayout />
        </Box>
    </ThemeProvider>
  )
}
