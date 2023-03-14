import {
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { ILandingSection } from "interfaces";
import React, { Fragment } from "react";
import { pxToRem } from "utils/pxToRem";
import Number1 from "assets/1.svg";
import Number2 from "assets/2.svg";
import Number3 from "assets/3.svg";
import Number4 from "assets/4.svg";

const EasyStepsSection = ({ theme, isMobile }: ILandingSection) => {
  const data = [
    {
      itemNumber: (
        <img
          src={Number1}
          alt="Number 1"
          width={isMobile ? "75px" : "120px"}
          height={isMobile ? "102px" : "200px"}
        />
      ),
      description: isMobile
        ? "Upload Design: Select and upload the design file for your certificate, badge, name tag, or invitation card."
        : "Upload Design: Select and upload the design file for your certificate, badge, name tag, or invitation card.",
    },
    {
      itemNumber: "",
      description: "",
    },
    {
      itemNumber: "",
      description: "",
    },

    {
      itemNumber: (
        <img
          src={Number2}
          alt="Number 2"
          width={isMobile ? "75px" : "120px"}
          height={isMobile ? "102px" : "200px"}
        />
      ),
      description: isMobile
        ? " Customize Design: Add a text field for the recipient's name and move it to your desired position on the document"
        : " Customize Design: Add a text field for the recipient's name and move it to your desired position on the document",
    },
    {
      itemNumber: (
        <img
          src={Number3}
          alt="Number 3"
          width={isMobile ? "75px" : "120px"}
          height={isMobile ? "102px" : "200px"}
        />
      ),
      description:
        "Upload Name List: Use the provided template to upload a spreadsheet of names and other details for the recipients",
    },
    {
      itemNumber: "",
      description: "",
    },
    {
      itemNumber: "",
      description: "",
    },

    {
      itemNumber: (
        <img
          src={Number4}
          alt="Number 4"
          width={isMobile ? "75px" : "120px"}
          height={isMobile ? "102px" : "200px"}
        />
      ),
      description:
        "Preview & Send: Preview the final document to ensure accuracy and formatting before sending.",
    },
    {
      itemNumber: "",
      description: "",
    },
  ];

  return (
    <Grid
      container
      spacing={10}
      p={isMobile ? 4 : 16}
      sx={{ pl: isMobile ? 4 : "10rem", pr: isMobile ? 4 : "10rem" }}
    >
      <Grid item width="100%">
        <Typography variant="h2" textAlign="center">
          Just 4 Easy Steps
        </Typography>
      </Grid>
      <Grid item>
        <Grid
          container
          rowSpacing={10}
          justifyContent="center"
          alignItems="center"
        >
          {data.map((v) => {
            return isMobile && !v.itemNumber ? undefined : (
              <Grid
                key={v.description}
                item
                xs={12}
                md={6}

                // pl={10}
                // pr={10}
              >
                <Grid container alignItems="center">
                  <Grid item xs={3} md={2}>
                    {/* <Typography
                      // variant="h1"
                      // fontSize={isMobile ? pxToRem(124) : pxToRem(200)}
                      color="#101549"
                      sx={{
                        textShadow:
                          "-6px -6px 8px rgba(255, 255, 255, 0.1), -2px -2px 2px rgba(255, 255, 255, 0.05), 1px 1px 2px rgba(11, 13, 39, 0.25), 8px 4px 12px rgba(11, 13, 39, 0.25)",
                      }}
                    > */}
                    <Box> {v.itemNumber}</Box>
                    {/* </Typography> */}
                  </Grid>
                  <Grid item xs={9} md={10}>
                    <Typography
                      variant="subtitle1"
                      fontSize={isMobile ? "16px" : "24px"}
                      ml={isMobile ? "0" : "50px"}
                    >
                      {v.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EasyStepsSection;
