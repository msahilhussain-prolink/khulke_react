import React, { useState } from "react";
import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import ToastHandler from "../../utils/ToastHandler";
import logoutUser from "../../apis/logoutUser";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import moment from "moment";
import { moengageEvent } from "../../utils/utils";
import { allWords } from "../../App";
import logger from "../../logger";

export default function Reactivate() {
  // vars
  const navigate = useNavigate();
  const datas = useLocation();

  //   state
  const [loading, setLoading] = useState(false);
  //   To reactivate
  async function reactivateFunc(e) {
    e.preventDefault();
    setLoading(true);
    let url = `${REACT_APP_BASE_URL_FOR_USER}/setting/account-reactivate/`;
    let data = JSON.stringify({
      user_id: JSON.parse(localStorage.getItem("current_user"))["_id"],
      platform: "web",
      device_name: "Dell",
      platform_version: "Windows",
    });

    var config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      data,
    };
    try {
      let result = await axios(config);
      if (result.status == 200) {
        if (
          result.data.message ==
          "Your account has been reactivated successfully."
        ) {
          moengageEvent("Reactivate Account", "User");
          await ToastHandler("sus", result.data.message);
          navigate("/home");
        } else if (result.data.message == "Your account already Activated") {
          await ToastHandler("dan", result.data.message);
        }
      } else {
        setLoading(false);
        await ToastHandler("dan", allWords.misc.somethingwrong);
      }
    } catch (error) {
      logger.error(error);
      setLoading(false);
      ToastHandler("dan", allWords.misc.somethingwrong);
    }
  }

  return (
    <div className="outerReactive">
      <h3 className="heading">Reactivate your account?</h3>
      <div className="content" style={{ color: "#63779C" }}>
        <p>
          You deactivated your account on{" "}
          {/* {moment(new Date(datas.state.date)).local().format("MM-DD-YYYY")} */}
          {`${
            datas?.state
              ? moment(new Date(datas.state.date)).local().format("LL")
              : "Recently"
          }.`}
        </p>
        {/* {datas.state.date} */}
        {/* moment(new Date(temp_data?.start)).local().format("YYYY-MM-DD") */}
        <p>
          On{" "}
          {datas?.state
            ? moment(new Date(datas.state.date))
                .local()
                .add(30, "days")
                .format("LL")
            : "30 days"}
          , it will no longer be possible for you to restore your Khul Ke
          account if it was accidentally or wrongfully deactivated.
        </p>
        <p>
          By clicking “Reactivate”, you will halt the deactivation process and
          reactivate your account.
        </p>
      </div>
      <div className="buttonDiv">
        <button
          onClick={(e) => reactivateFunc(e)}
          className="loginBtn btn primary-btn-blk"
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
            color: "white",
            background: "black",
            fontWeight: "bold",
            borderRadius: "50px",
            textTransform: "capitalize",
          }}
        >
          Reactivate
        </button>
        <button
          //   type="submit"
          onClick={() => logoutUser()}
          className="loginBtn btn primary-btn-blk"
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
            color: "black",
            background: "white",
            fontWeight: "bold",
            borderRadius: "50px",
            border: "1px solid black",
            textTransform: "capitalize",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
