import React from "react";
import styled from "styled-components";
import { allWords } from "../../App";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  .btn_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

const Button = styled.button`
  width: 200px;
  height: 50px;
  outline: none;
  border-radius: 5px;
  color: ${(props) => (props.primary ? props.theme.color.primary : "white")};
  background-color: ${(props) =>
    props.bgColor ? props.theme.color.secondary : "white"};
  border: 2px solid
    ${(props) =>
      props.primary ? props.theme.color.primary : props.theme.color.secondary};

  @media only screen and (max-width: 768px) {
    width: 100px;
  }
`;

const LeaveBtn = styled(Button)`
  border: 1px solid #66b984 !important;
  padding: 0.5rem !important;
  margin-top: 1rem !important;
  color: #66b984 !important;
  width: 200px;

  @media only screen and (max-width: 768px) {
    width: 100px;
  }
`;

const LeaveMeeting = ({
  leaveChannel,
  setLeaveMeeting,
  setOpenPopup,
  isRecording,
  startedRecording,
  typeOfRT,
}) => {
  return (
    <Container>
      <small>{allWords.misc.livert.leaveRtDesc}</small>
      <div className="btn_container custom_side">
        <LeaveBtn
          style={{ marginTop: "1rem" }}
          primary
          onClick={() => {
            if (document?.fullscreenEnabled) {
              document?.exitFullscreen();
            }
            setLeaveMeeting(false);

            if (!localStorage.current_user && localStorage.anonymous_user) {
              return leaveChannel(false);
            }

            // if recording is on, show popup
            // if recording was on, show popup
            //
            if (typeOfRT !== "public") {
              return leaveChannel(false);
            }

            if (isRecording) {
              return setOpenPopup(true);
            } else {
              if (startedRecording) {
                return setOpenPopup(true);
              }
            }

            leaveChannel(false);
          }}
        >
          <span className="leave-meeting-span-yes d-none">
            {allWords.misc.yes}
          </span>
          <span className="leave-meeting-span">{allWords.misc.leaveQ}</span>
        </LeaveBtn>
        <Button
          style={{ marginTop: "1rem" }}
          bgColor
          onClick={() => {
            setLeaveMeeting(false);
          }}
        >
          <span className="leave-meeting-span-no d-none">
            {allWords.misc.no}
          </span>
          <span className="leave-meeting-span-no-stay">
            {allWords.misc.nostay}
          </span>
        </Button>
      </div>
    </Container>
  );
};

export default LeaveMeeting;
