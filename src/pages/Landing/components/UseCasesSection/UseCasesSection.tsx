import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import certificate from "assets/certificate.svg";
import badge from "assets/badge.svg";
import tag from "assets/tag.svg";
import invitation from "assets/invitation.svg";

const data = [
  {
    logo: certificate,
    title: "Certificates",
    description:
      "Diam senectus eleifend nunc id sem dictum. Aliquet mauris consectetur eu dignissim et congue odio. Enim, viverra interdum iaculis diam.",
  },
  {
    logo: badge,
    title: "Badges",
    description:
      "Diam senectus eleifend nunc id sem dictum. Aliquet mauris consectetur eu dignissim et congue odio. Enim, viverra interdum iaculis diam.",
  },
  {
    logo: tag,
    title: "Tags",
    description:
      "Diam senectus eleifend nunc id sem dictum. Aliquet mauris consectetur eu dignissim et congue odio. Enim, viverra interdum iaculis diam.",
  },
  {
    logo: invitation,
    title: "Invitations",
    description:
      "Diam senectus eleifend nunc id sem dictum. Aliquet mauris consectetur eu dignissim et congue odio. Enim, viverra interdum iaculis diam.",
  },
];

const UseCasesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Grid
      container
      spacing={10}
      p={16}
      // pl="12rem"
      // pr="12rem"
      sx={{
        pl: isMobile ? 0 : "10rem",
        pr: isMobile ? 0 : "9rem",
      }}
      //  sx={{ width: "100%" }}
      display="flex"
      justifyContent="center"
    >
      <Grid
        item
        // width=   "100%"
        sx={{
          display: "flex",
          justifyContent: "center",
          "& .MuiGrid-item": {
            pl: "0px",
          },
        }}
      >
        <Typography variant="h1" textAlign="center" sx={{ pl: 0 }}>
          Use Cases
        </Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={20} sx={{}}>
          {data.map((v) => (
            <Grid
              key={v.title}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              sx={{ ml: isMobile ? 4 : "", mr: isMobile ? 2 : "" }}
              // sx={{
              //   backgroundColor: "red",
              // }}
            >
              <Box>
                <img src={v.logo} alt="" />
              </Box>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  mb: isMobile ? "10px" : "16px",
                  mt: isMobile ? "10px" : "30px",
                }}
              >
                {v.title}
              </Typography>

              <Typography
                variant={isMobile ? "body2" : "body1"}
                textAlign="center"
              >
                {v.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UseCasesSection;
