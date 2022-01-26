import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { HelpPopup } from "./HelpPopup";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            b4vis
          </Typography>
          <HelpPopup />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
