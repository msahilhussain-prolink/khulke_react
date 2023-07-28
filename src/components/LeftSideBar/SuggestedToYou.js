import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import Spinner from "../Spinner";
import MemoSuggesstion from "../SuggestionCard";
import { CardContainer, SuggestionTitle } from "../SuggestionCard/style";
import { allWords } from "../../App";

export default function SuggestedToYou() {
  const suggested_err = useSelector((state) => state.suggestion.error);
  let suggested = useSelector((state) => state.suggestion.interest);

  const [data_error, setDataError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [curated, setCurated] = useState([]);

  useEffect(() => {
    if (suggested_err) {
      setDataError("Something went wrong while gettings suggested users list");
    } else if (suggested) {
      setCurated(
        localStorage.current_user && !localStorage.anonymous_user
          ? suggested["data"]
          : suggested?.["data"]?.[0]
      );
      setLoading(false);
    }
  }, [suggested, suggested_err]);

  //Follow users
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
          moengageEvent(type === "follow" ? "Follow" : "UnFollow", "User", {
            IdOth: "",
            UsernameOth: handle,
          });

          let temp_solution = [...curated];
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
      .catch(async (err) => {
        const res = err.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(() =>
            follow_unfollow_driver(handle, type)
          );
        }
      });
  };

  return (
    <>
      {data_error ? (
        <div className="container text-center mt-5">
          <p className="warn-text">{allWords.th.suggestion.error}</p>
        </div>
      ) : (
        <>
          {loading ? (
            <Spinner />
          ) : curated !== allWords.th.suggested.noUser ? (
            <MemoSuggesstion
              render_points={curated}
              btn_fucntion={follow_unfollow_driver}
              type={"follow"}
              need_badge={false}
            />
          ) : (
            <CardContainer>
              <SuggestionTitle className="text-center">
                <small className="alert-text">
                  {allWords.th.suggestion.noUser}
                </small>
              </SuggestionTitle>
            </CardContainer>
          )}
          <br />
        </>
      )}
    </>
  );
}
