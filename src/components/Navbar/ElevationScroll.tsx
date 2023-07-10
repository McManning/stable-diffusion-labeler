import { cloneElement } from "react";
import { useScrollTrigger } from "@mui/material";

export interface ElevationScrollProps {
  children: React.ReactElement;
}

export function ElevationScroll({ children }: ElevationScrollProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}
