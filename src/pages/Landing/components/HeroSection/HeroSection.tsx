import {
  Box,
  Button,
  Container,
  Grid,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Drawer,
  IconButton,
} from "@mui/material";
import React, { useRef } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import heroImg from "assets/hero-img.svg";
import LogoWhite from "assets/beta logo.png";
// import LogoWhite from "assets/grouplogo.svg";
import { useNavigate } from "react-router-dom";
import * as Scroll from "react";
import { paths } from "Routes";
import { animateScroll as scroll } from "react-scroll";
import { useOutletContext } from "react-router-dom";

const HeroSection = ({
  theme,
  isMobile,
}: {
  theme: Theme;
  isMobile: boolean;
}) => {
  const context: any = useOutletContext();
  const themeMobile = useTheme();

  const matchesMobile = useMediaQuery(themeMobile.breakpoints.down("md"));
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);
  // const targetRef = useRef(null);
  const navigate = useNavigate();

  const scrollTo = () => {
    const targetElement = document.getElementById("easy4");
    if (targetElement) {
      const targetPosition = targetElement?.offsetTop;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };
  const scrollToApi = () => {
    const targetElement = document.getElementById("getApi");
    if (targetElement) {
      const targetPosition = targetElement?.offsetTop;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  const toggleDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    // <Container
    //   sx={{
    //     // height: isMobile ? "100%" : "90vh",
    //     // width: isMobile ? "95%" : "100%",
    //     pb: theme.spacing(10),
    //     // ml: isMobile ? 2 : "",
    //     display: "flex",
    //     justifyContent: "center",
    //   }}
    // >
    <Grid
      container
      // spacing={4}
      sx={{
        height: isMobile ? "100%" : "98vh",
        width: isMobile ? "95%" : "100%",
        pt: (theme) => theme.spacing(10),
        px: isMobile ? "1.5rem" : "5rem",
        justifyContent: "space-between",
        display: "flex",
        // backgroundColor: "red",
      }}
    >
      <Grid item md={12}>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 8,
            alignItems: "center",
          }}
        >
          <Grid item xs={8} md={4}>
            <img src={LogoWhite} alt="" width={"50%"} height={"100%"} />
          </Grid>
          {matchesMobile ? (
            <Grid sx={{ cursor: "pointer" }}>
              <Box
                onClick={() => {
                  setOpenDrawer(true);
                }}
              >
                <MenuIcon />
              </Box>
              <Drawer
                // sx={{ width: "400px", mt: 4 }}
                sx={{
                  [`& .MuiDrawer-paper`]: {
                    height: "250px",
                  },
                }}
                anchor="right"
                open={openDrawer}
                onClose={toggleDrawer}
              >
                <Box p={8} height="100px" display="flex" flexDirection="column">
                  <Button
                    sx={{
                      fontSize: "10px",
                      mb: 4,
                      color: "#fff",
                    }}
                    variant="text"
                    onClick={() => {
                      scrollTo();
                      toggleDrawer();
                    }}
                  >
                    How it Works
                  </Button>
                  <Button
                    sx={{
                      fontSize: "10px",
                      mb: 4,
                      color: "#fff",
                    }}
                    onClick={() => {
                      scrollToApi();
                      toggleDrawer();
                    }}
                  >
                    Get the API
                  </Button>
                  <Button
                    sx={{
                      fontSize: "10px",
                      mb: 4,
                      color: "#fff",
                    }}
                    variant="text"
                    onClick={() => {
                      toggleDrawer();
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    sx={{
                      fontSize: "10px",
                      mb: 4,
                      color: "#fff",
                    }}
                    variant="text"
                    onClick={() => {
                      toggleDrawer();
                      navigate(paths.CERTIFICATES_UPLOAD, {
                        state: { open: true },
                      });
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </Drawer>
            </Grid>
          ) : (
            <Grid sx={{ mt: isMobile ? "20px" : "" }}>
              <Button
                sx={{ mr: 8, color: "white", mb: isMobile ? 2 : "" }}
                size="medium"
                onClick={scrollTo}
              >
                How it works
              </Button>
              <Button
                sx={{ mr: 8, color: "white", mb: isMobile ? 2 : "" }}
                size="medium"
                onClick={scrollToApi}
              >
                Get the Api
              </Button>
              <Button
                variant="outlined"
                sx={{ mr: 8, px: 8, mb: isMobile ? 2 : "" }}
                size="medium"
                // onClick={() => navigate(paths.SIGNIN)}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ mb: isMobile ? 2 : "" }}
                size="medium"
                onClick={() =>
                  navigate(paths.CERTIFICATES_UPLOAD, { state: { open: true } })
                }
              >
                Get Started
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={8}
        // sx={{ mt: isMobile ? 0 : 14 }}
        display="flex"
        // sx={{ backgroundColor: "red" }}
        height="70%"
      >
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={12}
            sx={{ mt: isMobile ? 2 : 0, mr: isMobile ? 0 : "1rem" }}
          >
            <Typography variant="h2" mb={theme.spacing(5)}>
              Effortlessly Generate & Personalize Certificates, Badges, and
              Invitations
            </Typography>
            <Typography>
              Send, issue or download up to 250 copies to boast your trainings,
              events and programs.
            </Typography>
            <Typography>
              They are easily shareable on linkedin, via emails and WhatsApp.
            </Typography>
            <Typography>
              Manage the entire process from an easy to use dashboard.
            </Typography>
            <Typography variant="h4" mb={theme.spacing(10)} mt={"30px"}>
              Easy, Fast & Free !!!
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                maxWidth: 290,
                height: 56,
                fontSize: isMobile ? "18px" : "24px",
                // mt: "5px",
              }}
              onClick={() =>
                navigate(paths.CERTIFICATES_UPLOAD, { state: { open: true } })
              }
            >
              Start for Free
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {!isMobile && (
        <Grid item xs={6} sm={6} md={3.5} display="flex" alignItems="center">
          <img src={heroImg} alt="" width="100%" />
        </Grid>
      )}
    </Grid>

    // {/* <Box /> */}
    // </Container>
  );
};

export default HeroSection;
