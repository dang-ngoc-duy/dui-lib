import { SxProps, Theme } from "@mui/system";
import { ReactChild, ReactFragment, ReactPortal } from "react";

export type BaseColor = 
| "inherit" 
| "error"  
| "primary" 
| "secondary" 
| "info" 
| "success" 
| "warning";

export type BaseSize = "small" | "large" | "medium";

export type TooltipPlacement = 
  | "top" 
  | "bottom-end" 
  | "bottom-start" 
  | "bottom" 
  | "left-end" 
  | "left-start" 
  | "left" 
  | "right-end" 
  | "right-start" 
  | "right" 
  | "top-end" 
  | "top-start";

export type SxBaseApp = SxProps<Theme>;
  
export type TooltipTitle = boolean | ReactChild | ReactFragment | ReactPortal;

export type TooltipColor = BaseColor | 'default';