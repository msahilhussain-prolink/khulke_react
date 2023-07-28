import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Back from "../../assets/icons/back.svg";
import Permission from "../Permission";
import { allWords } from "../../App";

const SettingsHeader = ({ page_header, alternate_title }) => {
  useEffect(Permission, []);
  const navigate = useNavigate();
  return (
    <>
      <div style={{ display: "flex" }}>
        <img
          style={{ cursor: "pointer" }}
          src={Back}
          alt="back button"
          onClick={() => {
            //temporary for beta deployment, will revert back to  history.goBack();
            // history.push("/home");
            navigate(-1);
          }}
        />
        <h3
          style={{
            marginTop: "0.8rem",
            marginLeft: "0.8rem",
            fontSize: "1.5rem",
          }}
        >
          {alternate_title ? alternate_title : allWords.setting.settingHeader}
        </h3>
      </div>
      <br />
      <h5 style={{ fontSize: "1.5rem" }}>{page_header}</h5>
    </>
  );
};

export default SettingsHeader;
