import React from "react";
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
// import { useNavigate } from "react-router-dom";
import InviteFromTwitter from "./invite_from_twitter";
import { MainDiv, LeftDiv, RightDiv, CenterDiv } from "./style";
import SettingsHeader from "../../components/SettingsHeader";
import Header from "../../components/Header";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { metaData } from "../../constants/StaticPagesMetaTags";

const InviteFriends = () => {
  return (
    <>
      <MetaTagsGenerator metaTags={metaData["invite-friends"]} />
      <Header />
      <MainDiv>
        <LeftDiv>
          <AccountLeftSideBar />
        </LeftDiv>
        <CenterDiv>
          <SettingsHeader />
          <section>
            <InviteFromTwitter />
          </section>
        </CenterDiv>
        <RightDiv></RightDiv>
      </MainDiv>
    </>
  );
};

export default InviteFriends;
