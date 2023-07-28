import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

// Assets
import Thumbnail from "../../../assets/images/thumbnail_preview.png";

// Components
import UserComponent from "../UserComponent";
import UserProfile from "../../UserProfile";
import MemoVideoBased from "../../IconsComponents/VideoBased";
import MemoAudioBased from "../../IconsComponents/AudioBased";
import ReadMoreComponent from "../ReadMoreComponent";

// Constant
import { allWords } from "../../../App";

// Styles
import {
  LiveLottie,
  ReadMorePropsStyle,
  ReadMoreStyle,
  textSpanStyles,
} from "../styles";
import "./style.css";
import {
  PLATFORMS,
  PLATFORM_DETAILS,
} from "../../../pages/AccountSettings/BroadCast/BroadCastUtils/Configs";

const PreviewComponent = () => {
  const selector = useSelector((state) => state.createEditRoundtable);

  const {
    rtType,
    rtPlayType,
    rtTopic,
    rtDescription,
    rtImageUrl,
    moderator,
    moderatorIntroduction,
    panelists,
    durationHr,
    durationMin,
    durationSec,
    dateValue,
    timeValue,
    broadcastStreaming,
  } = selector;

  const [label, setLabel] = useState(allWords.rt.label2.toLowerCase());

  let current_user = null;
  let date = new Date();

  try {
    current_user = JSON.parse(localStorage.current_user);
  } catch (e) {
    current_user = {
      name: "Curtain Calls",
      username: "Curtain Calls",
    };
  }

  useEffect(() => {
    let customDate = moment(new Date(dateValue)).format("MM/DD/YYYY");
    let customTime = moment(new Date(timeValue)).format("hh:mm A");
    let customDateTime = customDate.concat(" ").concat(customTime);

    let start_time = moment
      .utc(new Date(customDateTime))
      .format("yyyy-MM-DDTHH:mm:ss+00:00");

    if (moment(start_time).diff(date, "seconds") < 601) {
      setLabel(`${allWords.rt.label2.toLowerCase()}`);
    } else {
      setLabel(allWords.rt.label3.toLowerCase());
    }
  }, [dateValue, timeValue]);

  return (
    <div className="preview-container">
      <div className="row">
        <Link className="preview-link-class d-block d-xl-none" to={"/test"}>
          <img src={"/assets/icons/back.svg"} alt="back" />
        </Link>
        <h3
          className={`preview-h3 ${
            current_user.display_language === "hi" ? "mt-1" : null
          }`}
        >
          {allWords.misc.preview}
        </h3>
      </div>
      <div className="preview-parent">
        <div className="row m-0 p-0">
          <div className="col-2 p-0 preview-profile-img">
            <UserProfile username={current_user?.username} className="avatar" />
          </div>{" "}
          &emsp;
          <div className="col-9 d-flex p-0 user-profile-rt">
            <div>
              <h6 className="owner-name-h6">{current_user?.name}</h6>
              <p className="owner-username-p">@{current_user?.username}</p>
            </div>
            <div>
              <span className="rt-preview-owner">
                {allWords.misc.livert.owner}
              </span>
            </div>
          </div>
        </div>
        <div className="rt-details-preview">
          <div className="rt-preview-image-div">
            <div className="rt-preview-live">
              {label === `${allWords.rt.label2.toLowerCase()}` ? (
                <div className="d-flex align-items-center">
                  <lottie-player
                    src="https://assets7.lottiefiles.com/packages/lf20_ua3gryvm.json"
                    background="transparent"
                    speed="0"
                    style={LiveLottie}
                  />
                  {broadcastStreaming &&
                    PLATFORM_DETAILS[PLATFORMS.YOUTUBE].smallIcon}
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <span className="upcomingLabel">{allWords.rt.label3} </span>
                  {broadcastStreaming &&
                    PLATFORM_DETAILS[PLATFORMS.YOUTUBE].smallIcon}
                </div>
              )}
            </div>
            <img
              src={
                rtImageUrl ? rtImageUrl : "/assets/icons/thumbnail_preview.svg"
              }
              alt="rt-preview"
              className="rt-preview-img"
            />
            <span className="rt-preivew-timer-span">
              {durationHr.value || durationMin.value || durationSec.value ? (
                <span className="rt-preview-time-val">
                  {durationHr.value < 9
                    ? `0${durationHr.value}`
                    : durationHr.value}
                  :
                  {durationMin.value < 9
                    ? `0${durationMin.value}`
                    : durationMin.value}
                  :
                  {durationSec.value < 9
                    ? `0${durationSec.value}`
                    : durationSec.value}
                </span>
              ) : null}
              <span className="rt-preview-dot"></span>
              {rtPlayType === `${allWords.rt.opt2.toLowerCase()}` ? (
                <MemoAudioBased
                  width="14px"
                  height="14px"
                  fontSize="0.4rem"
                  color="#ED4D29"
                  marginTop="1px"
                />
              ) : (
                <MemoVideoBased
                  width="14px"
                  height="14px"
                  fontSize="0.4rem"
                  color="#ED4D29"
                  marginTop="1px"
                />
              )}
            </span>
          </div>
          <div className="rt-details-div">
            {rtTopic ? <p className="rt-topic-p">{rtTopic} </p> : null}
            {rtDescription ? (
              <div className="rt-details-read-more">
                <ReadMoreComponent
                  propStyles={ReadMorePropsStyle}
                  textSliceVal="85"
                  readMoreStyle={ReadMoreStyle}
                  textSpanStyles={{
                    ...textSpanStyles,
                    WebkitLineClamp: "2",
                    display: "inline",
                    width: "100%",
                  }}
                  textLengthVal={100}
                  showDotsStyle={{ display: "inline" }}
                >
                  {rtDescription}
                </ReadMoreComponent>
              </div>
            ) : null}
            <div className="rt-user-details-div">
              {moderator ? (
                <>
                  <h6>{allWords.misc.livert.moderator}</h6>
                  <UserComponent
                    name={moderator.value}
                    username={moderator.label}
                  />
                </>
              ) : null}
              {moderatorIntroduction ? (
                <div className="rt-details-read-more">
                  <ReadMoreComponent
                    propStyles={{
                      ...ReadMorePropsStyle,
                      height: "3rem",
                      display: "flex",
                    }}
                    readMoreStyle={ReadMoreStyle}
                    dialogTitle={`Introduction of @${moderator?.label}`}
                    textSpanStyles={textSpanStyles}
                  >
                    {moderatorIntroduction}
                  </ReadMoreComponent>
                </div>
              ) : null}
            </div>
            <div className="rt-user-details-div ">
              {panelists?.length > 0 && panelists[0]?.name ? (
                <h6>
                  {allWords.misc.livert.panelists} &#10090;{panelists?.length}
                  &#10091;{" "}
                </h6>
              ) : null}
              {panelists.length > 0
                ? panelists.map((el) => (
                    <div
                      key={Math.random()}
                      className="rt-preview-panelist-single"
                    >
                      {el?.name ? (
                        <UserComponent
                          name={el?.name?.value}
                          username={el.name?.label}
                          showUsername={
                            rtType === `${allWords.rt.opt3.toLowerCase()}`
                              ? false
                              : true
                          }
                        />
                      ) : null}

                      {el?.introduction ? (
                        <div className="rt-details-read-more">
                          <ReadMoreComponent
                            propStyles={{
                              ...ReadMorePropsStyle,
                              height: "3rem",
                              display: "flex",
                            }}
                            readMoreStyle={ReadMoreStyle}
                            dialogTitle={`Introduction of @${el.name?.label}`}
                            textSpanStyles={textSpanStyles}
                          >
                            {el?.introduction}
                          </ReadMoreComponent>
                        </div>
                      ) : null}
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewComponent;
