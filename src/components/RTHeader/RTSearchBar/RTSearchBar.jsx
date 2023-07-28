import { Avatar, TextField } from "@mui/material";
import React from "react";
import Classses from "./RTSearchBar.module.css";
import SearchIcon from "../../../assets/icons/search.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RTSearchBar = ({ minimizeRT = () => {}, heightProp = "45px" }) => {
  const [searchedKey, setsearchedKey] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setsearchedKey(e.target.value);
  };

  return (
    <div className={Classses.RtSearchContainer}>
      <TextField
        fullWidth
        value={searchedKey}
        onChange={handleOnChange}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            minimizeRT();

            navigate(`/rt/search?term=${searchedKey}`);
          }
        }}
        id="fullWidth"
        InputProps={{
          placeholder: "Search",
          sx: {
            borderRadius: "30px",
            height: heightProp,
          },
          startAdornment: (
            <Avatar
              src={SearchIcon}
              style={{
                width: "26px",
                height: "26px",
                marginRight: "14px",
              }}
            />
          ),
        }}
      />
    </div>
  );
};

export default RTSearchBar;
