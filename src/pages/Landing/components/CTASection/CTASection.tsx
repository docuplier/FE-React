import { Button, Grid, Paper, Typography } from "@mui/material";
import { ILandingSection } from "interfaces";
import { useNavigate } from "react-router-dom";
import { paths } from "Routes";

const CTASection = ({ theme, isMobile }: ILandingSection) => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      spacing={isMobile ? 0 : 10}
      p={isMobile ? 0 : 16}
      id="getApi"
    >
      <Grid item xs={12} md={12}>
        <Grid container sx={{ mt: isMobile ? 8 : "" }}>
          <Grid item xs={12} md={12} sx={{ px: isMobile ? 6 : 24, mb: 8 }}>
            <Typography variant={isMobile ? "h4" : "h2"}>
              Looking to automate your certificate and badge issuing process
              using our API?
            </Typography>
            <Typography
              my={8}
              // width={850}
              variant={isMobile ? "h6" : "h4"}
              sx={{ fontSize: isMobile ? "1rem" : "2rem", fontWeight: 600 }}
            >
              Reach out to us via support@docuplier.com, let’s get you plugged
              in.
            </Typography>
          </Grid>
        </Grid>
        <Paper
          elevation={0}
          sx={{
            background: theme?.palette.grey[600],
            p: isMobile ? 6 : 24,
            borderRadius: "12px",
            height: "346px",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "",
          }}
        >
          <Grid
            container
            spacing={4}
            sx={{
              display: isMobile ? "flex" : null,
              width: isMobile ? "100%" : null,
              justifyContent: isMobile ? "center" : null,
            }}
          >
            <Grid item xs={12} sm={12} md={8}>
              <Typography
                variant={isMobile ? "h4" : "h2"}
                sx={{ textAlign: isMobile ? "center" : "" }}
              >
                What are you waiting for?
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              sx={{
                display: isMobile ? "flex" : "",
                width: isMobile ? "100%" : "",
                justifyContent: isMobile ? "center" : "",
              }}
            >
              <Button
                size="large"
                variant="contained"
                fullWidth
                sx={{ maxWidth: 304, fontSize: "24px" }}
                onClick={() =>
                  navigate(paths.CERTIFICATES_UPLOAD, { state: { open: true } })
                }
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CTASection;
