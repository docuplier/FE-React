import { useRef } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import Footer from "components/Layout/Footer";
import {
  BrandsSection,
  CTASection,
  EasyStepsSection,
  HeroSection,
  UseCasesSection,
} from "./components";

const Landing = () => {
  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Grid container direction="column">
      <Grid item sx={{ background: theme.palette.grey[600] }}>
        <HeroSection theme={theme} isMobile={matches} />
      </Grid>
      <Grid item sx={{ background: theme.palette.grey[500] }}>
        <UseCasesSection />
      </Grid>
      <Grid item sx={{ background: theme.palette.grey[500] }}>
        <EasyStepsSection theme={theme} isMobile={matches} />
      </Grid>
      <Grid item sx={{ background: theme.palette.primary.dark }}>
        <BrandsSection />
      </Grid>
      <Grid item sx={{ background: theme.palette.grey[500] }}>
        <CTASection theme={theme} isMobile={matches} />
      </Grid>
      <Grid item sx={{ background: theme.palette.grey[500] }}>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default Landing;
