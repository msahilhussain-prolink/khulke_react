import React, { useEffect, useState } from "react";
// API
import { profilePhoto } from "../../apis/profileApi";
// Assets
import UserDefault from "../../assets/images/default_user.png";
import CircularProgress from "@mui/material/CircularProgress";
import "./index.css";

export default function UserProfile({
  username,
  onClick,
  className,
  hidden,
  width = 45,
  height = 45,
  borderRadius = "0.5rem",
  alt = "",
  id = "pp_img",
  boxShadow = "0px",
  size = "medium",
}) {
  const [dp, setDp] = useState(UserDefault);

  useEffect(() => {
    if (username !== "") {
      return profilePhoto({
        username: username,
        size,
      })
        .then((res) => {
          if (res.status !== 253) {
            setDp(URL.createObjectURL(res.data));
          } else {
            setDp(UserDefault);
          }
        })
        .catch(() => {
          setDp(UserDefault);
        });
    }
  }, [username]);

  return (
    <>
      <img
        id={id}
        alt={alt}
        className={className}
        src={dp}
        style={{
          width: width,
          height: height,
          borderRadius: borderRadius,
          cursor: "pointer",
          boxShadow: boxShadow,
          marginRight: "1em",
        }}
        onClick={onClick}
        hidden={hidden}
      />
    </>
  );
}
