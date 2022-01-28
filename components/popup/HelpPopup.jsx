import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  DialogActions,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import styles from "../css/HelpPopup.module.css";

export function HelpPopup(props) {
  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={props.handleClose}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>
            b4visとは
          </DialogTitle>
          <DialogActions>
            <IconButton
              onClick={props.handleClose}
              aria-label="close"
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseOutlined />
            </IconButton>
          </DialogActions>
        </div>
        <DialogContent>
          <DialogContentText>
            <div>
              b4visでは吹奏楽コンクールと夏の甲子園で上位大会に進んだ高校を可視化します。
            </div>

            <div style={{ padding: "1.5rem 0 1.5rem 0" }}>
              <div>
                左の①のビューでは、2013~2017年で以下のどちらか、または両方の結果を残した高校を表示しています。
                左上のボタンから吹奏楽・野球ともに上位大会に進んだ学校が多い/少ない県順に並び替えることができます。
                <ul style={{ margin: "0.5rem 0 0.5rem 0" }}>
                  <li>
                    吹奏楽コンクール(高A)で都道府県大会以上(東京・北海道は支部大会以上)の成績
                  </li>
                  <li>
                    夏の甲子園で地区大会ベスト8以上(東京・北海道はベスト4以上)
                  </li>
                </ul>
              </div>
              <div style={{ padding: "1rem 0 1rem 0" }}>
                グラフのセルをクリックすることでその学校のある都道府県の2013~2017年の詳細(ビュー②)とその学校の詳細(ビュー④)を見ることができます。
                また、セルをクリックするか県名を選ぶことで、ビュー③で該当する県の私立/公立校の内訳を見ることができます。
              </div>

              <div style={{ padding: "1rem 0 1rem 0" }}>
                気になる学校がある場合は左の検索欄から調べることができます。
              </div>
              <div>
                学校によってはデータが取れず不明の年もありますがご了承ください。
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ width: "50%", margin: "1rem" }}
                  src={"./images/sample.png"}
                  alt="サンプル"
                />
              </div>
            </div>

            <div>
              <div>データ提供</div>
              <div>
                吹奏楽：
                <a
                  className={styles.link}
                  href="https://www.musicabella.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Musica Bella
                </a>
              </div>
              <div>
                甲子園：
                <a
                  className={styles.link}
                  href="https://www.hb-nippon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  高校野球ドットコム
                </a>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
