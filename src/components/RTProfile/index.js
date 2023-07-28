import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

// Components
import PastButton from "../../pages/PastRT/PastButton";
import PastUserFollow from "../../pages/PastRT/PastUserFollow";

// Material UI
import PersonIcon from "@mui/icons-material/Person";

// Assets
import likedIcon from "../../assets/images/likedIcon.png";
import dislikedIcon from "../../assets/images/disLikedIcon.png";

import "./style.css";
import PreloginComp from "../PreLoginComp";
import { useDispatch, useSelector } from "react-redux";
import { userProfileData } from "../../redux/actions/profileAction/userProfileAction";
import UserProfile from "../UserProfile";
import VipComp from "../VipComp";
import { allWords } from "../../App";

export default function RTProfile(props) {
  const {
    hideSection = false,
    hideFull = false,
    rt_data,
    rt_id,
    like,
    setLike,
    dislike,
    setDislike,
    removeAction,
    getLikeDislikeCount,
    btnDisable,
    setBtnDisable,
  } = props;

  // Global State
  const user_profile = useSelector((state) => state.user_profile.data);

  // Local State
  const [pastData, setPastData] = useState({ title: "", txt: "" });
  const [is_following, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [disLikeCount, setDisLikeCount] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      userProfileData({ username: rt_data?.[0]?.["owner"]?.["username"] })
    );
    setLikeCount(rt_data?.[0]?.["like_count"]);
    setDisLikeCount(rt_data?.[0]?.["dislike_count"]);
  }, [rt_data]);

  useEffect(() => {
    if (user_profile && user_profile.status === 200) {
      setFollowerCount(user_profile?.data?.["count"]?.["followers"]);
      if (user_profile?.data?.["is_following"] === "False") {
        setIsFollowing(false);
      } else {
        setIsFollowing(true);
      }
    }
  }, [user_profile]);

  return (
    <>
      <div className="rt-title-for-past-rt">
        <h1>{rt_data?.[0]?.title}</h1>
      </div>
      <div
        className="leftBottom"
        hidden={window.screen.width <= 1200 ? hideSection || hideFull : false}
      >
        <div className="d-flex pastProfile">
          <div className="d-flex align-items-center">
            <div className="user-profile-wrapper">
              <UserProfile
                username={rt_data?.[0]?.["owner"]?.["username"]}
                width="50px"
                height="50px"
                borderRadius="50%"
                className={`profile-circle ${
                  rt_data?.[0].active_flag ? "red-border" : ""
                }`}
              />
              {rt_data?.[0].active_flag && (
                <div className="live-rectangle">
                  <div className="live-text">Live</div>
                </div>
              )}
            </div>
            &emsp;
            <div>
              <Typography
                className="profile-name"
                onClick={() => {
                  window.open(
                    `${window.location.origin}/profile/${rt_data?.[0]?.["owner"]?.["username"]}`
                  );
                }}
              >
                @{rt_data?.[0]?.["owner"]?.["username"]}
                <VipComp user_type={rt_data?.[0]?.moderator.user_type} />
              </Typography>
              <Typography className="follwers-count">
                {followerCount} {allWords.misc.livert.followers}
              </Typography>
            </div>
          </div>
          &emsp; &nbsp;
          <PastUserFollow
            username={rt_data?.[0]?.["owner"]?.["username"]}
            is_following={is_following}
            setModalOpen={setModalOpen}
            setPastData={setPastData}
          />
        </div>
        <PastButton
          rt_id={rt_id}
          setModalOpen={setModalOpen}
          setPastData={setPastData}
          username={rt_data?.[0]?.["owner"]?.["username"]}
          likeCount={likeCount}
          setLikeCount={setLikeCount}
          dislikeCount={disLikeCount}
          setDisLikeCount={setDisLikeCount}
          like={like}
          setLike={setLike}
          dislike={dislike}
          setDislike={setDislike}
          removeAction={removeAction}
          getLikeDislikeCount={getLikeDislikeCount}
          btnDisable={btnDisable}
          setBtnDisable={setBtnDisable}
          rt_data={rt_data}
          hideFull={hideFull}
          hideSection={hideSection}
        />
      </div>

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          pastData?.title === "follow" ? (
            <PersonIcon style={{ color: "#66B984" }} width={40} height={40} />
          ) : pastData?.title === "like" ? (
            <img src={likedIcon} alt="" />
          ) : pastData?.title === "dislike" ? (
            <img src={dislikedIcon} alt="" />
          ) : (
            ""
          )
        }
        title={pastData?.txt}
        description={""}
      />
    </>
  );
}
