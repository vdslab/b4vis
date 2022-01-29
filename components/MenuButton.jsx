import { useState } from "react";
import { IconButton } from "@mui/material";
import { MenuRounded } from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { HelpPopup } from "./popup/HelpPopup";
import { SearchSchoolPopup } from "./popup/SearchSchoolPopup";
import { useDispatch } from "react-redux";
import { appSlice } from "../store/features"

export function MenuButton() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHelpPopupClose = (event) => {
    setShowHelpPopup(false);
  };

  const handleSearchPopupClose = (event) => {
    setShowSearchPopup(false);
    dispatch(appSlice.actions.resetInputSchoolName());
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
            setShowHelpPopup(true);
          }}
        >
          b4visとは
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setShowSearchPopup(true);
          }}
        >
          学校から検索
        </MenuItem>
      </Menu>
      <HelpPopup isOpen={showHelpPopup} handleClose={handleHelpPopupClose} />
      <SearchSchoolPopup
        isOpen={showSearchPopup}
        handleClose={handleSearchPopupClose}
      />
    </div>
  );
}
