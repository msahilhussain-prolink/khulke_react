import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../global_styles/style";
import { LeftSideBarDiv, Cross } from "./style";
import "./style.css";
import axios from "axios";
//** assets
// import LogoImg from "../../assets/icons/KhulKe_logo.svg";
import { REACT_APP_BASE_URL_FOR_USER, STATIC_TOKEN } from "../../constants/env";

// ** Components
import ListItem from "./AccountListItem";
import MemoAccountIcon from "../IconsComponents/AccountIcon";
import MemoPrivacyIcon from "../IconsComponents/PrivacyIcon";
import MemoMuteWords from "../IconsComponents/MuteWords";
import MemoMuteAccounts from "../IconsComponents/MuteAccounts";
import MemoBlockedAccounts from "../IconsComponents/BlockedAccounts";
import MemoDocumentIcon from "../IconsComponents/DocumentIcon";
import MemoBroadCastIcon from "../IconsComponents/BroadCastIcon";
import MemoFAQIcon from "../IconsComponents/FAQIcon";
import MemoLogoutIcon from "../IconsComponents/LogoutIcon";
import MemoSupportIcon from "../IconsComponents/SupportIcon";
import logoutUser from "../../apis/logoutUser";
import PasswordIcon from "../IconsComponents/PasswordIcon";
import CloseIcon from "../../assets/icons/close_icon.svg";
import logger from "../../logger";
import { allWords } from "../../App";
import { globalImages } from "../../assets/imagesPath/images";

const AccountLeftSideBar = ({ expanded, handleClose }) => {
  //Refs
  const pass1 = useRef("");
  const navigate = useNavigate();
  // Effect
  useEffect(() => {
    if (
      window.location.pathname.includes("oldpass") ||
      window.location.pathname.includes("changepass") ||
      window.location.pathname.includes("createpass")
    ) {
      pass1.current.classList = ["passwordLink passwordBold"];
    }
  }, []);
  useEffect(() => {
    if (!localStorage?.current_user && localStorage?.anonymous_user)
      return navigate("/roundtable/all", { replace: true });
  }, []);
  // handler
  async function passFunc() {
    let url = `${REACT_APP_BASE_URL_FOR_USER}/check_passwordpresent/`;

    const data = {
      user_data: JSON.parse(localStorage.getItem("current_user"))["username"],
    };
    const config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    await axios(config)
      .then((res) => {
        if (res.data.data[0].pflag === false) {
          window.location.replace("/setPass");
        }
        if (res.data.data[0].pflag === true) {
          window.location.replace("/oldpass");
        }
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  return (
    <>
      <LeftSideBarDiv>
        <div style={{ position: "relative" }}>
          <Link to={"/home"}>
            <Logo src={globalImages.logo} />
          </Link>

          <div>
            <Cross
              src={CloseIcon}
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "18px",
                right: "20px",
                marginTop: "0",
                height: "auto",
              }}
            />
          </div>

          <div className="my-2 account-left-sidebar-panel">
            <ListItem
              selected={
                window.location.pathname === "/account_settings" ? true : false
              }
              Icon={MemoAccountIcon}
              title={allWords.leftAccounts.acc}
              path={"/account_settings"}
            />
            {/* <ListItem
              selected={
                window.location.pathname === "/invite_friends" ? true : false
              }
              Icon={MemoInviteFriends}
              title={allWords.leftAccounts.invite}
              path={"/invite_friends"}
            /> */}
            <ListItem
              selected={
                window.location.pathname === "/privacy_settings" ? true : false
              }
              Icon={MemoPrivacyIcon}
              title={allWords.leftAccounts.privacy}
              path={"/privacy_settings"}
            />
            <ListItem
              selected={
                window.location.pathname === "/broadcast" ? true : false
              }
              Icon={MemoBroadCastIcon}
              title={allWords.leftAccounts.broadcast}
              path={"/broadcast"}
            />
            <div
              ref={pass1}
              className="icon_container passwordLink"
              onClick={() => passFunc()}
            >
              <>
                <PasswordIcon
                  className={"icon selected_icon"}
                  style={{ width: "25px", height: "25px", marginRight: "1rem" }}
                />
                <span>{allWords.leftAccounts.pass}</span>
              </>
            </div>

            <ListItem
              selected={
                window.location.pathname === "/muted_words" ? true : false
              }
              Icon={MemoMuteWords}
              title={allWords.leftAccounts.mutedWord}
              path={"/muted_words"}
            />
            <ListItem
              selected={
                window.location.pathname === "/muted_accounts" ? true : false
              }
              Icon={MemoMuteAccounts}
              title={allWords.leftAccounts.MutedAcc}
              path={"/muted_accounts"}
            />
            <ListItem
              selected={
                window.location.pathname === "/blocked_accounts" ? true : false
              }
              Icon={MemoBlockedAccounts}
              title={allWords.leftAccounts.blocked}
              path={"/blocked_accounts"}
            />
          </div>
        </div>
        <hr />
        <div
          className="acclist"
          style={{
            height: "20rem",
            overflowX: "hidden",
            overflowY: "scroll",
            paddingRight: "12px",
          }}
        >
          <ListItem
            openTab={true}
            Icon={MemoFAQIcon}
            title={allWords.leftAccounts.faq}
            path={"/faq"}
          />
          <ListItem
            openTab={true}
            Icon={MemoDocumentIcon}
            title={allWords.leftAccounts.privacyPoli}
            path={"/privacy-policy"}
          />
          <ListItem
            openTab={true}
            Icon={MemoDocumentIcon}
            title={allWords.leftAccounts.communiGuide}
            path={"/community-guidelines"}
          />
          <ListItem
            openTab={true}
            Icon={MemoDocumentIcon}
            title={allWords.leftAccounts.disclaim}
            path={"/disclaimers"}
          />
          <ListItem
            openTab={true}
            Icon={MemoSupportIcon}
            title={allWords.leftAccounts.support}
            path={"/support"}
          />
          <ListItem
            openTab={true}
            Icon={MemoDocumentIcon}
            title={allWords.leftAccounts.TnC}
            path={"/terms-conditions"}
          />
          <ListItem
            openTab={true}
            Icon={MemoDocumentIcon}
            title={allWords.leftAccounts.takeDown}
            path={"/take-down-policy"}
          />
        </div>

        <div
          className="d-flex warn-text"
          style={{ cursor: "pointer", fontSize: "1.125rem" }}
          onClick={logoutUser}
        >
          <MemoLogoutIcon className="icon selected_icon mt-1" />
          <small style={{ visibility: "hidden", userSelect: "none" }}>
            |||||
          </small>
          <p>{allWords.leftAccounts.logout}</p>
        </div>
      </LeftSideBarDiv>
    </>
  );
};

export default AccountLeftSideBar;
