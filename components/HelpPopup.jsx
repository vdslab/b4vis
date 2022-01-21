import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  IconButton,
} from "@mui/material";
import { HelpOutline } from "@mui/icons-material";

export function HelpPopup() {
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
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"lg"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">b4visとは</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>b4visでは吹奏楽コンクールと夏の甲子園で上位大会に進んだ高校を可視化します。</div>
            <div>左の①のビューでは、2013~2017年で以下のどちらか、または両方の結果を残した高校を表示しています。
              左上のボタンから吹奏楽・野球ともに好成績の学校が多い/少ない県順に並び替えることができます。
              <ul>
                <li>吹奏楽コンクールで都道府県大会以上(東京・北海道は支部大会以上)の成績</li>
                <li>夏の甲子園で地区大会ベスト8以上(東京・北海道はベスト4以上)</li>
              </ul>
            </div>

          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
