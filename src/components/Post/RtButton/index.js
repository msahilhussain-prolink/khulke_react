import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Redux
import { getRTSingleData } from "../../../redux/actions/roundtableAction/single_roundtable";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
} from "../../../constants/env";
import axios from "axios";
import { Dialog } from "@mui/material";
import { auto_login_continue } from "../../../utils/utils";
import { allWords } from "../../../App";
import logger from "../../../logger";
import { rtActionData } from "../../../redux/actions/roundtableAction/rtAction";

export default function RtButton(props) {
  const { round_table_data } = props;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  // Global state
  const single_rt_data = useSelector((state) => state.single_rt.data);
  const rtAction = useSelector((state) => state.rtActionRed.data);

  //   Local State
  const [rt_flag, setRTFlag] = useState(false);
  const [parsed_data, setParsedData] = useState([]);
  const [notification_text, setNotificationText] = useState("");
  const [notify_box, setNotifyBox] = useState(false);
  const [joinFlg, setJoinFlg] = useState(false);

  const agora_join = (rtid) => {
    let temp_parsed_data = parsed_data;
    let owner =
      temp_parsed_data.owner.username === current_user.username ? true : false;
    let role = null;
    if (
      temp_parsed_data.speakers.find(
        (person) => person.username === current_user.username
      )
    ) {
      if (owner) {
        role = "admin-panellist";
      } else {
        let person = temp_parsed_data.speakers.find(
          (person) => person.username === current_user.username
        );
        if (person.type === "wildcard") {
          role = "wildcard";
        } else {
          role = "panellist";
        }
      }
    } else if (temp_parsed_data.moderator.username === current_user.username) {
      if (owner) {
        role = "admin-moderator";
      } else {
        role = "moderator";
      }
    } else if (owner) {
      role = "admin";
    } else {
      role = "audience";
    }

    localStorage.removeItem("join_rt");
    localStorage.setItem(
      "join_rt",
      JSON.stringify({
        uid: current_user.username,
        rt_id: rtid,
        moderator: temp_parsed_data.moderator,
        speakers: temp_parsed_data.speakers,
        name: current_user.name,
        channelName: temp_parsed_data.agora_channel,
        token: temp_parsed_data.agora_token,
        rt_name: temp_parsed_data.name,
        rt_type: temp_parsed_data.r_type,
        start: temp_parsed_data.start,
        end: temp_parsed_data.end,
        viewer_count: temp_parsed_data.viewer_count,
        role: role,
        blocked_array: temp_parsed_data.blocked_array,
        warn_array: temp_parsed_data.warn_array,
        owner: parsed_data?.owner,
      })
    );
    if (localStorage.join_rt) {
      window.open("/roundtable/join");
    }
  };

  useEffect(() => {
    if (joinFlg) {
      if (rtAction && rtAction?.data?.status === 200) {
        agora_join(
          rtAction?.data?.data?.[0]?.blocked,
          rtAction?.data?.data?.[0]?.warn
        );
      } else {
        if (rtAction && rtAction?.data?.status === 253) {
          if (
            rtAction.data.message !==
            "You're not allowed to join this RoundTable."
          ) {
            if (
              rtAction.data.message ===
              "This round table has been ended by Owner"
            ) {
              setNotifyBox(true);
              setNotificationText("This RoundTable has been ended by Owner");
            } else {
              setNotifyBox(true);
              setNotificationText(rtAction.data.message); //Replace with a dialog popup
            }
          }
        }
      }
    }
  }, [rtAction]);

  const joinRT = async (rtid) => {
    dispatch(rtActionData({ rt_id: rtid, action: "JOIN" }));
    setJoinFlg(true);
  };

  useEffect(() => {
    if (rt_flag === true) {
      if (single_rt_data && single_rt_data?.status === 200) {
        let temp_data = single_rt_data?.data?.[0];
        setParsedData(temp_data);

        if (temp_data?.open_to_all === "public") {
          if (temp_data?.active_flag === false) {
            navigate(`/roundtable?id=${single_rt_data?.data?.[0]?.["_id"]}`);
          } else {
            try {
              joinRT(single_rt_data?.data?.[0]?.["_id"]);
            } catch (error) {
              logger.error(error);
            }
          }
        }
      }
    }
  }, [single_rt_data]);
  return (
    <>
      {round_table_data?.round_table_id && (
        <button
          id="Rt-text-button"
          style={{
            color: "#198754",
            opacity: "0.5",
            marginLeft: "1rem",
            backgroundColor: "rgb(110 247 159 / 28%)",
            borderRadius: "50px",
            border: "rgb(110 247 159 / 28%)",
            padding: "0.4rem",
            paddingTop: "2px",
            paddingBottom: "2px",
            fontSize: "0.8rem",
            fontWeight: "600",
            textAlign: "center",
          }}
          onClick={() => {
            setRTFlag(true);
            dispatch(
              getRTSingleData({
                rt_id: round_table_data?.round_table_id,
                token:
                  localStorage.access ||
                  JSON.parse(localStorage.anonymous_user)?.["token"],
              })
            );
          }}
        >
          {allWords.misc.livert.rt}
        </button>
      )}

      <Dialog
        title={"RoundTable"}
        open={notify_box}
        setOpen={setNotifyBox}
        onCloseBtnClick={() => {
          setNotifyBox(false);
        }}
      >
        <div className="container text-center py-5">
          <small>
            {" "}
            <strong className="text-muted">{notification_text}</strong>{" "}
          </small>
        </div>
      </Dialog>
    </>
  );
}
