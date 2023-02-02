import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextareaAutosize,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Document, Page } from "react-pdf";
import { useNavigate, useOutletContext } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { paths } from "Routes";
import { styled } from "@mui/material";
// @ts-ignore
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
// @ts-ignore
import { FONTS } from "constants/appConstants";
import { pxToRem } from "utils/pxToRem";
import borderImg from "../../assets/border.png";
import { getPathByName } from "utils/getPathsByName";

const AddText = () => {
  const [dimension, setDimension] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [bound, setBound] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
  });
  const [displayTextBox, setDisplayTextBox] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]?.value);
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>();
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const context: any = useOutletContext();
  const val = ref?.current?.getBoundingClientRect();
  const draggableVal = draggableRef?.current?.getBoundingClientRect();

  const eventLogger = (e: DraggableEvent, data: DraggableData) => {
    const left =
      val?.left! > draggableVal?.left!
        ? val?.left! - draggableVal?.left!
        : draggableVal?.left! - val?.left!;
    const right =
      val?.right! > draggableVal?.right!
        ? val?.right! - draggableVal?.right!
        : draggableVal?.right! - val?.right!;
    const bottom =
      val?.bottom! > draggableVal?.bottom!
        ? val?.bottom! - draggableVal?.bottom!
        : draggableVal?.bottom! - val?.bottom!;
    const top =
      val?.top! > draggableVal?.top!
        ? val?.top! - draggableVal?.top!
        : draggableVal?.top! - val?.top!;
    const x =
      val?.x! > draggableVal?.x!
        ? val?.x! - draggableVal?.x!
        : draggableVal?.x! - val?.x!;
    const y =
      val?.y! > draggableVal?.y!
        ? val?.y! - draggableVal?.y!
        : draggableVal?.y! - val?.y!;

    setDimension({
      left,
      right,
      bottom,
      top,
      x,
      y,
      width: val?.width!,
      height: val?.height!,
    });
  };

  const handleTextBox = () => {
    setDisplayTextBox(true);
    setBound({
      left: val?.left!,
      right: val?.right!,
      top: val?.top!,
      bottom: val?.bottom!,
      x: val?.x!,
      y: val?.y!,
    });
  };

  React.useEffect(() => {
    context?.setCurrentStep(1);
  }, []);

  const handleFontChange = (evt: any) => {
    const val = evt.target.value;
    setSelectedFont(val);
  };

  console.log(context?.uploaded?.doc);

  return (
    <Stack spacing={12}>
      <Box display="flex" width="100%" justifyContent="center">
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          sx={{
            //  backgroundColor: "red",
            "@media screen and (max-width:768px)": {
              width: "100%",
            },
          }}
          //   flexWrap="wrap"
        >
          {" "}
          <Box display="flex" alignItems="flex-end" mx={6}>
            {" "}
            <Button
              variant="contained"
              fullWidth={isMobile}
              sx={{
                height: "48px",
                px: isMobile ? 4 : 12,
              }}
              onClick={() => handleTextBox()}
            >
              {isMobile ? "Add Text" : "Add A Text Box"}
            </Button>
          </Box>
          <Box mx={6} width="28%">
            <Typography variant="body2">Select Font</Typography>
            <FormControl fullWidth size="small">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFont}
                onChange={handleFontChange}
                sx={{
                  height: "48px",
                }}
                MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
                IconComponent={KeyboardArrowDownIcon}
              >
                {FONTS.map((font: any) => (
                  <MenuItem key={font.value} value={font.value}>
                    {font.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        className="long-dashed-border"
      >
        <Box ref={ref} position="relative">
          {context?.uploaded?.dataFile?.type === "application/pdf" ? (
            <Document file={context?.uploaded?.doc}>
              <Page />
            </Document>
          ) : (
            <img
              src={context?.uploaded?.doc}
              style={{
                position: "relative",
                margin: "auto",
                textAlign: "center",
                objectFit: "contain",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
              // width={isMobile ? "280px" : "555px"}
              // height="393px"
            />
          )}
          <Box
            //  component="span"
            width="60%"
            sx={{ position: "absolute", top: 0 }}
            //  ref={draggableRef}
          >
            {displayTextBox && (
              <Draggable
                axis="both"
                handle=".handle"
                position={undefined}
                nodeRef={draggableRef}
                grid={[1, 1]}
                bounds={{
                  left: 0,
                  right: val?.width! - draggableVal?.width!,
                  top: 0,
                  bottom: val?.height! - draggableVal?.height!,
                }}
                scale={1}
                // onStart={eventLogger}
                onDrag={eventLogger}
                onStop={eventLogger}
              >
                <div className="handle" ref={draggableRef}>
                  {" "}
                  <Box component="form" width="100%" height="100%">
                    <Box
                      // width={{ xs: 200, sm: "100%", md: 351.5 }}
                      // height="33px"
                      borderRadius="5px"
                      // display="flex"
                      // justifyContent="center"
                      textAlign="center"
                      // alignItems="center"
                      sx={{
                        cursor: "move",
                        border: "1px solid #3B4CF1",
                        color: "#0B0D27",
                        p: 1,
                      }}
                    >
                      {" "}
                      <Typography
                        fontSize={{
                          xs: pxToRem(10),
                          sm: pxToRem(16),
                          md: pxToRem(18),
                        }}
                        sx={{
                          fontFamily: selectedFont,
                          fontWeight: 800,
                        }}
                        variant="h1"
                        // color="#8F9099"
                      >
                        {" "}
                        JEFFERSON KENNEDY THOMPSON
                      </Typography>
                    </Box>
                  </Box>
                </div>
              </Draggable>
            )}
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
          onClick={() => {
            navigate(getPathByName(context.activeTab, 0));
          }}
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
          disabled={!displayTextBox}
          onClick={() => {
            context?.setUploaded((prev: any) => ({
              ...prev,
              dimension,
              selectedFont,
            }));
            navigate(getPathByName(context.activeTab, 2));
          }}
        >
          Continue
        </Button>
      </Box>
    </Stack>
  );
};

export default AddText;

const InputField = styled(TextareaAutosize)({
  borderRadius: "5px",
});
