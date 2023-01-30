import { Box, Button, Grid } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { pxToRem } from "utils/pxToRem";

export interface ITabButtonsProps {
  activeTab: string;
  isMobile?: boolean;
  data: { id: number; name: string; path?: string }[];
}

const TabButtons: FC<ITabButtonsProps> = ({ activeTab, isMobile, data }) => {
  const navigate = useNavigate();
  return (
    <Box
      height={64}
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        background: (theme) => theme.palette.action.disabledBackground,
        borderRadius: "8px",
      }}
    >
      <Grid container spacing={isMobile ? 4 : 14}>
        {data.map((v) => (
          <Grid item xs={12 / data.length} key={v.id}>
            <Button
              variant={v.name === activeTab ? "contained" : "text"}
              fullWidth
              sx={{
                maxWidth: 156,
                height: 40,
                color: "#fff",
                fontSize: pxToRem(isMobile ? 8 : 16),
                fontWeight: 600,
              }}
              onClick={() => v.path && navigate(v.path)}
            >
              {v.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TabButtons;
