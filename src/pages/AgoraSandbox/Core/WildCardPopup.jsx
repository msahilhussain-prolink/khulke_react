import { Chip, Dialog } from "@mui/material";
import React from "react";
import { WildCardCarouselComponent } from "../WildMessage";
import { getLiveRTSelectedWildMsg } from "../../../redux/reducers/liveRTReducer";
import { useSelector } from "react-redux";
import UserProfile from "../../../components/UserProfile";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useState } from "react";

const WildCardPopup = ({ wmData = [] }) => {
  const selectedWildMsg = useSelector(getLiveRTSelectedWildMsg);
  const fullScrc = useSelector((state) => state.fullScreen.full);
  const [currentWildCardDetail, setcurrentWildCardDetail] = useState(
    wmData[0] ?? {}
  );
  
  return (
    <Dialog
      sx={{
        position: "absolute",
        zIndex: 97,
        "& .MuiDialog-container":{
          alignItems: "self-end",
        },
        "& .MuiPaper-elevation":{
          maxWidth: "100vw",
          
          backgroundColor: "transparent",
        }
      }}
      disablePortal
      hideBackdrop={true}
      open={fullScrc && !selectedWildMsg}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div style={{ height: "100px", width: "80vw", marginBottom: "100px" }}>
        <div className="wild-cont-image-outer-fullscr">
        <div className="user-profile-wrapper" style={{ marginTop: "0px", position: "absolute" }}>
            <UserProfile
              username={currentWildCardDetail?.username}
              width="100px"
              height="100px"
              borderRadius="50%"
              className={`profile-circle wild-cont-image-inner`}
            />
            {currentWildCardDetail?.username ? (
              <Chip
                sx={{
                  borderRadius: "5px",
                  position: "absolute",
                  bottom: "5px",
                  left: "00px",
                  minWidth: "80px",
                  backgroundColor: "#333333",
                  height: "20px",
                  color: "white",
                }}
                label={`@${currentWildCardDetail?.username}`}
              />
            ) : null}
          </div>
          <div className="carousel-container container-background-fullscr">
            <div >
              <WildCardCarouselComponent wmDataArray={wmData} setcurrentWildCardDetail={setcurrentWildCardDetail}/>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default WildCardPopup;
