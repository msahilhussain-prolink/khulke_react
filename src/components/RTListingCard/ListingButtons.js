import React, { useState } from "react";
import axios from "axios";

// Components
import DialogList from "../DialogList";
// Assets
import RoundTableIconActive from "../../assets/icons/RoundTable_icon_active.svg";
import { allWords } from "../../App";
// Constants
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../../constants/env";
import { auto_login_continue } from "../../utils/utils";

// Styles
import "./style.css";
import UserProfile from "../UserProfile";

export default function ListingButtons(props) {
  const { cardfooter, rt_details, req_visitor_count, rt_id } = props;

  // Local state
  const [viewList, setViewList] = useState([]);
  const [show, setShow] = useState(false);
  const [addbtn, setAddBtn] = useState([]);

  const ViewList = () => {
    const config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/get-access-rt-request/${rt_id}`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
    };

    axios(config)
      .then(async function (response) {
        setViewList(response.data.data);
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(viewList);
        }
      });
  };

  const acceptAccess = (user_id) => {
    const data = new FormData();
    let accept_data = {
      roundtable_id: rt_id,
      type: "SEEK-INVITATION",
      request_user: user_id,
    };

    data.append("data", JSON.stringify(accept_data));

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/accept-access-request/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        if (response.status === 200 || response.status === 253) {
          setAddBtn(user_id);
          ViewList();
        }
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(acceptAccess);
        }
      });
  };

  return (
    <>
      {cardfooter && (
        <>
          {rt_details?.owner_flag && (
            <>
              <div>
                {req_visitor_count > 0 && (
                  <div
                    className="d-flex justify-content-between mt-2"
                    style={{
                      width: "100%",
                      height: "40px",
                      backgroundColor: "#FFEBAC",
                      padding: "8px",
                      borderRadius: "10px",
                    }}
                    id="view_list_button_div"
                  >
                    <small>
                      &nbsp; {allWords.misc.joinreq} - <b>{req_visitor_count}</b>
                    </small>
                    <button
                      style={{
                        color: "#66B984",
                        backgroundColor: "white",
                        padding: "0px 5px",
                        borderRadius: "50px",
                        border: "1px solid #66B984",
                        fontSize: "12px",
                      }}
                      id="view_list_button"
                      onClick={() => {
                        ViewList();
                        setShow(true);
                      }}
                    >
                      {allWords.misc.vlist}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      <DialogList
        id="dialog_jr_button"
        title={allWords.misc.joinreq}
        open={show}
        setOpen={setShow}
        onCloseBtnClick={() => {
          setShow(false);
          window.location.reload(false);
        }}
      >
        <>
          {viewList?.map((item) => (
            <>
              {item.request_user_list.map((items) => (
                <>
                  <div
                    id="request_access_div"
                    key={item.username}
                    className="d-flex justify-content-between py-2"
                  >
                    <div className="d-flex">
                      <UserProfile
                        username={item.username}
                        className="avatar"
                      />
                      <span
                        style={{ userSelect: "none", visibility: "hidden" }}
                      >
                        ||
                      </span>
                      <div>
                        <strong style={{ display: "block" }}>
                          {items.name}
                        </strong>
                        <small className="text-muted">@{items.username}</small>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "2rem",
                        cursor: "pointer",
                      }}
                    >
                      {items.is_accepted === 1 ? (
                        <button disabled={true} className="set-reminder-white">
                          {allWords.addedalready}
                        </button>
                      ) : (
                        <>
                          {addbtn.includes(items.user_id) ? (
                            <button
                              disabled={true}
                              className="set-reminder-white"
                            >
                              {allWords.addedalready}
                            </button>
                          ) : (
                            <button
                              id="request_access_button"
                              className="request-acccess-green"
                              onClick={() => {
                                acceptAccess(items.user_id);
                              }}
                              style={{ padding: "7px 36px" }}
                            >
                              {allWords.addpanelist}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ))}
            </>
          ))}
        </>
      </DialogList>
    </>
  );
}
