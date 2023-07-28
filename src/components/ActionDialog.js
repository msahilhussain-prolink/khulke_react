import React, { useState, useEffect } from "react";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1 } from "../constants/env";
import axios from "axios";
import styled from "styled-components";
import { auto_login_continue } from "../utils/utils";
import MPDiv from "./common/MPDiv";
import { allWords } from "../App"

const AcceptBtn = styled.button`
  background-color: #66b984;
  border-radius: 50px !important;
  border: aliceblue;
  padding: 0.4rem;
  text-transform: capitalize !important;
  color: white !important;
  font-size: 1rem;
  font-weight: 600;
  width: 6rem;
`;

const RejectBtn = styled.button`
  background-color: white;
  border-radius: 50px !important;
  border: 1px solid #ed4d29;
  padding: 0.4rem;
  text-transform: capitalize !important;
  color: #ed4d29 !important;
  font-size: 1rem;
  font-weight: 600;
  width: 6rem;
`;

const ACRDialog = ({ rt_details, handleClose }) => {
  const [token, setToken] = useState("");
  const [rt_id, setRTID] = useState("");
  const [role, setRole] = useState("");
  const [error_message, setErrorMessage] = useState(
    allWords.th.suggested.error
  );
  const [success, setSuccess] = useState(false);
  const [rt_data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const performCTA = (url) => {
    setLoading(true);
    const FormData = require("form-data");
    const data = new FormData();
    data.append(
      "data",
      JSON.stringify({ confirmation_token: token, rt_id: rt_id, role: role })
    );

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/round-table-${url}/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        if (response.status === 200) {
          setLoading(false);
          setError(false);
          setSuccess(true);
        } else {
          setSuccess(false);
          setLoading(false);
          setError(true);
        }
      })
      .catch(async function (err) {
        const response = err.response;

        if (!response) {
          setSuccess(false);
          setLoading(false);
          setError(true);
          return;
        }

        if (response.status === 401) {
          return await auto_login_continue(() => performCTA(url));
        }

        setSuccess(false);
        setLoading(false);
        setError(true);
      });
    handleClose(true);
  };

  const getMessage = () => {
    const data = JSON.stringify({
      roundtable_id: rt_details["_id"],
    });

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/message`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        if (response.status === 200) {
          setToken(
            response.data.data[0]["data"]["roundtable_invitation"][
            "confirmation_token"
            ]
          );
          setRole(
            response.data.data[0]["data"]["roundtable_invitation"]["role"]
          );
          setRTID(
            response.data.data[0]["data"]["roundtable_invitation"][
            "roundtable"
            ]["_id"]
          );
          setData(response.data.data[0]["data"]["message"]);
          setLoading(false);
        } else if (response.status === 255 || response.status === 253) {
          handleClose(true);
          setError(true);
          setErrorMessage("You've already responded to this request.");
          setLoading(false);
        } else {
          setErrorMessage(allWords.th.suggested.error);
          setLoading(false);
          setError(true);
        }
      })
      .catch(async function (err) {
        const response = err.response;

        if (!response) {
          setErrorMessage(allWords.th.suggested.error);
          setLoading(false);
          setError(true);
          return;
        }
        if (response.status === 401) {
          return await auto_login_continue(getMessage);
        }

        setErrorMessage(allWords.th.suggested.error);
        setLoading(false);
        setError(true);
      });
  };
  useEffect(() => {
    getMessage();
  }, []);
  return (
    <div className="container-fluid px-3">
      {loading && <MPDiv action={"loading"} />}
      {error && <MPDiv action={"error"} />}
      {success && <MPDiv action={"success"} />}
      {!loading && !error && !success && (
        <>
          <p>{rt_data}</p>
          <br />
          <div className="d-flex justify-content-between">
            <AcceptBtn
              onClick={() => {
                performCTA("confirm");
              }}
            >
              {allWords.misc.accept}
            </AcceptBtn>
            <RejectBtn
              onClick={() => {
                performCTA("reject");
              }}
            >
              {allWords.misc.reject}
            </RejectBtn>
          </div>
        </>
      )}
    </div>
  );
};

export default ACRDialog;
