import React, { useState, useEffect } from "react";
import { Backdrop, Typography, CircularProgress } from "@mui/material";
import "./user_list.css";
import axios from "axios";
import UserCard from "./UserCard";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../../constants/env";
import { auto_login_continue } from "../../utils/utils";
import ToastHandler from "../../utils/ToastHandler";
import { FiberManualRecord } from "@material-ui/icons";
import { allWords } from "../../App";

const UserList = (props) => {
  const { rt_id, setShowJoinedUserList, style, other_count, viewer_count } =
    props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState(null);

  const getUserJoinedData = async () => {
    var data = JSON.stringify({
      roundtable_id: rt_id,
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/${
        localStorage.anonymous_user ? "anonymous/" : ""
      }get-participant-list/`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          setData(response.data.data);
        } else {
          setLoading(false);
          setErrorData(response.data.message);
        }
      })
      .catch(async function (error) {
        const res = error.response;
        if (!res) {
          setLoading(false);
          ToastHandler("dan", allWords.misc.somethingwrong);
          return;
        }

        if (res.status === 401) {
          return await auto_login_continue(getUserJoinedData);
        }
        setLoading(false);
        ToastHandler("dan", allWords.misc.somethingwrong);
      });
  };

  useEffect(() => {
    getUserJoinedData();
  }, []);

  useEffect(() => {
    const bodyElement = document.querySelector("body");

    if (setShowJoinedUserList) {
      bodyElement.style.overflow = "hidden";
    } else {
      bodyElement.style.overflow = "auto";
    }

    return () => {
      bodyElement.style.overflow = "auto";
    };
  }, [setShowJoinedUserList]);

  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={setShowJoinedUserList}
      onClick={() => {
        setShowJoinedUserList(false);
      }}
    >
      <div
        className="joinedUserListContainer"
        style={{ ...style, position: "fixed" }}
      >
        {loading && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </div>
        )}
        {data?.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f5f5f5",
            }}
          >
            <Typography
              variant="h6"
              className="participant_container"
              style={{
                marginLeft: "5px",
                fontSize: "1.1rem",
                fontFamily: "WorkSans-Regular",
              }}
            >
              {allWords.misc.livert.Participants}
            </Typography>
            <div style={{ marginRight: "0.8rem", fontWeight: "bold" }}>
              <FiberManualRecord
                style={{
                  color: "green",
                  marginRight: "0.15rem",
                  marginTop: "-0.1rem",
                  opacity: "0.5",
                }}
              />
              {other_count > 0
                ? Number(viewer_count + other_count)
                : Number(viewer_count)}
            </div>
          </div>
        )}
        {errorData ? (
          <Typography textAlign={"center"} sx={{ marginTop: "1rem" }}>
            {errorData}
          </Typography>
        ) : null}
        {/* owner */}
        <Typography
          sx={{
            fontWeight: "bold",
            marginLeft: "0.8rem",
            marginTop: "0.2rem",
          }}
        >
          {data?.filter((val) => {
            if (val.designation === "OWNER") {
              return val;
            }
          }).length > 0
            ? allWords.misc.livert.admin
            : null}
        </Typography>
        {data
          ?.filter((val) => {
            if (val?.designation === "OWNER") {
              return val;
            }
            return null;
          })
          ?.map((item) => (
            <UserCard username={item?.username} user_type={item?.user_type} />
          ))}
        {/* moderator */}
        <Typography
          sx={{
            fontWeight: "bold",
            marginLeft: "0.8rem",
            marginTop: "0.2rem",
          }}
        >
          {data?.filter((val) => {
            if (val.designation === "MODERATOR") {
              return val;
            }
          }).length > 0
            ? allWords.misc.livert.moderator
            : null}
        </Typography>
        {data
          ?.filter((val) => {
            if (val?.designation === "MODERATOR") {
              return val;
            }
            return null;
          })
          ?.sort((a, b) => {
            return a?.username
              ?.toLowerCase()
              ?.localeCompare(b?.username?.toLowerCase());
          })?.map((item) => (
            <UserCard username={item?.username} user_type={item?.user_type} />
          ))}
        {/* panelists */}
        <Typography
          sx={{
            fontWeight: "bold",
            marginLeft: "0.8rem",
            marginTop: "0.2rem",
          }}
        >
          {data?.filter((val) => {
            if (val.designation === "SPEAKERS") {
              return val;
            }
          }).length > 0
            ? allWords.misc.livert.panelists
            : null}
        </Typography>
        {data
          ?.filter((val) => {
            if (val.designation === "SPEAKERS") {
              return val;
            }
            return null;
          })
          ?.sort((a, b) => {
            return a?.username
              ?.toLowerCase()
              ?.localeCompare(b?.username?.toLowerCase());
          })?.map((item) => (
            <UserCard username={item?.username} user_type={item?.user_type} />
          ))}
        {/* audiences */}
        <Typography
          sx={{
            fontWeight: "bold",
            marginLeft: "0.8rem",
            marginTop: "0.2rem",
          }}
        >
          {data?.filter((val) => {
            if (val.designation === "AUDIENCE") {
              return val;
            }
          }).length > 0
            ? allWords.misc.livert.audiences
            : null}
        </Typography>
        {data
          ?.filter((val) => {
            if (val.designation === "AUDIENCE") {
              return val;
            }
            return null;
          })
          ?.sort((a, b) => {
            return a?.username
              ?.toLowerCase()
              ?.localeCompare(b?.username?.toLowerCase());
          })?.map((item) => (
            <UserCard username={item?.username} user_type={item?.user_type} />
          ))}
        {other_count > 0 && (
          <div
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginLeft: "12px",
              marginTop: "0.5rem",
              color: "#66B984",
            }}
          >
            {other_count} {allWords.misc.pages.other}
          </div>
        )}
      </div>
    </Backdrop>
  );
};

export default UserList;
