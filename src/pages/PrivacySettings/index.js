import { React, useEffect, useRef, useState } from "react";

import axios from "axios";
import { allWords } from "../../App";
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import Header from "../../components/Header";
import SettingsHeader from "../../components/SettingsHeader";
import Spinner from "../../components/Spinner";
import {
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
  REACT_APP_DEVICE_TYPE,
} from "../../constants/env";
import { metaData } from "../../constants/StaticPagesMetaTags";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import { CenterDiv, LeftDiv, MainDiv, RightDiv, ToggleTag } from "./style";

const PrivacySettings = () => {
  //Refs

  const account_ref = useRef("");
  const dob_ref = useRef("");
  const location_ref = useRef("");
  const interest_ref = useRef("");
  const language_ref = useRef("");
  const website_ref = useRef("");
  const success_text_ref = useRef("");

  const [loading, setLoading] = useState(false);
  const [Toggle, setToggle] = useState(false);
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  const [isToggled, setIsToggled] = useState(false);
  const [success_text, setSuccessText] = useState("");
  let slave_list = [
    "account",
    "dob",
    "location_radio",
    "interest_radio",
    "language",
    "website_radio",
  ];
  const [togg, setTogg] = useState([false, false, false, false, false, false]);
  const getPrivacySettings = () => {
    var data = JSON.stringify({
      username: current_user["username"],
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/profile/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          let settings = response.data["data"]["self_user"]["privacy_settings"];
          let temp = [false, false, false, false, false, false];
          settings.forEach((item) => {
            if (item === "account") {
              temp[0] = true;
              account_ref.current.checked = true;
            } else if (item === "dob") {
              temp[1] = true;
              dob_ref.current.checked = true;
            } else if (item === "location_radio") {
              temp[2] = true;
              location_ref.current.checked = true;
            } else if (item === "interest_radio") {
              temp[3] = true;
              interest_ref.current.checked = true;
            } else if (item === "language") {
              temp[4] = true;
              language_ref.current.checked = true;
            } else if (item === "website_radio") {
              temp[5] = true;
              website_ref.current.checked = true;
            }

            setTogg(temp);

            moengageEvent("View Page", "ALL", {
              URL: `${window.location.origin}/${window.location.pathname}`,
            });
          });
        }
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;

        if (res.status === 401) {
          return await auto_login_continue(getPrivacySettings);
        }
      });
  };

  const onToggle = (index = 0) => {
    let temp = [...togg];
    temp[index] = !temp[index];
    setTogg(temp);
  };
  const handleChange = () => {
    setToggle({ Toggle });
  };

  const privacySetting = () => {
    setLoading(true);
    setSuccessText("");
    let sdata = [];
    for (let i = 0; i <= togg.length; i++) {
      if (togg[i]) {
        sdata.push(slave_list[i]);
      }
    }
    var data = JSON.stringify({
      info: sdata,
    });

    var config = {
      method: "post",
      url: `${POST_API_BASE_URL}/settings/change-privacy-settings`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(
          localStorage.current_user || localStorage.anonymous_user
        )["_id"],
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          success_text_ref.current.classList = ["text-success"];
          setSuccessText("Changes saved successfully!");
        }
      })
      .catch(function (error) {
        success_text_ref.current.classList = ["warn-text"];
        setSuccessText("Something went wrong! Try again later!");
      });
    setLoading(false);
  };

  useEffect(() => {
    getPrivacySettings();
  }, []);

  return (
    <>
      <MetaTagsGenerator metaTags={metaData["privacy-settings"]} />
      <Header />
      <MainDiv>
        <LeftDiv>
          <AccountLeftSideBar />
        </LeftDiv>
        <CenterDiv>
          <SettingsHeader page_header="Privacy Settings" />
          <ToggleTag>{allWords.misc.pages.selectprivateinfo}</ToggleTag>
          <div className="d-flex justify-content-between">
            <p>Account</p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={togg[0]}
                ref={account_ref}
                onChange={() => {
                  onToggle(0);
                }}
              />
              <span className="switch" />
            </label>
          </div>
          <br />

          <div className="d-flex justify-content-between">
            <p>Date of Birth</p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={togg[1]}
                ref={dob_ref}
                onChange={() => {
                  onToggle(1);
                }}
              />
              <span className="switch" />
            </label>
          </div>
          <br />

          <div className="d-flex justify-content-between">
            <p>Location</p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={togg[2]}
                ref={location_ref}
                onChange={() => {
                  onToggle(2);
                }}
              />
              <span className="switch" />
            </label>
          </div>
          <br />

          <div className="d-flex justify-content-between">
            <p>Interest</p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={togg[3]}
                ref={interest_ref}
                onChange={() => {
                  onToggle(3);
                }}
              />
              <span className="switch" />
            </label>
          </div>
          <br />

          <div className="d-flex justify-content-between">
            <p>Language</p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={togg[4]}
                ref={language_ref}
                onChange={() => {
                  onToggle(4);
                }}
              />
              <span className="switch" />
            </label>
          </div>
          <br />

          <div className="d-flex justify-content-between">
            <p>{allWords.misc.pages.site}</p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={togg[5]}
                ref={website_ref}
                onChange={() => {
                  onToggle(5);
                }}
              />
              <span className="switch" />
            </label>
          </div>
          <br />
          <div className="my-4">
            <small ref={success_text_ref} className="text-success">
              {success_text}
            </small>
          </div>
          <button
            onClick={privacySetting}
            className="btn primary-btn-blk"
            style={{ width: "50%" }}
            disabled={loading}
          >
            {loading ? <Spinner /> : "UPDATE"}
          </button>
          {/* </div> */}
        </CenterDiv>
        <RightDiv></RightDiv>
      </MainDiv>
    </>
  );
};

export default PrivacySettings;
