import AudienceList from "./AudienceList";
import { TimeImg, Visibility } from "../style";
import { useEffect, useRef, useState } from "react";
import Viewer from "../../../assets/icons/Group 19646.svg";
import { useSelector } from "react-redux";
import { rt_id, useClient_RTM } from "../../../pages/AgoraSandbox/settings";
import { allWords } from "../../../App";
import Viewers from "../../../assets/icons/comp/Viewers";
import { Badge } from "@mui/material";
export default function ShowAudienceList(props) {
  //props destructuring here
  const { open, rtm_channel, disabledWildcardAddition } = props;

  //state selector
  const raisehand = useSelector((state) => state.raiseHand.showRaiseHand);
  const fullScr = useSelector((state) => state.fullScreen.full);

  //states here
  const [showAudienceList, setShowAudienceList] = useState(false);

  //setting position for participant list here
  const [style, setStyle] = useState({});
  const participantRef = useRef();

  // This the count of participants in header
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (!rtm_channel || !useClient_RTM) return;

    useClient_RTM.getChannelMemberCount([rt_id]).then((data) => {
      const count = data[rt_id];
      setParticipantCount(count);
    });

    const memberCountUpdatedEvent = (memberCount) => {
      setParticipantCount(memberCount);
    };

    rtm_channel.on("MemberCountUpdated", memberCountUpdatedEvent);

    //cleanup function
    return () => {
      rtm_channel?.off("MemberCountUpdated", memberCountUpdatedEvent);
    };
  }, [rtm_channel, useClient_RTM]);

  useEffect(() => {
    if (!participantRef.current) return;

    const elem = participantRef.current.getBoundingClientRect();

    setStyle({
      top: `${elem.top + 40}px`,
      right: `calc(100% - ${elem.right}px)`,
    });

    const onresizeEvent = () => {
      const elem = participantRef.current.getBoundingClientRect();

      setStyle({
        top: `${elem.top + 40}px`,
        right: `calc(100% - ${elem.right}px)`,
      });
    };

    window.addEventListener("resize", onresizeEvent);

    return () => {
      window.removeEventListener("resize", onresizeEvent);
    };
  }, [participantRef, raisehand, fullScr]);

  return (
    <div>
      <button
        style={{
          display: 'flex',
          alignItems: "center",
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          marginRight: "10px",
        }}
        onClick={() => {
          setShowAudienceList((prev) => !prev);
        }}
        ref={participantRef}
      >
        <span className="participants-list-icon">
          {/* <Badge
            sx={{
              "& .MuiBadge-badge": {
                color: "white",
                backgroundColor: "#EC5A61",
              },
            }}
            badgeContent={participantCount ?? 0}
            max={99}
          > */}
          <Viewers />
          {/* </Badge> */}
        </span>
        <span className="mobile-participant-badge">
          &nbsp; <TimeImg src={Viewer} /> Participants:&nbsp;
        </span>
        {!fullScr && (
          <small disabled={true} className="participants-link-header">
            {participantCount}
          </small>
        )}

        {fullScr && (
          <small
            style={{
              color: "#EC5A61",
              cursor: "default",
              fontSize: "1.2rem",
            }}
            disabled={true}
            className="participants-link-header"
          >
            {participantCount}
          </small>
        )}
      </button>
      {showAudienceList === true && open === false && (
        <AudienceList
          setShowAudienceList={setShowAudienceList}
          showAudienceList={showAudienceList}
          participantCount={participantCount}
          style={style}
          disabledWildcardAddition={disabledWildcardAddition}
        />
      )}
    </div>
  );
}
