import { Theme } from "@mui/material";

export interface ILandingSection {
  theme?: Theme;
  isMobile?: boolean;
  ref?: any;
}

export interface IStepItem {
  label: string;
  value: number;
}

export interface IStepperProps {
  orientation: "horizontal" | "vertical";
  steps: IStepItem[];
  current: number;
  isMobile: boolean;
}
