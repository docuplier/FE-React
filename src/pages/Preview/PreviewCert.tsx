import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRef } from "react";
import Draggable from "react-draggable";
import { jsPDF } from "jspdf";
import { pxToRem } from "utils/pxToRem";
import html2canvas from "html2canvas";

const PreviewCert = ({
  fullName,
  isMobile,
  doc,
  selectedFont,
  onBackClick,
  dimension,
}: {
  fullName: string;
  isMobile: boolean;
  doc: string;
  selectedFont: string;
  onBackClick: () => void;
  imgSize: { height: number; width: number };
  dimension: {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
  };
}) => {
  const ref = useRef<HTMLDivElement>();
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const printDocument = (e: any) => {
    e.preventDefault();
    const input = document.getElementById("certificate-container");
    if (input) {
      html2canvas(input).then((canvas: any) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "JPEG", 0, 0, 0, 0);
        pdf.save("download.pdf");
      });
    }
  };
  return (
    <>
      <Box
        sx={{
          background: "#0B0D27",
          borderRadius: "12px",

          mt: 2,
        }}
        p={10}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: 600,
            mb: 4,
            alignSelf: "flex-start",
          }}
        >
          {fullName}'s Certificate
        </Typography>

        <Box ref={ref} position="relative" id="certificate-container">
          <img
            src={doc}
            style={{
              //  position: "relative",
              margin: "auto",
              textAlign: "center",
              objectFit: "contain",
            }}
            width={isMobile ? "280px" : "100%"}
            height={393}
          />
          <Box sx={{ position: "absolute", top: 0 }}>
            <Draggable
              axis="both"
              handle=".handle"
              position={undefined}
              nodeRef={draggableRef}
              grid={[1, 1]}
              disabled
              defaultPosition={{
                x: dimension?.x,
                y: dimension?.y,
              }}
              bounds={{
                left: dimension?.left,
                right: dimension?.right,
                top: dimension?.top,
                bottom: dimension.bottom,
              }}
              scale={1}
            >
              <div className="handle" ref={draggableRef}>
                {" "}
                <Box component="form" width="100%" height="100%">
                  <Box
                    width={{ xs: 200, sm: "100%", md: 351.5 }}
                    height="33px"
                    borderRadius="5px"
                    display="flex"
                    justifyContent="center"
                    textAlign="center"
                    alignItems="center"
                    sx={{
                      color: "#0B0D27",
                      border: "1px solid #3B4CF1",
                    }}
                  >
                    {" "}
                    <Typography
                      fontSize={{ sm: pxToRem(8), md: pxToRem(14) }}
                      sx={{
                        fontFamily: selectedFont,
                      }}
                      variant="body2"
                      // color="#8F9099"
                    >
                      {" "}
                      {fullName}
                    </Typography>
                  </Box>
                </Box>
              </div>
            </Draggable>
          </Box>
        </Box>
      </Box>

      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        marginTop="30px"
        sx={{
          flexWrap: "Wrap",
        }}
      >
        <Button
          sx={{
            height: "48px",
            border: "1px solid #fff",
            color: "#fff",
            px: 14,
            mb: 4,

            "@media screen and (max-width:768px)": {
              px: 6,
            },
            "&:hover": {
              border: "none",
            },
          }}
          onClick={onBackClick}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{
            //  width: "200px",
            height: "48px",
            px: 14,
            mb: 4,
            "@media screen and (max-width:768px)": {
              px: 6,
            },
          }}
          onClick={(e) => printDocument(e)}
        >
          Download PDF
        </Button>
      </Box>
    </>
  );
};

export default PreviewCert;
