import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  hexToRgb,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// @ts-ignore
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
// @ts-ignore
import {
  FONTS,
  FONTSSIZE,
  FONTCAPITALIZE,
  FONTSTYLE,
} from "constants/appConstants";
import { useQuery } from "react-query";
import { getPathByName } from "utils/getPathsByName";
import { useImageSize } from "react-image-size";
import { fetchIndenpontencyKey } from "services/documents";

const AddText = () => {
  const [width, setWidth] = React.useState(0);
  const [images, setImages] = React.useState<string[]>([]);
  const [height, setHeight] = React.useState(0);

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
  const [selectedFontStyle, setSelectedFontStyle] = useState(
    FONTSTYLE[0]?.value
  );
  const [selectedFontCase, setSelectedFontCase] = useState(
    FONTCAPITALIZE[0]?.value
  );
  const [cssSelectedFontCase, setCSSSelectedFontCase] = useState("uppercase");
  const [selectedFontSize, setSelectedFontSize] = useState(FONTSSIZE[3]?.value);
  const [showStyleBtns, setShowStyleBtns] = useState(false);

  const [colorChange, setColorChange] = useState(hexToRgb("#000000"));
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>();
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile2 = useMediaQuery(theme.breakpoints.down("md"));
  const context: any = useOutletContext();
  const val = ref?.current?.getBoundingClientRect();
  const draggableVal = draggableRef?.current?.getBoundingClientRect();

  const { data: documentData, isFetching: isFetchingIndenPontencyKey } =
    useQuery("idempotencyKeyValue", fetchIndenpontencyKey);
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
        : draggableVal?.bottom! + val?.bottom!;
    const top =
      val?.top! > draggableVal?.top!
        ? val?.top! - draggableVal?.top!
        : draggableVal?.top! - val?.top!;
    const x =
      val?.x! > draggableVal?.x!
        ? val?.x! - draggableVal?.x!
        : draggableVal?.x! - val?.x!;
    const y =
      // data?.lastY - height - 12;
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
      top: val?.top! + 30,
      bottom: 0,
      x: val?.x!,
      y: 0,
    });
  };

  const handleCssFontCapitalize = () => {
    switch (selectedFontCase) {
      case "lower-case":
        setCSSSelectedFontCase("lowercase");
        break;
      case "upper-case":
        setCSSSelectedFontCase("uppercase");
        break;
      case "sentence-case":
        setCSSSelectedFontCase("capitalize");
        break;
      default:
        setCSSSelectedFontCase("uppercase");
    }
  };

  const handleIncreaseFontSize = () => {
    const result = selectedFontSize + 1;
    if (selectedFontSize === 40) {
      setSelectedFontSize(40);
    } else {
      setSelectedFontSize(result);
    }
  };

  const handleDecreaseFontSize = () => {
    const result = selectedFontSize - 1;
    if (selectedFontSize == 10) {
      setSelectedFontSize(10);
    } else {
      setSelectedFontSize(result);
    }
  };

  const handleColorChange = (e: any) => {
    setColorChange(hexToRgb(e.target.value)); // You can access the selected color data here
  };

  async function renderPage() {
    const imagesList: string[] = [];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("className", "canv");

    for (let i = 1; i <= context?.uploaded?.pdfDoc?.numPages; i++) {
      var page = await context?.uploaded?.pdfDoc?.getPage(i);
      var viewport = page.getViewport({ scale: 1 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      var render_context = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      };
      setWidth(viewport.width);
      setHeight(viewport.height);
      await page.render(render_context).promise;
      let img = canvas.toDataURL("image/png");
      imagesList.push(img);
    }
    context?.setUploaded((prev: any) => ({
      ...prev,
      doc: imagesList[0],
    }));
  }

  React.useEffect(() => {
    context?.setCurrentStep(1);

    if (context?.uploaded?.dataFile?.type === "application/pdf") renderPage();
  }, []);

  const handleFontChange = (evt: any) => {
    const val = evt.target.value;
    setSelectedFont(val);
  };

  const handleFontStyleChange = (evt: any) => {
    const val = evt.target.value;
    setSelectedFontStyle(val);
  };

  const handleFontSizeChange = (evt: any) => {
    const val = evt.target.value;
    setSelectedFontSize(val);
  };

  const handleFontCaseChange = (evt: any) => {
    const val = evt.target.value;
    setSelectedFontCase(val);
  };
  const [docnaturalValue] = useImageSize(context?.uploaded?.doc);

  const clockImage = document.querySelector(".docImg");
  const renderedAspectRatio = {
    height: clockImage?.clientHeight,
    width: clockImage?.clientWidth,
  };

  const fontNumber = (renderedAspectRatio?.width! / 100) * 60;
  React.useEffect(() => {
    handleCssFontCapitalize();
  }, [selectedFontCase]);

  return (
    <>
      <Grid container spacing={3} display="flex" justifyContent="center">
        {!isMobile2 ? (
          <>
            <Grid
              item
              md={2.1}
              display="flex"
              mb={6}
              alignItems="flex-end"
              justifyContent="center"
            >
              <Button
                variant="contained"
                fullWidth={isMobile}
                sx={{
                  height: "48px",
                  px: isMobile ? 4 : 6,
                }}
                onClick={() => {
                  setShowStyleBtns(true);
                  handleTextBox();
                }}
              >
                {isMobile ? "Add Text" : "Add A Text Field"}
              </Button>
            </Grid>
            <Grid item md={9.5} display={"flex"} mb={6}>
              <Grid
                container
                display={"flex"}
                spacing={3}
                md={12}
                sx={{
                  overflow: "hidden",
                  transition: "transform 0.5s ease",
                }}
                justifyContent="center"
              >
                <Grid item md={2.3}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    // width={isMobile ? "30%" : "20%"}
                  >
                    <Typography variant="body2">Font</Typography>
                    <FormControl size="small">
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={`${selectedFont}`}
                        onChange={handleFontChange}
                        sx={{
                          height: "48px",
                          borderRadius: "8px",
                        }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
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
                </Grid>
                <Grid item md={2.5}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                  >
                    <Typography color="white">Color Picker</Typography>

                    <TextField
                      type="color"
                      fullWidth
                      size="small"
                      value={colorChange}
                      onChange={handleColorChange}
                      sx={{
                        borderRadius: 14,
                        "& input": {
                          height: "28px", // Set the desired height (e.g., 30px)
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item md={2.7} xs={6} sm={4}>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    flexDirection="column"
                  >
                    <Typography variant="body2">Font-Size</Typography>
                    <FormControl
                      fullWidth
                      size="small"
                      variant="standard"
                      sx={{
                        minWidth: 80,
                        display: "flex",
                        border: "0.4px solid rgba(255, 255, 255, 0.23)",
                        borderRadius: "6px",

                        "& .MuiInput-underline:before": {
                          borderBottom: "none", // Remove underline from the FormControl
                        },
                        "& .MuiInput-underline:after": {
                          borderBottom: "none", // Remove underline from the FormControl after selection
                        },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                          {
                            borderBottom: "none", // Remove underline from the FormControl on hover
                          },
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Box
                          sx={{
                            borderRight: "1px solid rgba(255, 255, 255, 0.23)",
                            width: "100%",
                            height: "100%",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontWeight: 800,
                            px: 4,
                            mr: 2,
                          }}
                          onClick={handleDecreaseFontSize}
                        >
                          -
                        </Box>

                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedFontSize}
                          onChange={handleFontSizeChange}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "14px",
                            py: 2.1,
                            "&:focus": {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            },
                          }}
                          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                          IconComponent={KeyboardArrowDownIcon}
                        >
                          {FONTSSIZE.map((font: any) => (
                            <MenuItem key={font.value} value={font.value}>
                              {font.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <Divider />
                        <Box
                          sx={{
                            borderLeft: "1px solid rgba(255, 255, 255, 0.23)",
                            width: "100%",
                            height: "100%",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            cursor: "pointer",
                            fontWeight: 800,
                            px: 4,
                            ml: 2,
                          }}
                          onClick={handleIncreaseFontSize}
                        >
                          +
                        </Box>
                      </Box>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item md={2}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    // width={isMobile ? "30%" : "12%"}
                  >
                    <Typography variant="body2">Style</Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={`${selectedFontStyle}`}
                        onChange={handleFontStyleChange}
                        sx={{
                          height: "48px",
                          borderRadius: "8px",
                        }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        IconComponent={KeyboardArrowDownIcon}
                      >
                        {FONTSTYLE.map((font: any) => (
                          <MenuItem key={font.value} value={font.value}>
                            {font.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item md={2.5}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    // width={isMobile ? "30%" : "12%"}
                  >
                    <Typography variant="body2">Capitalization</Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={`${selectedFontCase}`}
                        onChange={handleFontCaseChange}
                        sx={{
                          height: "48px",
                          borderRadius: "8px",
                        }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        IconComponent={KeyboardArrowDownIcon}
                      >
                        {FONTCAPITALIZE.map((font: any) => (
                          <MenuItem key={font.value} value={font.value}>
                            {font.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} mb={3}>
              <Grid container spacing={3} mb={3}>
                <Box
                  sx={{
                    overflowX: "auto",
                    display: "flex",
                    whiteSpace: "nowrap",
                  }}
                  gap={3}
                  mx={5}
                >
                  <Grid
                    item
                    xs={3}
                    sx={{ display: "flex", alignItems: "flex-end" }}
                    mb={3}
                  >
                    <Button
                      variant="contained"
                      fullWidth={isMobile}
                      sx={{
                        height: "48px",
                      }}
                      onClick={() => {
                        setShowStyleBtns(true);
                        handleTextBox();
                      }}
                    >
                      Add Text
                    </Button>
                  </Grid>
                  <Grid item md={2}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      mb={3}
                      // width={isMobile ? "30%" : "20%"}
                    >
                      <Typography variant="body2">Font</Typography>
                      <FormControl size="small">
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={`${selectedFont}`}
                          onChange={handleFontChange}
                          sx={{
                            height: "48px",
                            borderRadius: "8px",
                          }}
                          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
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
                  </Grid>
                  <Grid item md={2.5}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                    >
                      <Typography color="white">Color Picker</Typography>

                      <TextField
                        type="color"
                        fullWidth
                        size="small"
                        value={colorChange}
                        onChange={handleColorChange}
                        sx={{
                          borderRadius: 14,
                          "& input": {
                            height: "28px", // Set the desired height (e.g., 30px)
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={2.7} xs={6} sm={4}>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      flexDirection="column"
                    >
                      <Typography variant="body2">Font-Size</Typography>
                      <FormControl
                        fullWidth
                        size="small"
                        variant="standard"
                        sx={{
                          minWidth: 80,
                          display: "flex",
                          border: "0.4px solid rgba(255, 255, 255, 0.23)",
                          borderRadius: "6px",

                          "& .MuiInput-underline:before": {
                            borderBottom: "none", // Remove underline from the FormControl
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none", // Remove underline from the FormControl after selection
                          },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                            {
                              borderBottom: "none", // Remove underline from the FormControl on hover
                            },
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              borderRight:
                                "1px solid rgba(255, 255, 255, 0.23)",
                              width: "100%",
                              height: "100%",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              fontWeight: 800,
                              px: 4,
                              mr: 2,
                            }}
                            onClick={handleDecreaseFontSize}
                          >
                            -
                          </Box>

                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedFontSize}
                            onChange={handleFontSizeChange}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "14px",
                              py: 2.1,
                              "&:focus": {
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              },
                            }}
                            MenuProps={{
                              PaperProps: { sx: { maxHeight: 200 } },
                            }}
                            IconComponent={KeyboardArrowDownIcon}
                          >
                            {FONTSSIZE.map((font: any) => (
                              <MenuItem key={font.value} value={font.value}>
                                {font.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <Divider />
                          <Box
                            sx={{
                              borderLeft: "1px solid rgba(255, 255, 255, 0.23)",
                              // py: 4,
                              // px: 4,
                              width: "100%",
                              height: "100%",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              fontWeight: 800,
                              px: 4,
                              ml: 2,
                            }}
                            onClick={handleIncreaseFontSize}
                          >
                            +
                          </Box>
                        </Box>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item md={2}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                    >
                      <Typography variant="body2">Style</Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={`${selectedFontStyle}`}
                          onChange={handleFontStyleChange}
                          sx={{
                            height: "48px",
                            borderRadius: "8px",
                          }}
                          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                          IconComponent={KeyboardArrowDownIcon}
                        >
                          {FONTSTYLE.map((font: any) => (
                            <MenuItem key={font.value} value={font.value}>
                              {font.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item md={2.5}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                    >
                      <Typography variant="body2">Capitalization</Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={`${selectedFontCase}`}
                          onChange={handleFontCaseChange}
                          sx={{
                            height: "48px",
                            borderRadius: "8px",
                          }}
                          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                          IconComponent={KeyboardArrowDownIcon}
                        >
                          {FONTCAPITALIZE.map((font: any) => (
                            <MenuItem key={font.value} value={font.value}>
                              {font.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        className="long-dashed-border"
      >
        <Box ref={ref} position="relative">
          <img
            className="docImg"
            src={context?.uploaded?.doc}
            style={{
              position: "relative",
              margin: "auto",
              textAlign: "center",
              objectFit: "cover",
              maxWidth: "100%",
              height: "100%",
            }}
          />
          <Box
            width={`${(renderedAspectRatio?.width! / 100) * 60}px`}
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
                  bottom: val?.height! - draggableVal?.height! - 7,
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
                      borderRadius="5px"
                      textAlign="center"
                      sx={{
                        cursor: "move",
                        border: `1px solid ${colorChange}`,
                        color: "#0B0D27",
                        p: 1,
                      }}
                    >
                      {" "}
                      <Typography
                        fontSize={{
                          // xs: pxToRem(8),
                          // sm: pxToRem(14),
                          // md: `${(5 / 100) * fontNumber}px`,
                          xs: selectedFontSize,
                          sm: selectedFontSize,
                          md: selectedFontSize,
                        }}
                        sx={{
                          fontFamily: `${selectedFont}`,
                          fontWeight: selectedFontStyle,
                          textAlign: "center",
                          color: colorChange,
                          fontStyle: selectedFontStyle,

                          textTransform: cssSelectedFontCase,
                        }}
                        variant="h1"
                      >
                        Jefferson kennedy thompson
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
            height: "48px",
            px: 24,
            mb: 4,
            "@media screen and (max-width:768px)": {
              px: 8,
            },
          }}
          disabled={!displayTextBox}
          onClick={() => {
            context?.setUploaded((prev: any) => ({
              ...prev,
              dimension,
              selectedFont,
              selectedFontSize,
              selectedFontCase,
              selectedFontStyle,
              colorChange,
              renderedAspectRatio,
              docnaturalValue,
              idempotencyKey: documentData?.data?.idempotencyKey,
            }));
            navigate(getPathByName(context.activeTab, 2));
          }}
        >
          Continue
        </Button>
      </Box>
    </>
  );
};

export default AddText;
