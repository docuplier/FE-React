import {
  Box,
  Button,
  Container,
  Grid,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import heroImg from "assets/hero-img.svg";
import LogoWhite from "assets/beta logo.png";
import { useNavigate } from "react-router-dom";
import { paths } from "Routes";

const HeroSection = ({
  theme,
  isMobile,
}: {
  theme: Theme;
  isMobile: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <Container
      sx={{
        height: isMobile ? "100%" : "90vh",
        width: isMobile ? "95%" : "100%",
        pb: theme.spacing(10),
        // ml: isMobile ? 2 : "",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={5}
        sx={{ height: "100%", pt: (theme) => theme.spacing(12) }}
      >
        <Grid item xs={12} sm={6} md={8} display="flex" height="70%">
          <Grid container spacing={4}>
            <Grid item>
              <img src={LogoWhite} alt="" width={"60%"} height={"100%"} />
            </Grid>
            <Grid item sx={{ mt: isMobile ? 2 : 15 }}>
              <Typography variant="h2" mb={theme.spacing(5)}>
                Effortlessly Generate & Personalize Certificates, Badges, and
                Invitations
              </Typography>
              <Typography variant="h4" mb={theme.spacing(12)} mt={"30px"}>
                Easy, Fast & Free
              </Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  maxWidth: 290,
                  height: 56,
                  fontSize: "24px",
                  mt: "20px",
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
          <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
            <img src={heroImg} alt="" width="100%" />
          </Grid>
        )}
      </Grid>
      <Box />
    </Container>
  );
};

export default HeroSection;
