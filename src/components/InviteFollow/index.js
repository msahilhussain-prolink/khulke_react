import React from "react";
import { useDispatch, useSelector } from "react-redux";
// Assets
import check_green from "../../assets/icons/check_green.svg";
import CheckWhite from "../../assets/icons/check_white.svg";
import { createEditRoundtableInitialize } from "../../redux/actions/createEditRoundtable";
import "./style.css";

export default function InviteFollow({
  custom_count,
  custom_text,
  propStyle = {},
  invite_type,
}) {
  const dispatch = useDispatch();

  const custom_invite = useSelector(
    (state) => state.createEditRoundtable[invite_type]
  );

  return (
    <div className="row">
      <div
        onClick={() => {
          if (custom_count > 0) {
            dispatch(
              createEditRoundtableInitialize({ [invite_type]: !custom_invite })
            );
          }
        }}
        style={{
          cursor: custom_count > 0 ? "pointer" : "not-allowed",

          ...propStyle,
        }}
        className="follow_detail mt-3 col-11 d-flex justify-content-between align-items-center"
      >
        <div className="p-3">
          <span>
            {custom_text} - {custom_count}
          </span>
        </div>

        <img
          className="p-2"
          src={custom_invite === false ? CheckWhite : check_green}
          alt=""
        />
      </div>
    </div>
  );
}
