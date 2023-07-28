import React, { useEffect, useState } from "react";
import { CardContainer } from "./style";
import {
  REACT_APP_BASE_URL_FOR_USER,
  REACT_APP_BASE_URL_FOR_NOTIFICATION,
} from "../../constants/env";
import axios from "axios";
import ARComponent from "./accept_reject_component";
import _ from "lodash";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import ListComponent from "../ListComponent";
import { allWords } from "../../App";
import MessageDiv from "./MessageDiv";
import { globalImages } from "../../assets/imagesPath/images";

const SuggestionCard = ({ setNetworkCount }) => {
  const [followers, setFollowers] = useState([]);
  const [curated, setCurated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aa_notifications, setAANotifications] = useState([]);
  const [error, setError] = useState(false);
  const [error_message, setErrorMessage] = useState("");

  const removeFollowerCount = () => {
    const FormData = require("form-data");
    const data = new FormData();
    data.append("type", "NETWORK");

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_NOTIFICATION}/update`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: data,
    };

    axios(config)
      .then((res) => {
        setNetworkCount(res?.data?.data?.[0]?.["total_count"]);
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(removeFollowerCount);
        }
      });
  };

  const follow_unfollow_driver = async (handle, type) => {
    if (!handle || !type) {
      return;
    }
    let data = JSON.stringify({ handle, type });
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
          let temp_solution = [...followers];
          let toset = true;
          if (type === "unfollow") {
            toset = false;
          }
          for (let i = 0; i < temp_solution.length; i++) {
            if (temp_solution[i]["username"] === handle) {
              temp_solution[i]["is_following"] = toset;
              setCurated(temp_solution);
              return;
            }
          }
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

  const getFollowers = () => {
    const data = JSON.stringify({
      skip: 0,
      limit: 100,
    });

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/get-followers-timeline/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        let temp = [];
        let sorted_temp = [];

        sorted_temp = _.orderBy(
          response.data.data[0]["old_post"][0]["data"],
          "created_at",
          "desc"
        );

        sorted_temp.forEach((item) => {
          if (item.type === "FOLLOW") {
            temp.push({
              username: item["username"],
              name: item["name"] + " started following you",
              is_following: item["you_follow"],
              // formatted_created_at: item["created_at"],
              user_id: item?.["user_id"],
            });
          }
        });

        setFollowers(temp);
        setCurated(temp);
        setLoading(false);

        moengageEvent("View Page", "ALL", {
          URL: `${window.location.origin}/${window.location.pathname}`,
        });
      })
      .catch(async function (error) {
        const response = error.response;

        if (!response) {
          setError(true);
          setErrorMessage(allWords.th.suggested.error);
          setLoading(false);
          return;
        }
        if (response.status === 401) {
          return await auto_login_continue(getFollowers);
        }
        setError(true);
        setErrorMessage(allWords.th.suggested.error);
        setLoading(false);
      });
  };

  //*Get Accepted Accept/Reject Notifications
  const getAANotifications = () => {
    const config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_NOTIFICATION}/get-network-notifications`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
    };

    axios(config)
      .then(async function (response) {
        if (response.status === 200) {
          setAANotifications(response.data["data"]);
        }
      })
      .catch(async (e) => {
        const response = e.response;

        if (!response) return;

        if (response.status === 401) {
          return await auto_login_continue(getAANotifications);
        }
      });
  };

  useEffect(() => {
    getFollowers();
    getAANotifications();
    removeFollowerCount();
  }, []);

  return (
    <>
      {loading && !error && (
        <MessageDiv type={"loading"} error_message={error_message} />
      )}
      {error ? (
        <MessageDiv type={"error"} error_message={error_message} />
      ) : (
        <CardContainer>
          <div className="user_suggestion_container">
            {aa_notifications.length > 0 &&
              aa_notifications.map((item) => {
                return <ARComponent to_render={item} key={item} />;
              })}
            {curated.length > 0 && (
              <ListComponent
                render_points={curated}
                btn_fucntion={follow_unfollow_driver}
                type={"follow"}
                need_badge={false}
                div_border={false}
              />
            )}
            {aa_notifications.length === 0 &&
              curated.length === 0 &&
              !loading && (
                <div className="container text-center py-5 my-3">
                  {/* <small className="text-muted">
                    You have no new notifications!
                  </small> */}
                  <img
                    src={globalImages.si_notif_empty}
                    alt="empty notifications"
                  />
                </div>
              )}
          </div>
        </CardContainer>
      )}
    </>
  );
};

export default SuggestionCard;
