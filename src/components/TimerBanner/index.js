import React from "react";
import "./style.css";

const TimerBanner = ({
  bannerColor,
  time="00:00:00",
  isShowButton=false,
  buttonName,
  timerText,
  onButtonClick,
  isShowMin=false,
  timeColor,
}) => {
  return (
    <div
      className="banner"
      style={{
        "--banner-background-color": bannerColor,
        "--time-color": timeColor
      }}
    >
      {timerText}
      <div className="time">
        {time} {isShowMin ? "mins" : ""}
      </div>
      {isShowButton && (
        <button className="banner-button" onClick={onButtonClick}>
          {buttonName}
        </button>
      )}
    </div>
  );
};

export default TimerBanner;
