import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinRT } from "../../../apis/roundatbleAPI";
import { allWords } from "../../../App";
import { rejectAcceptData } from "../../../redux/actions/InvitationAction/rejectAcceptInv";
import { rtActionData } from "../../../redux/actions/roundtableAction/rtAction";
import { getRTSingleData } from "../../../redux/actions/roundtableAction/single_roundtable";
import "../style.css";

export default function InvitationButton(props) {
  const {
    index,
    setIndex,
    setSlideDetails,
    numSlides,
    label,
    setStartTimer,
    setClicked,
    ind,
    setInvPop,
    item,
  } = props;

  const dispatch = useDispatch();

  const single_rt_data = useSelector((state) => state.single_rt.data);
  const rtAction = useSelector((state) => state.rtActionRed.data);

  const [btnFlag, setBtnFlag] = useState(false);
  const [joinFlg, setJoinFlg] = useState(false);

  const jRT = (rt_id) => {
    setJoinFlg(true);
    dispatch(rtActionData({ rt_id: rt_id, action: "JOIN" }));
  };

  useEffect(() => {
    if (joinFlg) {
      if (rtAction && rtAction?.data?.status == 200) {
        dispatch(
          getRTSingleData({
            rt_id: item?.rt_id,
            token:
              localStorage.access ||
              JSON.parse(localStorage.anonymous_user).token,
          })
        );
        setBtnFlag(true);
      }
    }
  }, [rtAction, joinFlg]);

  useEffect(() => {
    if (btnFlag === true) {
      if (single_rt_data && single_rt_data?.status === 200) {
        setBtnFlag(false);
        let rt_details = single_rt_data?.data?.[0];
        let role = null;

        let current_user = JSON.parse(
          localStorage.current_user || localStorage.anonymous_user
        );

        const speakerFlag = rt_details?.["speakers"]?.find((item) =>
          item?.username === current_user?.["username"] ? true : false
        );

        if (speakerFlag) {
          if (
            rt_details?.["owner"]?.["username"] === current_user?.["username"]
          ) {
            role = "admin-panellist";
          } else {
            role = "panellist";
          }
        } else if (
          rt_details?.["moderator"]?.["username"] === current_user?.["username"]
        ) {
          if (
            rt_details?.["owner"]?.["username"] === current_user?.["username"]
          ) {
            role = "admin-moderator";
          } else {
            role = "moderator";
          }
        } else if (
          rt_details?.["owner"]?.["username"] === current_user?.["username"]
        ) {
          if (
            rt_details?.["moderator"]?.["username"] ===
            current_user?.["username"]
          ) {
            role = "admin-moderator";
          } else {
            role = "admin";
          }
        } else {
          role = "audience";
        }
        localStorage.removeItem("join_rt");
        localStorage.setItem(
          "join_rt",
          JSON.stringify({
            uid: JSON.parse(
              localStorage.current_user || localStorage.anonymous_user
            )?.username,
            rt_id: item?.rt_id,
            moderator: rt_details?.moderator,
            speakers: rt_details?.speakers,
            name: JSON.parse(
              localStorage.current_user || localStorage.anonymous_user
            )?.name,
            channelName: rt_details.agora_channel,
            token: rt_details.agora_token,
            rt_name: rt_details.name,
            rt_type: rt_details.r_type,
            start: rt_details.start,
            end: rt_details.end,
            viewer_count: rt_details.viewer_count,
            role: role,
            blocked_array: [],
            warn_array: [],
            owner: rt_details?.owner,
          })
        );

        if (localStorage.join_rt) {
          window.location.replace("/roundtable/join");
        }
      }
    }
  }, [single_rt_data, btnFlag]);

  const incrementcount = (e, direction) => {
    setIndex(index + 1);
    setClicked(e.currentTarget.id * 1 + 1);

    setStartTimer({
      num: 5,
      flag: false,
    });

    if (direction == "left") {
      if (label == "upcoming") {
        dispatch(
          rejectAcceptData({
            url: "reject",
            token: item?.invitation_token,
            rt_id: item?.rt_id,
            role: item?.role,
          })
        );
      }
      setSlideDetails({
        boxAnimate1: "animRotateLeft",
        boxAnimate2: "animLeftSlide",
      });
    } else {
      if (label == "upcoming") {
        dispatch(
          rejectAcceptData({
            url: "confirm",
            token: item?.invitation_token,
            rt_id: item?.rt_id,
            role: item?.role,
          })
        );
      } else {
        jRT(item?.rt_id);
      }
      setSlideDetails({
        boxAnimate1: "animRotateRight",
        boxAnimate2: "animRightSlide",
      });
    }
    if ((direction === "right" && label == "upcoming") || direction === "left")
      if (ind + 1 == numSlides) return setInvPop(false);
  };

  return (
    <div className="mt-4 d-flex" style={{ justifyContent: "center" }}>
      <button
        id={ind}
        className="invBtn invRejectBtn"
        onClick={(e) => {
          incrementcount(e, "left");
        }}
      >
        {label == "live" ? allWords.misc.skip : allWords.misc.reject}
      </button>{" "}
      &emsp;&emsp;
      <button
        id={ind}
        className="invBtn invAcceptBtn"
        onClick={(e) => {
          incrementcount(e, "right");
        }}
      >
        {label == "live" ? allWords.misc.join : allWords.misc.accept}
      </button>
    </div>
  );
}
