import { useState } from "react";
import {
  Box,
  IconButton,
} from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { HelpDialog } from "./HelpDialog";

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
        {props.hasButton &&
          <IconButton onClick={handleClickOpen}>
            <HelpOutline />
          </IconButton>
        }
      </Box>
      <HelpDialog isOpen={open} openClick={handleClose}/>
    </div>
  );
}
