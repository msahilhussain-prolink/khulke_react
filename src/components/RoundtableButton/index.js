import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// Constants
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
} from "../../constants/env";

// Assets
import left_arrow from "../../assets/icons/arrow.svg";
import RoundTableIconActive from "../../assets/icons/RoundTable_icon_active.svg";
import { getRTReminderData } from "../../redux/actions/roundtableAction/set_reminder";
import { requestAccessData } from "../../redux/actions/roundtableAction/requestAccess";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import PreloginComp from "../PreLoginComp";
import { ScheduleOutlined } from "@material-ui/icons";
import { allWords } from "../../App";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";

export default function RoundtableButton(props) {
  const {
    rt_id,
    parsed_data,
    status,
    current_user,
    setNotifyBox,
    setNotificationText,
    setRequestMsg,
    request_msg_ref,
  } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  //   Global State
  const set_reminder = useSelector((state) => state.set_reminder.data);
  const set_reminder_error = useSelector((state) => state.set_reminder.error);
  const request_access = useSelector((state) => state?.request_access?.data);
  const request_access_error = useSelector(
    (state) => state?.request_access?.error
  );
  const rtAction = useSelector((state) => state.rtActionRed.data);

  // useState
  const [join_btn, setJoinBtn] = useState(false);
  const [reminder_btn, setReminderBtn] = useState(false);
  const [request_access_btn, setRequestAccessBtn] = useState(false);
  const [rem_set, setRemSet] = useState(false);
  const [set_reminder_status, setReminderStatus] = useState(rem_set);
  const [request_set, setRequestSet] = useState(false);
  const [set_request_access, SetRequestAccess] = useState(request_set);
  const [is_cancelled, setIsCancelled] = useState(false);
  const [joinCount, setJoinCount] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [titleType, setTitleType] = useState("");
  const [joinFlg, setJoinFlg] = useState(false);

  const url_params = new URL(window.location.href);

  //   useEffect
  useEffect(() => {
    if (parsed_data) {
      setRemSet(parsed_data?.["reminder_set"] || parsed_data?.["was_invited"]);

      setRequestSet(
        parsed_data?.["request_access"] || parsed_data?.["was_invited"]
      );

      if (status !== "past") {
        if (parsed_data?.open_to_all === "public") {
          if (parsed_data?.active_flag) {
            setJoinBtn(true);
            setReminderBtn(false);
            setRequestAccessBtn(false);
          } else if (status === "upcoming") {
            setJoinBtn(false);
            setRequestAccessBtn(false);
            setReminderBtn(true);
            setReminderStatus(
              parsed_data?.reminder_set !== undefined ||
                parsed_data?.was_invited !== undefined
                ? parsed_data?.reminder_set || parsed_data?.was_invited
                : true
            );
          }
        } else if (parsed_data?.open_to_all === "private") {
          if (parsed_data?.active_flag) {
            if (
              parsed_data?.was_invited === true ||
              parsed_data?.was_invited === undefined
            ) {
              setJoinBtn(true);
              setReminderBtn(false);
              setRequestAccessBtn(false);
            } else {
              setJoinBtn(false);
              setReminderStatus(false);
              setRequestAccessBtn(true);
            }
          } else if (status === "upcoming") {
            if (
              parsed_data?.was_invited === true ||
              parsed_data?.was_invited === undefined
            ) {
              setJoinBtn(false);
              setReminderBtn(true);
              setRequestAccessBtn(false);
              setReminderStatus(
                parsed_data?.reminder_set !== undefined
                  ? parsed_data?.reminder_set
                  : true
              );
            } else {
              setJoinBtn(false);
              setReminderStatus(false);
              setRequestAccessBtn(true);
            }
          }
        } else if (parsed_data?.open_to_all === "secret") {
          if (
            parsed_data?.was_invited === true ||
            parsed_data?.was_invited === undefined
          ) {
            if (parsed_data?.active_flag) {
              setJoinBtn(true);
              setReminderStatus(false);
              setRequestAccessBtn(false);
            } else if (status === "upcoming") {
              setJoinBtn(false);
              setRequestAccessBtn(false);
              setReminderStatus(true);
              setReminderStatus(parsed_data?.reminder_set);
            }
          } else {
            navigate("/roundtable/all", { replace: true });
          }
        }
        setIsCancelled(false);
      } else {
        setJoinBtn(false);
        setRequestAccessBtn(false);
        setReminderStatus(false);
        setReminderBtn(false);
        setIsCancelled(parsed_data?.["is_cancelled"]);
        setJoinCount(parsed_data?.join_count);
      }
    }
  }, [parsed_data]);

  useEffect(() => {
    if (set_reminder) {
      if (set_reminder.status === 200) {
        setReminderStatus(true);
      } else {
        setReminderStatus(false);
      }
    }

    if (set_reminder_error) {
      setReminderStatus(false);
    }
  }, [set_reminder, set_reminder_error]);

  useEffect(() => {
    if (request_access) {
      if (request_access?.status === 200) {
        request_msg_ref.current.classList = ["text-success"];
        SetRequestAccess(true);
        setRequestMsg(request_access?.data?.message);
      } else if (request_access?.status === 253) {
        SetRequestAccess(true);
        request_msg_ref.current.classList = ["warn-text"];
        setRequestMsg(request_access.data.message);
      } else {
        setRequestMsg("");
      }
    }

    if (request_access_error) {
      SetRequestAccess(false);
      setRequestMsg("");
    }
  }, [request_access, request_access_error]);

  const handleSetReminder = async () => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      setModalOpen(true);
      setTitleType("set_reminder");
      return;
    }
    dispatch(getRTReminderData({ rt_id: rt_id }));
  };

  const handleRequestAccess = async () => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      setModalOpen(true);
      setTitleType("request_access");
      return;
    }
    dispatch(requestAccessData({ rt_id: rt_id }));
  };

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
      navigate("/roundtable/join");
    }
  };

  useEffect(() => {
    if (joinFlg) {
      if (rtAction && rtAction?.data?.status === 200) {
        agora_join(
          rtAction?.data?.data?.[0]?.blocked,
          rtAction?.data?.data?.[0]?.warn
        );
        moengageEvent("Join", "RoundTable", {
          RoundTableID: rt_id,
          Name: parsed_data.name,
          "K Type": parsed_data.r_type,
          "K SubType": parsed_data.open_to_all,
          "Audience Interaction": 0,
        });
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
    if (
      location?.state?.rt_details_value !== "details_page" ||
      location?.state?.rt_details_value === undefined
    ) {
      if (join_btn === true) {
        joinRT(url_params.searchParams.get("id"));
      } else if (
        is_cancelled === 0 &&
        joinCount !== 0 &&
        parsed_data?.open_to_all !== "secret"
      ) {
        playIncrement2();
      }
    }
  }, [join_btn, is_cancelled, joinCount, parsed_data]);

  async function playIncrement2() {
    navigate(`/roundtable/recorded/${rt_id}`);
  }

  return (
    <>
      {reminder_btn && (
        <>
          {rem_set || set_reminder_status ? (
            <button
              style={{ left: "38%" }}
              className="set-reminder-white bottom-center"
            >
              {allWords.misc.rset}
            </button>
          ) : (
            // <span></span>
            <>
              <button
                className="set-reminder-red bottom-center"
                onClick={handleSetReminder}
                id="reminder_button"
              >
                <ScheduleOutlined
                  className="icon"
                  style={{ alignSelf: "center" }}
                />
                &nbsp;Set Reminder
              </button>
            </>
          )}
        </>
      )}
      {join_btn && (
        <button
          className="request-acccess-green bottom-center"
          style={{
            left: "40%",
            padding: "7px 27px",
            fontSize: "1rem",
          }}
          onClick={() => {
            joinRT(rt_id);
          }}
        >
          Join Now
        </button>
      )}
      {request_access_btn && (
        <>
          {request_set || set_request_access ? (
            <button
              style={{
                left: "36%",
                padding: "7px 27px",
                fontSize: "1rem",
              }}
              className="request-acccess-white bottom-center"
            >
              Request Sent
            </button>
          ) : (
            <button
              className="request-acccess-green bottom-center"
              style={{ left: "36%", padding: "7px 27px", fontSize: "1rem" }}
              onClick={handleRequestAccess}
              id="request_access"
            >
              Request Access
            </button>
          )}
        </>
      )}
      {status === "past" &&
        is_cancelled === 0 &&
        joinCount > 0 &&
        parsed_data?.open_to_all !== "secret" && (
          <button
            style={{ padding: "7px 20px", fontSize: "14px" }}
            id="join_button"
            className="request-acccess-green bottom-center"
            onClick={() => playIncrement2()}
          >
            Play &nbsp;{" "}
            <img
              style={{ width: "25px" }}
              alt="Join this RT"
              id="join-button-arrow"
              src={left_arrow}
            />
          </button>
        )}

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          titleType === "set_reminder" ? (
            <ScheduleOutlined
              className="icon"
              style={{
                alignSelf: "center",
                color: "#f1c40f",
                fontSize: "40px",
              }}
            />
          ) : titleType === "request_access" ? (
            <img src={RoundTableIconActive} alt="" width={40} height={40} />
          ) : null
        }
        title={
          titleType === "set_reminder"
            ? "For set reminder, Login or sign up to Khul Ke"
            : titleType === "request_access"
            ? "For request access, Login or sign up to Khul Ke"
            : ""
        }
        description={""}
      />
    </>
  );
}
