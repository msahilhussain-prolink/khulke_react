import React, { useEffect } from "react";
import menu_icon_black from "../../assets/icons/post_menu.svg";
import UserProfile from "../../components/UserProfile";
import { POST_API_BASE_URL } from "../../constants/env";
import { allWords } from "../../App"

const Requests = ({ data, setAccepted, setShowRequest }) => {
  useEffect(() => {
    if (data.lenth > 0) {
      let temp = [];
      temp = data.filter((item) => {
        if (item.accept_status) {
          return item.username;
        }
      });
      setAccepted(temp);
    }
  }, []);
  const acceptSpeaker = (uid) => {
    let temp_data = [...data];
    let temp_index = temp_data.findIndex((person) => person.username === uid);
    if (temp_index !== -1) {
      temp_data[temp_index]["is_accepted"] = true;
    }
    setAccepted(temp_data);
    setShowRequest(false);
  };
  return (
    <>
      <small className="text-muted mb-5 pb-5">
        <strong>{allWords.misc.pages.belowhavehands}</strong>
      </small>
      <div className="my-5">
        {data.map((item) => {
          return (
            <div className="d-flex justify-content-between container-fluid ">
              <div className="d-flex justify-content-start">
                <UserProfile username={item.username} className="avatar" />
                &emsp;
                <div>
                  <strong
                    style={{ display: "block", textTransform: "capitalize" }}
                  >
                    {item.name}
                  </strong>
                  <small style={{ display: "block" }} className="text-muted">
                    @{item.username}
                  </small>
                </div>
              </div>

              <div>
                <div style={{ cursor: "pointer" }}>
                  <div className="dropdown">
                    <button className="dropbtn">
                      <img src={menu_icon_black} />
                    </button>
                    <div className="dropdown-content" style={{ width: "9rem" }}>
                      <li
                        onClick={(e) => {
                          acceptSpeaker(item.username);
                          e.currentTarget.classList = ["request-acccess-white"];
                          e.currentTarget.innerHTML = "Accepted";
                        }}
                      >
                        {allWords.misc.pages.addwild}
                      </li>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Requests;
