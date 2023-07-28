import React, { useEffect, useState } from "react";
import LeftSideBar from "./components/LeftSideBar";
import "./superparent.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Welcome3 from "./pages/Welcome/Welcome3";
import SuccessDialog from "./components/SuccessDialog";
import { allWords } from "./App";
const isMobile = window.screen.width < 769;

export default function SuperParent({ children }) {
  const loc = useLocation();
  const checkpage =
    loc.pathname.includes("roundtable") && loc.search.includes("?id=");
  const [kkpaths, setKKPaths] = useState(false);
  const fullScrc = useSelector((state) => state.fullScreen.full);
  const userDataDetails = useSelector((state) => state.user_profile);

  const current_user = localStorage.current_user
    ? JSON.parse(localStorage.current_user)
    : null;

  const [userDialog, setUserDialog] = useState({
    flag: 1,
    data: [],
    updated: false,
  });
  const [successDialog, setSuccessDialog] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // dont show welcome 2nd popup for some screens
  const location = window.location.pathname;

  useEffect(() => {
    if (!current_user) {
      return;
    }

    if (userDataDetails) {
      setUserData(
        userDataDetails?.data?.data?.self_user ||
          userDataDetails?.data?.data?.user_other
      );
      setUserDialog({
        flag:
          userData?.username_updated === 0
            ? current_user?.hasChangedUsername
              ? 1
              : 0
            : 1,
        data: userData,
        updated: false,
      });
    }
  }, [userDataDetails, userData]);

  useEffect(() => {
    if (
      loc.pathname.includes("home") ||
      loc.pathname.includes("snip-it") ||
      loc.pathname.includes("all") ||
      loc.pathname.includes("live") ||
      loc.pathname.includes("upcoming") ||
      loc.pathname.includes("mine") ||
      loc.pathname.includes("notifications") ||
      loc.pathname.includes("profile") ||
      loc.pathname.includes("search") ||
      loc.pathname.includes("personal_details") ||
      loc.pathname.includes("create") ||
      loc.pathname.includes("edit") ||
      loc.pathname.includes("post") ||
      loc.pathname.includes("yapp") ||
      loc.pathname.includes("k3") ||
      loc.pathname.includes("bol-khulke")
    )
      setKKPaths(true);
    else setKKPaths(false);

    // For showing popup based on different screens
    let path = loc.pathname;

    if (path.includes("roundtable") && path.split("/").length < 3) {
      path = loc.search;
    }

    const condition = (el) => path.includes(el);

    // add word from the path where you dont want to show welcome popup 2nd time
    const noWelcomePaths = ["join", "recorded", "id", "profile", "post"];

    if (noWelcomePaths.some(condition)) {
      return setShowPopup(false);
    }

    setShowPopup(true);
  }, [loc]);
  return (
    <>
      <div
        className="outerkk1"
        id="outerkk1-id"
        
        style={{
          width:
            loc.pathname.includes("welcome") ||
            loc.pathname.includes("recording") ||
            loc.pathname.includes("join") ||
            loc.pathname.includes("recorded") ||
            fullScrc
              ? "100%"
              : "",
          justifyContent: loc.pathname.includes("join") ? "center" : "",
          height: loc.pathname.includes("join") ? "100vh" : ""
        }}
      >
        {(!isMobile && kkpaths) || checkpage ? (
          <div
            className="innerkk1"
            style={{
              width: location.split("/")[1] === "yapp" ? "fit-content" : "23%",
            }}
          >
            <LeftSideBar />
          </div>
        ) : (
          ""
        )}
        {children}
      </div>
      {userDialog?.flag !== 0 ||
      (!(
        userData &&
        userData?.username_updated &&
        userData.username_updated !== 1
      ) &&
        !showPopup) ? (
        <></>
      ) : (
        <Welcome3
          welcomeScreen={true}
          fromHome={true}
          userData={userDialog?.data}
          setUserDialog={setUserDialog}
          setSuccessDialog={setSuccessDialog}
          hasUpdatedUsername={userDialog?.flag}
        />
      )}

      <SuccessDialog
        open={successDialog}
        setOpen={setSuccessDialog}
        msg={allWords.misc.pages.proupdated}
        fromHome={true}
      />
    </>
  );
}
