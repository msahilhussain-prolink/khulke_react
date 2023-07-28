import React, { useEffect, useState } from "react";

// Assets
import dislikedIcon from "../../assets/images/disLikedIcon.png";
import dislikeIcon from "../../assets/images/dislikeIcon.png";
import likedIcon from "../../assets/images/likedIcon.png";
import likeIcon from "../../assets/images/like_icon.png";

// Utils
import { allWords } from "../../App";

// Constants
import { useDispatch, useSelector } from "react-redux";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";
import { getRTSingleData } from "../../redux/actions/roundtableAction/single_roundtable";
import { moengageEvent } from "../../utils/utils";
import "./style.css";
import RtShareComponent from "../../components/RtShareComponent";
import ReadMoreDialog from "../../components/CreateEditRoundtable/ReadMoreComponent/ReadMoreDialog";

export default function PastButton(props) {
  const {
    rt_id,
    setModalOpen,
    setPastData,
    username,
    likeCount,
    dislikeCount,
    like,
    setLike,
    dislike,
    setDislike,
    removeAction,
    rt_data,
    hideFull,
    hideSection,
  } = props;

  const [showDescription, setShowDescription] = useState(false);

  const getCurrentUser = () => {
    let current_user = null;
    try {
      current_user = JSON.parse(
        localStorage.current_user || localStorage.anonymous_user
      );
    } catch (err) {}

    return current_user;
  };

  // Global state
  const rtAction = useSelector((state) => state.rtActionRed.data);

  // Local State
  const dispatch = useDispatch();

  useEffect(() => {
    if (rtAction && rtAction?.data?.status == 200) {
      dispatch(
        getRTSingleData({
          rt_id: rt_id,
          token:
            localStorage.access ||
            JSON.parse(localStorage.anonymous_user).token,
        })
      );
      moengageEvent(
        rtAction?.data?.data?.[0]?.["self_like"] === 1 ? "Like" : "Dislike",
        "RoundTable",
        {
          RoundTableID: rt_id,
          Name: rt_data?.[0]?.["name"],
          "K Type": rt_data?.[0]?.["r_type"],
          "K SubType": rt_data?.[0]?.["open_to_all"],
          "Audience Interaction": 0,
        }
      );
      setLike(rtAction?.data?.data?.[0]?.["self_like"] === 1 ? true : false);
      setDislike(
        rtAction?.data?.data?.[0]?.["self_dislike"] === 1 ? true : false
      );
    }
  }, [rtAction]);

  const handleLike = () => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      setModalOpen(true);
      setPastData({
        title: "like",
        txt: allWords.misc.pages.prelogin.mtext,
      });
      return;
    }

    dispatch(rtActionData({ rt_id: rt_id, action: "LIKE" }));
    // setLike(!like);
  };

  const handleDislike = () => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      setModalOpen(true);
      setPastData({
        title: "dislike",
        txt: allWords.misc.pages.prelogin.mtext,
      });
      return;
    }

    // setDislike(!dislike);
    dispatch(rtActionData({ rt_id: rt_id, action: "DISLIKE" }));
  };

  return (
    <div
      className={
        window.location.pathname.includes("join")
          ? "d-flex parent-div"
          : "d-flex leftBottomBtn"
      }
    >
      <div className="parent-container">
        <button className="like-button" onClick={handleLike}>
          <img
            src={like ? likedIcon : likeIcon}
            alt=""
            width={32}
            height={32}
            // className="like-icon"
          />{" "}
          <div className="count">{likeCount}</div>
        </button>
        <div className="divider"></div>
        <button
          className="dislike-button"
          onClick={handleDislike}
          disabled={username === getCurrentUser()?.["username"] ? true : false}
        >
          <img
            src={dislike ? dislikedIcon : dislikeIcon}
            alt=""
            width={32}
            height={32}
            lassName="like-icon"
          />
          {username === getCurrentUser()?.["username"] && (
            <div className="count">{dislikeCount}</div>
          )}
        </button>
      </div>
      {/*  TODO: Will be required in future * /}
      {/* &emsp;
      <div
        className="col-sm-6 col-md-2 col-lg-2"
        style={{ textAlign: "center", width: "auto" }}
      >
        <button
          style={{
            backgroundColor: "#E4E9F0",
            padding: "5px 20px",
            width: "fit-content",
            border: "transparent",
            fontSize: 20,
            borderRadius: 30,
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => {
            ToastHandler("info", "This is an upcoming feature!!!");
          }}
        >
          <OndemandVideo size={25} />
          <span className="ml-2 btnTxt">&nbsp; Snip-It</span>{" "}
        </button>
      </div> */}
      {window.screen.width >= 1200 ? <>&emsp;</> : <>&nbsp;</>}
      {rt_data[0]?.description && rt_data[0]?.description?.length && (
        <button className="pastrt-btn" onClick={() => setShowDescription(true)}>
          Description
        </button>
      )}
      {window.screen.width >= 1200 ? <>&emsp;</> : <>&nbsp;</>}
      <RtShareComponent rt_id={rt_id} className="pastrt-btn" />
      <ReadMoreDialog
        isReadMore={showDescription}
        setIsReadMore={setShowDescription}
        children={rt_data[0]?.description}
        dialogTitle={rt_data[0]?.name}
      />
    </div>
  );
}
