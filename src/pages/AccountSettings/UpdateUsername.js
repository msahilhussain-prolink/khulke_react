import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../App";
// Constants
import { REACT_APP_BASE_URL_FOR_USER, STATIC_TOKEN } from "../../constants/env";

// Components
import FormInput from "../../components/FormInput";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import SuccessDialog from "../../components/SuccessDialog";

// Redux
import { restoreUsernameData } from "../../redux/actions/restoreUsernameAction";
import { editUserActionData } from "../../redux/actions/profileAction/editUsernameAction";

// Style
import "./style.css";

export default function UpdateUsername(props) {
  const {
    is_valid,
    setIsValid,
    current_user,
    edit_username,
    setUsername,
    email_alert_text,
    phone_alert_text,
    old_username,
    getProfileData,
  } = props;

  // Local Ref
  const username = useRef("");
  const username_alert_text = useRef("");

  // Local State
  const [user_first, setUserFirst] = useState(true);
  const [username_emotion, setUsernameEmotion] = useState("");
  const [username_alert, setUsernameAlert] = useState("");
  const [username_debounce] = useDebounce(edit_username, 1000);
  const [update_username, setUpdateUsername] = useState(false);
  const [restore_username, setRestoreUsername] = useState(false);
  const [store_old_username_flags, setStoreOldUsernameFlag] = useState(false);
  const [restore_flags, setRestoreFlag] = useState(false);
  const [store_old_user_name_flag, setStoreOldUserNameFlag] = useState(false);
  const [restore_username_flag, setRestoreUsernameFlag] = useState(false);
  const [success_flag, setSuccessFlag] = useState(false);
  const [success_msg, setSuccessMsg] = useState("");
  const [store_old_username, setStoreOldUsername] = useState("");
  const [restore_flag1, setRestoreFlags] = useState(false);
  const [und_flag, setUNDFlag] = useState(false);
  const [msgFlag, setMsgFlag] = useState(false);

  // Dispatch
  const dispatch = useDispatch();

  // Selector
  const restore_username_data = useSelector(
    (state) => state.restore_username.data
  );
  const edit_user_data = useSelector((state) => state.edit_user.data);

  //Hit API to check username availability
  const verifyUsername = async () => {
    var data = JSON.stringify({
      username: username.current.value.trim(),
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/user-search/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };
    await axios(config)
      .then(function (response) {
        if (response.data["status"] === 200) {
          setUsernameAlert("");
          setUsernameEmotion("-success");
          setUsernameAlert("Username is available");
          username_alert_text.current.classList = ["success-text"];
          setIsValid(true);
          if (
            username_alert_text === "" &&
            email_alert_text === "" &&
            phone_alert_text === ""
          ) {
            setIsValid(true);
          }
        } else {
          setUsernameAlert("This username already exists");
          setUsernameEmotion("-alert");
          username_alert_text.current.classList = ["warn-text"];
          setIsValid(false);
        }
      })
      .catch();
  };

  //Check for already existing user
  const checkUsername = () => {
    let regexp =
      /^[A-Za-z0-9\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u4e00-\u9eff\u3040–\u309F\u30A0–\u30FF]*[._-]?[a-zA-Za-z0-9\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u4e00-\u9eff\u3040–\u309F\u30A0–\u30FF]*[._-]?[a-zA-Za-z0-9\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u4e00-\u9eff\u3040–\u309F\u30A0–\u30FF]*$/gu;
    let username_value = edit_username.trim();
    if (username_value === current_user["username"]) {
      setUsernameAlert("Nothing's changed");
      setUsernameEmotion("-alert");
      username_alert_text.current.classList = ["warn-text"];
      setIsValid(false);
    } else if (username_value === "") {
      setUsernameAlert("Username should not be empty");
      setUsernameEmotion("-alert");
      username_alert_text.current.classList = ["warn-text"];
      setIsValid(false);
    } else if (username_value?.length < 3) {
      setUsernameAlert("Username should be more than or equal to 3 letters");
      setUsernameEmotion("-alert");
      username_alert_text.current.classList = ["warn-text"];
      setIsValid(false);
    } else if (username_value?.length > 15) {
      setUsernameAlert("Username should be less than or equal to 15 letters");
      setUsernameEmotion("-alert");
      username_alert_text.current.classList = ["warn-text"];
    } else if (!regexp.test(username_value) || username_value.includes("@")) {
      setUsernameAlert("Use only letters, numbers, . , - and _");
      setUsernameEmotion("-alert");
      username_alert_text.current.classList = ["warn-text"];
      setIsValid(false);
    } else {
      verifyUsername();
    }
  };

  useEffect(() => {
    if (user_first === false && und_flag === false) {
      checkUsername();
    }
  }, [username_debounce]);

  useEffect(() => {
    dispatch(restoreUsernameData());
  }, []);

  useEffect(() => {
    if (restore_username_data && restore_username_data.status === 200) {
      if (
        restore_username_data?.message === "No data" ||
        restore_username_data?.data?.length < 1
      ) {
        setRestoreFlags(false);
      } else {
        setRestoreFlags(true);
      }
      setStoreOldUsername(
        restore_username_data?.data?.[0]?.["old_usernames"]?.["name"]
      );
    }
  }, [restore_username_data]);

  function updateYes() {
    setUsername(edit_username);
    setUpdateUsername(false);
    setStoreOldUserNameFlag(true);
    setRestoreUsernameFlag(false);
    setMsgFlag(true);
    dispatch(
      editUserActionData({
        edit_usernames: edit_username.trim(),
        old_username: old_username,
        store_old_username_flag: true,
        restore_flag: false,
      })
    );
  }

  function updateNo() {
    setUsername(edit_username);
    setUpdateUsername(false);
    setStoreOldUserNameFlag(false);
    setRestoreUsernameFlag(false);
    setMsgFlag(true);
    dispatch(
      editUserActionData({
        edit_usernames: edit_username.trim(),
        old_username: old_username,
        store_old_username_flag: false,
        restore_flag: false,
      })
    );
  }

  function restoreYes() {
    setUsername(store_old_username);
    setRestoreUsername(false);
    setStoreOldUserNameFlag(false);
    setRestoreUsernameFlag(true);
    setMsgFlag(true);
    dispatch(
      editUserActionData({
        edit_usernames: store_old_username,
        old_username: old_username,
        store_old_username_flag: false,
        restore_flag: true,
      })
    );
  }

  function restoreNo() {
    setRestoreUsername(false);
  }

  useEffect(() => {
    if (msgFlag === true) {
      if (edit_user_data && edit_user_data.status === 200) {
        setSuccessFlag(true);
        setStoreOldUsernameFlag(store_old_user_name_flag);
        setRestoreFlag(restore_username_flag);
        getProfileData(edit_username.trim());
        setUserFirst(true);
        setUsernameEmotion("");
        setUsernameAlert("");
        username_alert_text.current.classList = [""];
        dispatch(restoreUsernameData());
        if (restore_username_flag === false) {
          if (store_old_user_name_flag === true) {
            setSuccessMsg("Your username has been updated.");
          } else {
            setSuccessMsg("Your username has been updated.");
          }
          setIsValid(false);
        } else if (restore_username_flag === true) {
          setSuccessMsg("Your previous username is restored.");
        }
      }
    }
  }, [edit_user_data]);

  return (
    <>
      <small className="text-muted">{allWords.misc.user}</small>
      <div
        className="d-flex upUserDiv"
        style={{ width: "100%", position: "relative" }}
      >
        <i className="username-italic">@</i>
        <FormInput custom_class="username-emotion" emotion={username_emotion}>
          <input
            ref={username}
            value={`${edit_username}`}
            onChange={(e) => {
              setUserFirst(und_flag === false ? false : true);
              setUsername(e.target.value);
            }}
            minLength={3}
            maxLength={15}
            placeholder={allWords.misc.user}
            style={{ width: "100%", paddingLeft: "11px" }}
          />
        </FormInput>

        <div>
          <span style={{ visibility: "hidden" }}>||</span>
          <button
            className={
              is_valid
                ? `update-button-small`
                : `disabled-button update-button-small`
            }
            onClick={() => {
              setUpdateUsername(true);
            }}
            style={{ borderRadius: "10px" }}
          >
            {allWords.misc.update}
          </button>
          <span style={{ visibility: "hidden" }}>||||</span>

          {restore_flag1 === true ? (
            <button
              onClick={() => {
                setRestoreUsername(true);
                setUNDFlag(true);
              }}
              className="restore_btn"
            >
              {allWords.misc.restore}
            </button>
          ) : null}
        </div>
      </div>

      <small ref={username_alert_text}>{username_alert}</small>

      <ConfirmationDialog
        open={update_username}
        setOpen={setUpdateUsername}
        msg="Do you want to secure your username for 30 days?"
        custom_yes={updateYes}
        custom_no={updateNo}
      />

      <ConfirmationDialog
        open={restore_username}
        setOpen={setRestoreUsername}
        msg="Are you sure that you want to restore Your previous username?"
        custom_yes={restoreYes}
        custom_no={restoreNo}
      />

      <SuccessDialog
        open={success_flag}
        setOpen={setSuccessFlag}
        text1={restore_flags === true ? edit_username : ""}
        text2={
          restore_flags === false && store_old_username_flags === true
            ? true
            : false
        }
        msg={success_msg}
      />
    </>
  );
}
