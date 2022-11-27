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
import LogoWhite from "assets/logo-white.svg";
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
        height: isMobile ? "100%" : "100vh",
        pb: theme.spacing(10),
      }}
    >
      <Grid
        container
        spacing={5}
        sx={{ height: "100%", pt: (theme) => theme.spacing(10) }}
      >
        <Grid item xs={12} sm={6} md={8} display="flex" height="70%">
          <Grid container spacing={4}>
            <Grid item>
              <img src={LogoWhite} alt="" width={isMobile ? 126.8 : "100%"} />
            </Grid>
            <Grid item>
              <Typography variant="h2" mb={theme.spacing(5)}>
                Personalize & Issue <br /> Certificates, Badges & Invitations
                For Free{" "}
              </Typography>
              <Typography variant="h4" mb={theme.spacing(5)}>
                No Sign Ups, No Credit Cards, Just Docuply it!
              </Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ maxWidth: 304 }}
                onClick={() => navigate(paths.CERTIFICATES_UPLOAD)}
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
