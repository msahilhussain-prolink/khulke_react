import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// importing material UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ClickAwayListener, Drawer, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Components
import LeftSideBar from "../LeftSideBar";
import SearchInput from "../common/SearchInput";
import PreloginComp from "../PreLoginComp";
import Ak from "../AccountLeftsideBar/index";

// Style
import { SearchItem, Wrapper } from "../RightSideBar/style";
import "./style.css";

// Assets
import recentIcon from "../../assets/icons/Group 1053.svg";
import RoundTableIconActive from "../../assets/icons/RoundTable_icon_active.svg";
import plus_circle from "../../assets/icons/plus-circle.svg";

// Utils
import { moengageEvent } from "../../utils/utils";
import { allWords } from "../../App";

// Redux
import { drawerFlag } from "../../redux/actions/compActions";
import { createEditRoundtableInitialize } from "../../redux/actions/createEditRoundtable";
import moment from "moment";
import ButtonComponent from "../ButtonComponent";

export default function Header({ isRoundTable, redirectUrl }) {
  const headerStyle = {
    backgroundColor: "#fff",
    boxShadow: "none",
    borderBottom: "1px solid #E4E9F0",
    padding: "0",
    marginTop: "5px",
  };

  const open = useSelector((state) => state.drawerSwitchRed.drawFlag);
  const dispatch = useDispatch();

  const [recent_searches, setRecentSearches] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("khulke_recents")) {
      let temp_search = JSON.parse(localStorage.getItem("khulke_recents"));
      setRecentSearches(temp_search.reverse());
    }
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (!localStorage.getItem("khulke_recents")) {
        localStorage.setItem(
          "khulke_recents",
          JSON.stringify([e.target.value])
        );
      } else {
        let recents = JSON.parse(localStorage.getItem("khulke_recents"));
        recents.push(e.target.value);
        localStorage.setItem("khulke_recents", JSON.stringify(recents));
      }

      let comp = "";
      if (window.location.pathname.includes("profile")) {
        comp = "User";
      } else if (window.location.pathname.includes("roundtable")) {
        comp = "RoundTable";
      } else {
        comp = "Post";
      }
      moengageEvent("Search", comp, { "Search Text": e.target.value });
      navigate(`/search?search_term=${e.target.value}`);
    }
  };

  const toggleSlider = () => {
    dispatch(drawerFlag(!open));
  };
  let arrURLs = [
    "/account_settings",
    "/invite_friends",
    "/privacy_settings",
    "/setPass",
    "/changepass",
    "/oldpass",
    "/muted_words",
    "/muted_accounts",
    "/blocked_accounts",
  ];

  const newRT = () => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      setModalOpen(true);
      return;
    }

    dispatch(
      createEditRoundtableInitialize({
        rtType: allWords.rt.label2.toLowerCase(),
        rtPlayType: allWords.rt.opt1.toLowerCase(),
        rtNature: allWords.createRT.optPub.toLowerCase(),
        rtTopic: "",
        rtDescription: "",
        dateValue: moment(new Date()).add(30, "minutes"),
        timeValue: moment(new Date()).add(30, "minutes"),
        urlRtId: null,
        wipRtId: null,
        durationHr: {
          label: `0 ${allWords.misc.livert.h}`,
          value: "0",
        },
        durationMin: {
          label: `30 ${allWords.misc.livert.m}`,
          value: "30",
        },
        durationSec: {
          label: `0 ${allWords.misc.livert.m}`,
          value: "0",
        },
        totalDur: "",
        schedule: true,
        rtImage: "",
        rtImageUrl: "",
        rtImgDel: false,
        logo1: "",
        logo2: "",
        logo3: "",
        intro: "",
        outro: "",
        logo1Del: false,
        logo2Del: false,
        logo3Del: false,
        introDel: false,
        outroDel: false,
        recording: "",
        owner: "",
        moderator: "",
        moderatorIntroduction: "",
        panelists: [],
        rtDoc: "",
        invitesList: {},
        user_data: [],
        phoneList: [],
        emailList: [],
        created_at: "",
        m_type: false,
        backdropFlag: false,
        inviteFollower: false,
        inviteFollowing: false,
        user_id: [],
        emails: [],
        phones: [],
        anonymous: false,
        rtThumbnailPreview: null,
        logo1Preview: null,
        logo2Preview: null,
        logo3Preview: null,
        introPreview: null,
        outroPreview: null,
        recordingPreview: null,
        docPreview: null,
        isDocPdf: false,
        arrayId: [],
      })
    );

    navigate("/roundtable/create");
  };

  const showSearchOpenApp = window.location.pathname.includes("recorded");

  const redirectToAppHandler = () => {
    const appPackageName = navigator.userAgent.match(/android/i)
      ? "com.khulke.app"
      : "com.loktantramediatech.khulke";
    const intentUrl = `intent://${
      redirectUrl?.split("://")[1]
    }#Intent;scheme=https;package=${appPackageName};end`;
    const storeUrl = navigator.userAgent.match(/android/i)
      ? `https://play.google.com/store/apps/details?id=${appPackageName}`
      : `https://apps.apple.com/in/app/khul-ke-social-networking-app/id1590836834`;

    if (navigator.userAgent.match(/android/i)) {
      try {
        // Try to launch the app using the intent URL  window.location.href = intentUrl;
        window.location.href = intentUrl;
      } catch (error) {
        // If the app is not installed, redirect to the Play Store  window.location.href = storeUrl;
        window.location.href = storeUrl;
      }
    } else if (navigator.userAgent.match(/iphone|ipad|ipod/i)) {
      window.location.href = redirectUrl;

      setTimeout(() => {
        window.location.href = storeUrl;
      }, 1000);
    }
  };

  return (
    <div className="mobile-header">
      <AppBar className="mobile-header" position="static" sx={headerStyle}>
        <Grid
          container
          direction="row"
          justifyContent={showSearchOpenApp ? "space-between" : null}
        >
          <Grid
            item
            xs={2}
            container
            direction="row"
            justifyContent="flex-start"
          >
            <Toolbar>
              <IconButton
                size="medium"
                edge="start"
                color="default"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleSlider}
              >
                <MenuIcon />
              </IconButton>
              <Drawer open={open} anchor="left" onClose={toggleSlider}>
                {arrURLs.includes(window.location.pathname) ? (
                  <Ak expanded={open} handleClose={toggleSlider} />
                ) : (
                  <LeftSideBar expanded={open} handleClose={toggleSlider} />
                )}
              </Drawer>
            </Toolbar>
          </Grid>
          {!showSearchOpenApp ? (
            <Grid
              item
              xs={isRoundTable ? 5 : 8}
              container
              direction="row"
              sx={{ flexBasis: "55%", maxWidth: "55%", marginBottom: "0.5rem" }}
              justifyContent="flex-end"
            >
              <div className="headerSection">
                <SearchInput
                  className="bar-search"
                  onKeyDown={(e) => {
                    handleSearch(e);
                  }}
                  onClick={() => setIsOpen(true)}
                />
                <button
                  onClick={newRT}
                  className="follow-button-small"
                  id="follow-button-mobile"
                  style={{
                    width: "fit-content",
                    display: "flex",
                    padding: "0.5rem 1rem",
                  }}
                  hidden={
                    window.location.pathname.includes("home") ||
                    window.location.pathname.includes("snip-it")
                      ? true
                      : false
                  }
                >
                  <img
                    alt=""
                    src={plus_circle}
                    height="20px"
                    width="20px"
                    style={{
                      padding: "0px",
                      margin: "0",
                      display: "inline",
                    }}
                  />
                  &nbsp;
                  <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                    {allWords.misc.new}
                  </span>
                </button>
                <ClickAwayListener
                  touchEvent="onTouchStart"
                  onClickAway={() => {
                    setIsOpen(false);
                  }}
                >
                  <>
                    {isOpen && recent_searches.length > 0 && (
                      <Wrapper
                        style={{
                          border: "1px solid #e4e9f0",
                          padding: "0px 5px",
                          marginLeft: "-2.7rem",
                          marginTop: "25rem",
                        }}
                        className="custom_mobile_search"
                      >
                        <h4>{allWords.misc.rsh}</h4>
                        {recent_searches.map((item) => {
                          return (
                            <SearchItem
                              key={item}
                              onClick={() => {
                                navigate(`/search?search_term=${item}`);
                              }}
                            >
                              <img
                                src={recentIcon}
                                alt=""
                                style={{ color: "#000" }}
                              />
                              <span
                                style={{
                                  visibility: "hidden",
                                  userSelect: "none",
                                }}
                              >
                                a
                              </span>
                              <small
                                style={{ fontSize: "18px", color: "#000" }}
                              >
                                {item}
                              </small>
                            </SearchItem>
                          );
                        })}
                      </Wrapper>
                    )}
                  </>
                </ClickAwayListener>
              </div>
            </Grid>
          ) : null}
          {showSearchOpenApp ? (
            <div className="d-flex align-items-center open-app-div">
              <div className="img-search-div">
                <img
                  src="/assets/icons/search.svg"
                  alt="search"
                  width={35}
                  height={35}
                  // onClick={}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <ButtonComponent
                btnText="Open App"
                propStyles={{ borderRadius: "10px", margin: "0 1rem" }}
                btnFunction={redirectToAppHandler}
              />
            </div>
          ) : null}
          {/* <Grid
            item
            xs={isRoundTable ? 5 : 2}
            container
            direction="row"
            justifyContent="flex-end"
            sx={{ flexWrap: "nowrap" }}
          ></Grid> */}
        </Grid>
        <PreloginComp
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          icon={
            <img src={RoundTableIconActive} alt="" width={40} height={40} />
          }
          title={allWords.misc.prelog}
          description={""}
        />
      </AppBar>
    </div>
  );
}
