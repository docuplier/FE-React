import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  responsiveFontSizes,
  Theme,
  ThemeProvider,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import App from "./App";
import { storage } from "./utils/storage";
import { THEME_CACHE_KEY } from "./constants/storageCacheKeys";
import {
  FONT_FAMILY,
  themeOptions,
  TYPOGRAPHY,
} from "./constants/themeOptions";
import { BrowserRouter } from "react-router-dom";
import { pxToRem } from "utils/pxToRem";
import "./styles.css";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      cacheTime: 600000,
    },
    mutations: {
      useErrorBoundary: false,
    },
  },
});

const mode = storage.get(THEME_CACHE_KEY, "dark");

const themes = createTheme({
  typography: {
    fontFamily: FONT_FAMILY,
    ...TYPOGRAPHY,
  },
  spacing: (factor: number) => `${0.25 * factor}rem`,
  palette: {
    grey: {
      ...grey,
      500: "#101549",
      600: "linear-gradient(90.26deg, #101549 37.88%, #141E82 164.54%)",
      700: "#F3F4FF",
      800: "#8F9099",
      900: "#46474B",
    },
    warning: {
      main: "#F1BE3B",
      light: "rgba(241, 190, 59, 0.1)",
    },
    success: {
      main: "#6AF13B",
      light: "rgba(106, 241, 59, 0.1)",
    },
    error: {
      main: "#F13B3B",
      light: "rgba(241, 59, 59, 0.1)",
    },
    action: {
      disabledBackground: "rgba(59, 76, 241, 0.2)",
    },
    ...themeOptions(mode)?.palette,
    mode,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          borderRadius: "8px",
          boxShadow: "none",
          textTransform: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        sizeLarge: {
          fontSize: pxToRem(16),
        },
        containedPrimary: {
          color: "#fff",
          "&:hover": {
            opacity: 0.7,
            backgroundColor: themeOptions(mode)?.palette?.primary?.main,
            // backgroundColor: "white",
          },
          "&:active": {
            // backgroundColor: palette.primary.dark,
          },
        },
        outlinedPrimary: {
          color: "#fff",
          borderColor: themeOptions(mode)?.palette?.common?.white,
          "&:hover": {
            opacity: 0.7,
            borderColor: themeOptions(mode)?.palette?.common?.white,
            // backgroundColor: "white",
          },
          "&:active": {
            // backgroundColor: palette.primary.dark,
          },
        },
      },
    },
  },
});

const theme = responsiveFontSizes(themes);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <GlobalStyles
          styles={{
            scrollbarWidth: "thin",
            msOverflowStyle: "auto",
            "::-webkit-scrollbar": {
              display: "block",
              width: "4px",
              paddingBottom: "15rem",
              height: "5px !important",
              backgroundColor: "transparent",
            },

            "::-webkit-scrollbar-thumb": {
              backgroundColor: "#7682F5",
              borderRadius: "10px",
              height: "5px",
            },
          }}
        />
        <BrowserRouter>
          <App />
          <ToastContainer theme="dark" />
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
