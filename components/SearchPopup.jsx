import { useState } from "react";
import { IconButton } from "@mui/material";
import { MenuRounded } from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { HelpPopup } from "./HelpPopup";

export function SearchPopup() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHelpDialogClose = (event) => {
    setShowHelpDialog(false);
  };

  return (
    <div>
      <IconButton
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuRounded />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setShowHelpDialog(true);
          }}
        >
          b4visとは
        </MenuItem>
        <MenuItem onClick={handleClose}>学校を探す</MenuItem>
      </Menu>

      <HelpPopup
        isOpen={showHelpDialog}
        handleHelpDialogClose={handleHelpDialogClose}
      />
    </div>
  );
}
