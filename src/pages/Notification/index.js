import React from "react";
import "react-placeholder/lib/reactPlaceholder.css";

// **Components
import LeftSideBar from "../../components/LeftSideBar";
import RightSideBar from "../../components/RightSideBar";
import CenterContent from "../../components/CenterContent";

import { MainDiv, RightDiv, CenterDiv } from "../../global_styles/global_style";

import Header from "../../components/Header";

const Notification = ({ selectedTab }) => {
  return (
    <>
      <Header isRoundTable={false} />
      <MainDiv>
        <CenterDiv id="margin0" label="notification">
          <CenterContent selectedTab={selectedTab} />
        </CenterDiv>
        <RightDiv>
          <RightSideBar showRoundtabaleContent />
        </RightDiv>
      </MainDiv>
    </>
  );
};

export default Notification;
