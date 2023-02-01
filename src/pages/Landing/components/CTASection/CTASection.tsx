import { Button, Grid, Paper, Typography } from "@mui/material";
import { ILandingSection } from "interfaces";
import { useNavigate } from "react-router-dom";
import { paths } from "Routes";

const CTASection = ({ theme, isMobile }: ILandingSection) => {
  const navigate = useNavigate();
  return (
    <Grid container spacing={isMobile ? 0 : 10} p={isMobile ? 0 : 16}>
      <Grid item xs={12}>
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
                onClick={() => navigate(paths.CERTIFICATES_UPLOAD)}
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
