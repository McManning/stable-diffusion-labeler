import { AppBar, Toolbar, Typography } from "@mui/material";
import { ElevationScroll } from "./ElevationScroll";

export function Navbar() {
  return (
    <ElevationScroll>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            Scroll to elevate App bar
          </Typography>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  )
}