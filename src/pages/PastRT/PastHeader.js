import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { allWords } from "../../App";

// Material UI
import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { FiberManualRecord, InfoOutlined, MoreVert } from "@material-ui/icons";

// Style
import { Logo, TimeImg } from "./style";
import "./style.css";

// Components
import MemoTimerIcon from "../../components/IconsComponents/TimerIcon";
import UserList from "./UserList";

// Utils
import { returnFullTimeString } from "../../utils/timeutils";

// Assets
import Viewers from "../../assets/icons/Group 19646.svg";
import ArrowLeft from "../../assets/icons/arrow_left.svg";
import { moengageEvent } from "../../utils/utils";
import { globalImages } from "../../assets/imagesPath/images";
import RtShareComponent from "../../components/RtShareComponent";
import { useDispatch, useSelector } from "react-redux";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";
import SearchInput from "../../components/common/SearchInput";
import RTSearchBar from "../../components/RTHeader/RTSearchBar/RTSearchBar";
import Header from "../../components/Header";

export default function PastHeader(props) {
  const {
    rt_id,
    title,
    videoTime,
    viewer_count,
    other_count,
    navigate,
    hideFull,
    start,
    r_type,
    rt_nature,
    setRTData,
    audioElem,
    videoElem,
    redirectUrl,
  } = props;

  const rtAction = useSelector((state) => state.rtActionRed.data);

  const [joinedUserList, setShowJoinedUserList] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [style, setStyle] = useState({});
  const [exitFlag, setExitFlag] = useState(false);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((timeSpent) => timeSpent + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (exitFlag) {
      if (rtAction && rtAction?.data?.status) {
        setRTData([]);
        navigate("/roundtable/all");
        moengageEvent("Leave RoundTable", "RoundTable", {
          RoundTableID: rt_id,
          Name: title,
          "K Type": r_type,
          "K SubType": rt_nature,
          "Audience Interaction": 0,
        });
      }
    }
  }, [rtAction]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const ParticipantsRef = useCallback((node) => {
    if (node !== null) {
      const elem = node.getBoundingClientRect();

      setStyle({
        top: `${elem.top + 60}px`,
        right: `calc(100% - ${elem.right}px)`,
      });

      const onresizeEvent = () => {
        const elem = node.getBoundingClientRect();

        setStyle({
          top: `${elem.top + 60}px`,
          right: `calc(100% - ${elem.right}px)`,
        });
      };

      window.addEventListener("resize", onresizeEvent);
      return () => {
        window.removeEventListener("resize", onresizeEvent);
      };
    }
  }, []);

  const exitRecording = () => {
    let lvt = videoElem?.current
      ? videoElem?.current?.currentTime
      : audioElem?.current?.currentTime;

    dispatch(
      rtActionData({
        rt_id: rt_id,
        action: "VIEW",
        last_video_time: Math.round(lvt),
        total_time_spend: timeSpent,
      })
    );
    setExitFlag(true);
  };

  return (
    <>
      <div className="past-rt-parent mx-0">
        <Header redirectUrl={redirectUrl} />
        <div
          className="pastHeader"
          style={{
            display: "flex",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="d-flex">
                <img
                  className="arrowLeft"
                  src={ArrowLeft}
                  alt=""
                  onClick={() => {
                    navigate("/roundtable/all");
                  }}
                />
                <Logo
                  className="logoImg"
                  style={{ cursor: "pointer" }}
                  src={globalImages.logo}
                  alt="open in new tab"
                  onClick={() => {
                    window.open(`${window.location.origin}/roundtable/all`);
                  }}
                />
                <div className="search-past-rt">
                  <RTSearchBar heightProp={"2.5rem"} />
                </div>

                <h5 className="header-title-past" data-tip={title}>
                  {title}
                </h5>
              </div>
            </div>
          </div>

          <div className="pastTimers d-flex">
            <div
              className="viewers-past-rt"
              onClick={() => {
                setShowJoinedUserList(true);
              }}
              ref={ParticipantsRef}
            >
              <TimeImg src={"/assets/icons/viewer.svg"} alt="viewer" />
              {/* {allWords.misc.pg4.viewer}: */}
              <span>
                {other_count > 0
                  ? ` ${Number(viewer_count + other_count)}`
                  : ` ${Number(viewer_count)}`}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="d-flex">
                {!isNaN(videoTime) && (
                  <>
                    <Typography component="p" className="timer-past-rt">
                      {/* <MemoTimerIcon /> */}
                      <img
                        src="/assets/icons/pasttimer.svg"
                        alt="timer"
                        className="timer-icon-past-rt"
                      />
                      {/* <span className="timeSpan">
                        &nbsp;{allWords.misc.livert.time}:{" "}
                      </span> */}
                      <span style={{ fontSize: "18px" }}>
                        {returnFullTimeString(videoTime)}
                      </span>
                      {/* <FiberManualRecord
                        fontSize="small"
                        style={{
                          color: "#63779C",
                          marginLeft: "5px",
                          marginRight: "-2px",
                          width: 8,
                          height: 8,
                        }} 
                      />*/}
                    </Typography>
                  </>
                )}

                <IconButton className="moreVert" onClick={handleClick}>
                  <MoreVert fontSize="large" className="icon-past-rt" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div
          style={{
            width: 200,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MenuItem
            style={{
              width: "100%",
              padding: "0.5rem",
              margin: "0",
              justifyContent: "left",
            }}
            onClick={() => {
              handleClose();
              exitRecording();
            }}
          >
            <ListItemIcon
              style={{ minWidth: "initial", marginRight: "0.5rem" }}
            >
              <LogoutIcon fontSize="25" />
            </ListItemIcon>
            {allWords.misc.livert.leave}
          </MenuItem>
          <Divider />
          <MenuItem
            style={{
              width: "100%",
              padding: "0.5rem",
              margin: "0",
              justifyContent: "left",
            }}
            onClick={() => {
              window.open(`${window.location.origin}/roundtable/disclaimer`);
            }}
          >
            <InfoOutlined
              style={{
                color: "#00000080",
                marginRight: "0.3rem",
                fontSize: "25",
              }}
            />
            {/* <small
              style={{ visibility: "hidden", width: "10%", userSelect: "none" }}
            >
              a
            </small> */}
            <Link
              style={{
                textDecoration: "none",
                fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
                fontWeight: "400",
                fontSize: "1rem",
                lineHeight: "1.5",
                marginLeft: "0.1rem",
              }}
              className="disclaimer_link"
              to="/roundtable/disclaimer"
              target="_blank"
            >
              {allWords.misc.pages.distitle}
            </Link>
          </MenuItem>
          <Divider />
          <MenuItem
            style={{
              width: "100%",
              padding: "0.5rem",
              margin: "0",
              justifyContent: "left",
            }}
          >
            <RtShareComponent
              propDivStyle={{ width: "100%" }}
              rt_id={rt_id}
              className="rt-header-share-btn"
              propBtnStyle={{
                width: "100%",
                background: "transparent",
                border: "none",
                color: "rgba(0, 0, 0, 0.54)",
                display: "flex",
              }}
            />
          </MenuItem>
        </div>
      </Menu>

      {/* user joined list dialog */}
      {joinedUserList && (
        <UserList
          setShowJoinedUserList={setShowJoinedUserList}
          rt_id={rt_id}
          style={style}
          other_count={other_count}
          viewer_count={viewer_count}
        />
      )}
    </>
  );
}
