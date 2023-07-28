import React, { useRef } from "react";
import axios from "axios";

// Constants
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";

// Utils
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import { allWords } from "../../App";

export default function PastUserFollow(props) {
  const { username, is_following, setModalOpen, setPastData } = props;

  const follows = useRef(false);

  const follow_unfollow_driver = async (handle, type) => {
    if (!handle) {
      return;
    }
    let temp1 = follows.current.innerHTML;
    let temp = "";
    if (temp1 === allWords.misc.livert.follow) {
      temp = "follow";
    } else {
      temp = "unfollow";
    }
    let data = JSON.stringify({ handle, type: temp });
    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/follow-friends/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(async (res) => {
        if (res.status === 200) {
          if (res.data.message == "User added successfully") {
            let followingConcat = localStorage
              .getItem("followings")
              .concat(",", handle);
            localStorage.setItem("followings", followingConcat);
          }
          if (res.data.message == "User unfollowed") {
            let followingFromLS4arr2 = Array.from(
              localStorage.getItem("followings").split(",")
            );
            localStorage.setItem(
              "followings",
              followingFromLS4arr2.filter((i) => i !== handle)
            );
          }
          if (temp === "unfollow") {
            follows.current.classList = ["follow-button-small"];
            follows.current.innerHTML = "Follow";
          } else {
            follows.current.classList = ["following-button-small"];
            follows.current.innerHTML = "Following";
          }
        }

        if (res.data.message == "User added successfully") {
          moengageEvent("Follow", "User", {
            IdOth: res?.data?.data?.["user_other"]?.["_id"],
            UsernameOth: res?.data?.data?.["user_other"]?.["username"],
          });
          // window.Moengage?.track_event("Follow", {
          //   username: JSON.parse(
          //     localStorage.current_user || localStorage.anonymous_user
          //   ).username,
          //   userid: JSON.parse(
          //     localStorage.current_user || localStorage.anonymous_user
          //   )._id,
          //   "followed username": res?.data?.data?.["user_other"]?.["username"],
          //   "followed userid": res.data.data["user_other"]["_id"],
          // });
        }

        if (res.data.message == "User unfollowed") {
          moengageEvent("UnFollow", "User", {
            IdOth: res?.data?.data?.["user_other"]?.["_id"],
            UsernameOth: res?.data?.data?.["user_other"]?.["username"],
          });
          // window.Moengage?.track_event("Unfollow", {
          //   username: JSON.parse(
          //     localStorage.current_user || localStorage.anonymous_user
          //   ).username,
          //   userid: JSON.parse(
          //     localStorage.current_user || localStorage.anonymous_user
          //   )._id,
          //   "unfollowed username":
          //     res?.data?.data?.["user_other"]?.["username"],
          //   "followed userid": res.data.data["user_other"]["_id"],
          // });
        }
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(() =>
            follow_unfollow_driver(handle, type)
          );
        }
      });
  };

  return (
    <div style={{ display: "flex", alignSelf: "center" }}>
      {username !==
        JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
        "username"
        ] && (
          <button
            style={{
              fontSize: "0.9rem",
              padding: "0rem 2rem",
              height: "35px",
              marginTop: "0",
            }}
            className={
              is_following ? `following-button-small` : `follow-button-small`
            }
            ref={follows}
            onClick={() => {
              if (!localStorage.current_user && localStorage.anonymous_user) {
                setModalOpen(true);
                setPastData({
                  title: "follow",
                  txt: "For follow, Login or sign up to Khul Ke",
                });
                return;
              }
              follow_unfollow_driver(username, is_following);
            }}
          >
            {is_following ? allWords.misc.livert.following : allWords.misc.livert.follow}
          </button>
        )}
    </div>
  );
}
