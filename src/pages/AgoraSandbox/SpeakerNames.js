import { useEffect, useState } from "react";
import "./video.css";
import VIPComp from "../../components/VipComp";
import { allWords } from "../../App";

export default function SpeakerNames(props) {
  const {
    moderator,
    stage_uids,
    wc_uids,
    userid,
    nameSize,
    roleSize,
    test,
    user_type,
  } = props;

  //Local states here
  const [speakerRole, setSpeakerRole] = useState("");

  //effects here

  useEffect(() => {
    if (userid === moderator.username) {
      setSpeakerRole(allWords.misc.livert.mMODERATOR);
    } else if (wc_uids.includes(userid)) {
      setSpeakerRole(allWords.misc.livert.mWIDLCARD);
    } else if (
      stage_uids.includes(userid) &&
      userid !== moderator.username &&
      !wc_uids.includes(userid)
    ) {
      setSpeakerRole(allWords.misc.livert.mPANELIST);
    }
  }, [wc_uids, stage_uids, userid]);

  return (
    <>
      {test >= 5 ? (
        <div
          style={{
            display: "flex",
            // alignItems: "center",
            flexDirection: "column",
            justifyContent: "flex-start",
            fontSize: nameSize || "0.9rem",
            // backgroundColor: "grey",
            opacity: "0.8",
            padding: "2px 10px",
            borderRadius: "5px",
            // backgroundColor: "rgba(0,0,0,0.0)",
            // backdropFilter: " saturate(180%) blur(10px)",
            backdropFilter: "grayscale() blur(10px)" /* Chrome and Opera */,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <span className="Ltooltips">
            <span
              style={{
                width: userid?.length > 15 ? "10rem" : "fit-content",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              @{userid}
            </span>
            {userid?.length > 15 ? (
              <span className="Ltooltiptext" style={{ marginLeft: "-80px" }}>
                {userid}
              </span>
            ) : null}
            <VIPComp
              user_type={user_type}
              overrideVipStyle={{ marginTop: "-10px" }}
            />
          </span>
          <div
            style={{
              fontSize: roleSize || "0.65rem",
              // marginLeft: "5px",
            }}
          >
            [{speakerRole}]
          </div>
        </div>
      ) : (
        <>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: nameSize || "0.95rem",
              // backgroundColor: "grey",
              opacity: "0.8",
              padding: "2px 5px",
              borderRadius: "5px",
              backgroundColor: "rgba(0,0,0,0.0)",
              backdropFilter: " saturate(180%) blur(10px)",
            }}
            className="name-of-the-speakers"
          >
            <span className="Ltooltips">
              <span
                style={{
                  width: userid?.length > 15 ? "10rem" : "fit-content",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
              >
                @{userid}
              </span>
              {userid?.length > 15 ? (
                <span className="Ltooltiptext" style={{ marginLeft: "-80px" }}>
                  {userid}
                </span>
              ) : null}
              <VIPComp
                user_type={user_type}
                overrideVipStyle={{ marginTop: "-10px" }}
              />
            </span>

            <span
              style={{
                fontSize: roleSize || "0.75rem",
                marginLeft: "5px",
                // marginTop: speakerRole !== "WILDCARD" ? "-5px" : "0",
                marginTop: "-5px",
              }}
              className="speaker-role"
            >
              [ {speakerRole} ]
            </span>
          </span>
        </>
      )}
    </>
  );
}
