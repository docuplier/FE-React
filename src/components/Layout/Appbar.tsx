import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import { cloneElement } from "react";
import LogoWhite from "assets/beta logo.png";
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return cloneElement(children, {
    elevation: trigger ? 2 : 0,
  });
}

const Appbar = () => {
  return (
    <ElevationScroll>
      <AppBar position="fixed">
        <Toolbar variant="dense" sx={{}}>
          {/* <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
          <Container>
            <Box pt={2}>
              <img src={LogoWhite} alt="" height="40" />
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
};

export default Appbar;
