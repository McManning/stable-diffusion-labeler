import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      // dark: '#111827',
      main: '#76a9fa',
    },
    secondary: {
      main: '#fac776',
    },
    background: {
      default: '#080B12',
      paper: '#1f2a37',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
      disabled: '#9ca3af',
    },
  },
  typography: {
    // fontSize: 12,
    fontFamily: '\'Inter Variable\', sans-serif',
    button: {
      textTransform: 'initial',
    },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "& *::-webkit-scrollbar": {
            backgroundColor: "transparent",
            width: '12px',
          },
          "& *::-webkit-scrollbar-thumb": {
            backgroundColor: "#6b6b6b",
            minHeight: 24,
          },
          "& *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "& *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "& *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "& *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '2px solid green',
            outlineOffset: '2px',
          },
        }
      }
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      }
    },
    MuiButtonGroup: {
      defaultProps: {
        disableRipple: true,
      }
    },
    MuiTooltip: {
      styleOverrides: {
        // TODO: Margin between the tooltip and the target.
        // Not sure what class it's in
        tooltip: {
          fontSize: 14,
          backgroundColor: 'black',
        },
        arrow: {
          color: 'black',
        }
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
    MuiLink: {
      defaultProps: {
        underline: 'always'
      }
    },
    MuiTabs: {
      defaultProps: {
        indicatorColor: 'primary',
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
