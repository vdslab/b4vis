import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { HelpPopup } from "./HelpPopup";

export function HelpButton(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box>
        <IconButton onClick={handleClickOpen}>
          <HelpOutline />
        </IconButton>
      </Box>
      <HelpPopup isOpen={open} handleClose={handleClose} />
    </div>
  );
}
