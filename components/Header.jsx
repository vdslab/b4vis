import { AppBar, Box, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { HelpButton } from "./HelpButton";
import { SearchPopup } from "./SearchPopup";

export default function Header() {
  const showSearchBar = useMediaQuery("(min-width:1175px)", { noSsr: true });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            b4vis
          </Typography>

          {showSearchBar ? <HelpButton /> : <SearchPopup />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
