import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { globalImages } from "../../assets/imagesPath/images";
import FormInput from "../../components/FormInput";
import {
  REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../constants/env";
import { auto_login_continue } from "../../utils/utils";
import "./style.css";

const EarnInvite = () => {
  const [invite_count, setInviteCount] = useState(5);
  const [state_field_map, setStateFieldMap] = useState({
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  });

  const first_name = useRef("");
  const first_name_email = useRef("");
  const [first_name_emotion, setFNE] = useState("");
  const first_name_alert = useRef("");
  const [first_name_btn, setFirstNameBtn] = useState("Invite");
  const [first_name_alert_text, setFNT] = useState("");
  const [first_name_error, setFNA] = useState("");
  const [first_name_error_emotion, setFNAE] = useState("");
  const [first_alert, setFirstAlert] = useState(false);

  const second_name = useRef("");
  const second_name_email = useRef("");
  const second_name_alert = useRef("");
  const [second_name_emotion, setSNE] = useState("");
  const [second_name_btn, setSecondNameBtn] = useState("Invite");
  const [second_name_alert_text, setSNT] = useState("");
  const [second_name_error, setSNA] = useState("");
  const [second_name_error_emotion, setSNAE] = useState("");
  const [second_alert, setSecondAlert] = useState(false);

  const third_name = useRef("");
  const third_name_email = useRef("");
  const third_name_alert = useRef("");
  const [third_name_emotion, setTNE] = useState("");
  const [third_name_btn, setThirdNameBtn] = useState("Invite");
  const [third_name_alert_text, setTNT] = useState("");
  const [third_name_error, setTNA] = useState("");
  const [third_name_error_emotion, setTNAE] = useState("");
  const [third_alert, setThirdAlert] = useState(false);

  const fourth_name = useRef("");
  const fourth_name_email = useRef("");
  const fourth_name_alert = useRef("");
  const [fourth_name_emotion, setFoNE] = useState("");
  const [fourth_name_btn, setFourthNameBtn] = useState("Invite");
  const [fourth_name_alert_text, setFoNT] = useState("");
  const [fourth_name_error, setFoNA] = useState("");
  const [fourth_name_error_emotion, setFoNAE] = useState("");
  const [fourth_alert, setFourthAlert] = useState(false);

  const fifth_name = useRef("");
  const fifth_name_email = useRef("");
  const fifth_name_alert = useRef("");
  const [fifth_name_emotion, setFiNE] = useState("");
  const [fifth_name_btn, setFifthNameBtn] = useState("Invite");
  const [fifth_name_alert_text, setFiNT] = useState("");
  const [fifth_name_error, setFiNA] = useState("");
  const [fifth_name_error_emotion, setFiNAE] = useState("");
  const [fifth_alert, setFifthAlert] = useState(false);

  const validate_field = (check_item) => {
    if (check_item.length === 10 && check_item[0] !== "+") {
      check_item = "+91" + check_item;
    }
    let validPhone = REACT_APP_BASE_URL.includes("perf")
      ? /^([0|\+[0-9]{1,5})?([1-9][0-9]{9})$/
      : /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/;
    let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (validPhone.test(check_item)) {
      return "phone";
    } else if (validEmail.test(check_item)) {
      return "email";
    } else {
      return "invalid";
    }
  };

  const assert_validations = (check_item, on_field, code, type) => {
    if (on_field === "first") {
      if (type === "invalid") {
        if (check_item !== "") {
          setFNE("-alert");
          setFNT("Please enter a valid email/phone");
          setFirstAlert(true);
        }
      } else if (type === "success") {
        if (code !== 200) {
          setFirstNameBtn("Follow");
        } else {
          setFirstNameBtn("Invite");
        }
        setFNE("-success");
        setFNT("");
      } else {
        setFNE("-alert");
        if (type !== "failed") {
          if (type === "Invitations already send") {
            setFNT("You have already invited this user");
          } else if (type === "User already added") {
            setFNT("You follow this user already");
          }
        }
      }
    } else if (on_field === "second") {
      if (type === "invalid") {
        if (check_item !== "") {
          setSNE("-alert");
          setSNT("Please enter a valid email/phone");
          setSecondAlert(true);
        }
      } else if (type === "success") {
        if (code !== 200) {
          setSecondNameBtn("Follow");
        } else {
          setSecondNameBtn("Invite");
        }
        setSNE("-success");
        setSNT("");
      } else {
        setSNE("-alert");
        if (type !== "failed") {
          if (type === "Invitations already send") {
            setSNT("You have already invited this user");
          } else if (type === "User already added") {
            setSNT("You follow this user already");
          }
        }
      }
    } else if (on_field === "third") {
      if (type === "invalid") {
        if (check_item !== "") {
          setTNE("-alert");
          setTNT("Please enter a valid email/phone");
          setThirdAlert(true);
        }
      } else if (type === "success") {
        if (code !== 200) {
          setThirdNameBtn("Follow");
        } else {
          setThirdNameBtn("Invite");
        }
        setTNE("-success");
        setTNT("");
      } else {
        setTNE("-alert");
        if (type !== "failed") {
          if (type === "Invitations already send") {
            setTNT("You have already invited this user");
          } else if (type === "User already added") {
            setTNT("You follow this user already");
          }
        }
      }
    } else if (on_field === "fourth") {
      if (type === "invalid") {
        if (check_item !== "") {
          setFoNE("-alert");
          setFoNT("Please enter a valid email/phone");
          setFourthAlert(true);
        }
      } else if (type === "success") {
        if (code !== 200) {
          setFourthNameBtn("Follow");
        } else {
          setFourthNameBtn("Invite");
        }
        setFoNE("-success");
        setFoNT("");
      } else {
        setFoNE("-alert");
        if (type !== "failed") {
          if (type === "Invitations already send") {
            setFoNT("You have already invited this user");
          } else if (type === "User already added") {
            setFoNT("You follow this user already");
          }
        }
      }
    } else if (on_field === "fifth") {
      if (type === "invalid") {
        if (check_item !== "") {
          setFiNE("-alert");
          setFiNT("Please enter a valid email/phone");
          setFifthAlert(true);
        }
      } else if (type === "success") {
        if (code !== 200) {
          setFifthNameBtn("Follow");
        } else {
          setFifthNameBtn("Invite");
        }
        setFiNE("-success");
        setFiNT("");
      } else {
        setFiNE("-alert");
        if (type !== "failed") {
          if (type === "Invitations already send") {
            setFiNT("You have already invited this user");
          } else if (type === "User already added") {
            setFiNT("You follow this user already");
          }
        }
      }
    }
  };

  const check_existence = async (check_item, input_number) => {
    let check_field = validate_field(check_item);
    let data = {};
    if (check_field === "invalid") {
      assert_validations(check_item, input_number, 500, "invalid");
      return false;
    } else if (check_field === "phone") {
      if (check_item.length === 10 && check_item[0] !== "+") {
        check_item = "+91" + check_item;
      }
      data = JSON.stringify({
        phone_number: check_item,
      });
    } else if (check_field === "email") {
      data = JSON.stringify({ email: check_item });
    } else {
      assert_validations(check_item, input_number, 500, "invalid");
      return false;
    }
    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/check/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        let field_map = state_field_map;
        if (response.data["status"] !== 200) {
          //email/phone in use
          if (check_field === "email") {
            field_map[input_number] = check_field;
            setStateFieldMap(field_map);
            assert_validations(check_item, input_number, 252, "success");
            return true;
          } else if (check_field === "phone") {
            field_map[input_number] = check_field;
            setStateFieldMap(field_map);
            assert_validations(check_item, input_number, 252, "success");
            return true;
          }
        } else {
          field_map[input_number] = check_field;
          setStateFieldMap(field_map);
          assert_validations(check_item, input_number, 200, "success");
          return true;
        }
      })
      .catch(function (error) {
        assert_validations(check_item, input_number, 500, "failed");
        return false;
      });
  };

  const invite_user = async (
    eop,
    input_number,
    emotion,
    emotion_text,
    emotion_alert,
    set_btn_text
  ) => {
    let data;
    if (input_number === "first") {
      if (first_name.current.value.trim() === "") {
        setFNAE("-alert");
        setFNA("Please enter a name");
        setFirstAlert(true);
      } else {
        setFNAE("-success");
        setFNA("");
        setFirstAlert(false);

        if (state_field_map[input_number] === "email") {
          data = JSON.stringify({ email: eop });
        } else if (state_field_map[input_number] === "phone") {
          if (eop.length === 10 && eop[0] !== "+") {
            eop = "+91" + eop;
          }
          data = JSON.stringify({
            phone_number: eop,
          });
        }
      }
    } else if (input_number === "second") {
      if (second_name.current.value.trim() === "") {
        setSNAE("-alert");
        setSNA("Please enter a name");
        setSecondAlert(true);
      } else {
        setSNAE("-success");
        setSNA("");
        setSecondAlert(false);

        if (state_field_map[input_number] === "email") {
          data = JSON.stringify({ email: eop });
        } else if (state_field_map[input_number] === "phone") {
          if (eop.length === 10 && eop[0] !== "+") {
            eop = "+91" + eop;
          }
          data = JSON.stringify({
            phone_number: eop,
          });
        }
      }
    } else if (input_number === "third") {
      if (third_name.current.value.trim() === "") {
        setTNAE("-alert");
        setTNA("Please enter a name");
        setThirdAlert(true);
      } else {
        setTNAE("-success");
        setTNA("");
        setThirdAlert(false);

        if (state_field_map[input_number] === "email") {
          data = JSON.stringify({ email: eop });
        } else if (state_field_map[input_number] === "phone") {
          if (eop.length === 10 && eop[0] !== "+") {
            eop = "+91" + eop;
          }
          data = JSON.stringify({
            phone_number: eop,
          });
        }
      }
    } else if (input_number === "fourth") {
      if (fourth_name.current.value.trim() === "") {
        setFoNAE("-alert");
        setFoNA("Please enter a name");
        setFourthAlert(true);
      } else {
        setFoNAE("-success");
        setFoNA("");
        setFourthAlert(false);

        if (state_field_map[input_number] === "email") {
          data = JSON.stringify({ email: eop });
        } else if (state_field_map[input_number] === "phone") {
          if (eop.length === 10 && eop[0] !== "+") {
            eop = "+91" + eop;
          }
          data = JSON.stringify({
            phone_number: eop,
          });
        }
      }
    } else if (input_number === "fifth") {
      if (fifth_name.current.value.trim() === "") {
        setFiNAE("-alert");
        setFiNA("Please enter a name");
        setFifthAlert(true);
      } else {
        setFiNAE("-success");
        setFiNA("");
        setFifthAlert(false);

        if (state_field_map[input_number] === "email") {
          data = JSON.stringify({ email: eop });
        } else if (state_field_map[input_number] === "phone") {
          if (eop.length === 10 && eop[0] !== "+") {
            eop = "+91" + eop;
          }
          data = JSON.stringify({
            phone_number: eop,
          });
        }
      }
    }

    let config = {
      method: "POST",
      url: `${REACT_APP_BASE_URL_FOR_USER}/invitation/invite-new-user`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then((res) => {
        if (res.status === 200) {
          emotion("-success ban-interact");
          emotion_text("");
          emotion_alert(false);
          set_btn_text("Invited");
          setInviteCount(invite_count - 1);
        } else if (res.status === 252) {
          if (eop === "") {
            emotion("-alert");
            emotion_text("Email/Phone cannot be empty");
            emotion_alert(true);
          } else if (res.data["message"] === "Invitations already send") {
            emotion("-alert");
            emotion_text("Invitations already sent.");
            emotion_alert(true);
          } else {
            check_existence(eop, input_number);
          }
        } else {
          assert_validations(input_number, 500, res.data["message"]);
        }
      })
      .catch(async (err) => {
        const res = err.response;
        if (!res) return emotion("-alert");
        if (res.status === 401) {
          return await auto_login_continue(() =>
            invite_user(
              eop,
              input_number,
              emotion,
              emotion_text,
              emotion_alert,
              set_btn_text
            )
          );
        }
        emotion("-alert");
      });
  };

  const follow_user = async (
    eop,
    input_number,
    emotion,
    emotion_text,
    emotion_alert,
    set_btn_text
  ) => {
    let data;
    if (input_number === "first") {
      if (first_name.current.value.trim() === "") {
        setFNAE("-alert");
        setFNA("Please enter a name");
        setFirstAlert(true);
      } else {
        setFNAE("-success");
        setFNA("");
        setFirstAlert(false);

        data = JSON.stringify({
          handle: eop,
          type: "follow",
        });
      }
    } else if (input_number === "second") {
      if (second_name.current.value.trim() === "") {
        setSNAE("-alert");
        setSNA("Please enter a name");
        setSecondAlert(true);
      } else {
        setSNAE("-success");
        setSNA("");
        setSecondAlert(false);

        data = JSON.stringify({
          handle: eop,
          type: "follow",
        });
      }
    } else if (input_number === "third") {
      if (third_name.current.value.trim() === "") {
        setTNAE("-alert");
        setTNA("Please enter a name");
        setThirdAlert(true);
      } else {
        setTNAE("-alert");
        setTNA("Please enter a name");
        setThirdAlert(false);

        data = JSON.stringify({
          handle: eop,
          type: "follow",
        });
      }
    } else if (input_number === "fourth") {
      if (fourth_name.current.value.trim() === "") {
        setFoNAE("-alert");
        setFoNA("Please enter a name");
        setFourthAlert(true);
      } else {
        setFoNAE("-success");
        setFoNA("");
        setFourthAlert(false);

        data = JSON.stringify({
          handle: eop,
          type: "follow",
        });
      }
    } else if (input_number === "fifth") {
      if (fifth_name.current.value.trim() === "") {
        setFiNAE("-alert");
        setFiNA("Please enter a name");
        setFifthAlert(true);
      } else {
        setFiNAE("-success");
        setFiNA("");
        setFifthAlert(false);

        data = JSON.stringify({
          handle: eop,
          type: "follow",
        });
      }
    }

    let config = {
      method: "POST",
      url: `${REACT_APP_BASE_URL_FOR_USER}/follow-friends/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    await axios(config)
      .then((res) => {
        if (res.status === 200 || res.data["message"] === "Some Error") {
          emotion("-success ban-interact");
          set_btn_text("Following");
          setInviteCount(invite_count - 1);
        } else if (res.status === 252) {
          if (eop === "") {
            emotion("-alert");
            emotion_text("Email/Phone cannot be empty");
            emotion_alert(true);
          } else {
            check_existence(eop, input_number);
          }
        } else {
          assert_validations(input_number, 500, res.data["message"]);
        }
      })
      .catch(async (err) => {
        const res = err.response;
        if (!res) return emotion("-alert");
        if (res.status === 401) {
          return await auto_login_continue(() =>
            follow_user(
              eop,
              input_number,
              emotion,
              emotion_text,
              emotion_alert,
              set_btn_text
            )
          );
        }
        emotion("-alert");
      });
  };
  function mfb_click(
    eop,
    input_number,
    emotion,
    emotion_text,
    emotion_alert,
    action,
    set_btn_text
  ) {
    if (action === "Invite") {
      invite_user(
        eop,
        input_number,
        emotion,
        emotion_text,
        emotion_alert,
        set_btn_text
      );
    } else if (action === "Follow") {
      follow_user(
        eop,
        input_number,
        emotion,
        emotion_text,
        emotion_alert,
        set_btn_text
      );
    }
  }

  const [done_cu, setDoneCU] = useState(false);

  async function getUserDetails() {
    try {
      let step_3_details = JSON.parse(sessionStorage.getItem("step3-user"));
      var data = JSON.stringify({
        username: step_3_details["username"],
        password: step_3_details["password"],
      });

      var config = {
        method: "post",
        url: `${REACT_APP_BASE_URL_FOR_USER}/auth/`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          let temp_data = response.data;
          temp_data["is_invited"] = 1;
          localStorage.removeItem("current_user");
          localStorage.setItem("current_user", JSON.stringify(temp_data));
          setDoneCU(true);
        })
        .catch();
    } catch (err) {
      setDoneCU(true);
    }
  }

  function setEarnInvite() {
    if (invite_count !== 0) {
      getUserDetails();
      return;
    }
    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/direct_user_invited/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          getUserDetails();
        }
      })
      .catch(async (err) => {
        const res = err.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(() => setEarnInvite());
        }
      });
  }

  useEffect(() => {
    if (done_cu) {
      window.location.replace("/interests");
    }
  }, [done_cu]);
  return (
    <section id="earnInviteScreen">
      <div
        className="col-sm-12 col-md-9 col-lg-9 my-5"
        style={{ position: "relative", margin: "0 auto" }}
      >
        <div className="icon-badge">
          <Link to="/waiting">
            <img src={globalImages.logo} alt="KhulKe Logo" />
          </Link>
        </div>

        <div
          className="page-card col-sm-12 col-md-9 col-lg-9 text-center"
          style={{ margin: "0 auto" }}
        >
          <div className="text-center container my-4">
            <h3>Invite Friends</h3>
            <small className="alert-text">
              Good friends, great conversations
            </small>
            <br />
          </div>
          <div className="container-fluid">
            <div className="my-2">
              <div className="d-flex justify-content-between">
                <p className="invite-count">1</p>
                &nbsp;
                <FormInput
                  emotion={first_name_error_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    onBlur={(e) => {
                      check_existence(first_name_email.current.value, "first");
                    }}
                    placeholder="Full name"
                    style={{ fontWeight: "bold" }}
                    ref={first_name}
                    disabled={
                      first_name_btn === "Following" ||
                      first_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormInput
                  emotion={first_name_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    placeholder="Email/Phone"
                    style={{ fontWeight: "bold" }}
                    onBlur={(e) => {
                      if (e.target.value !== "") {
                        check_existence(e.target.value, "first");
                      }
                    }}
                    ref={first_name_email}
                    disabled={
                      first_name_btn === "Following" ||
                      first_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className={
                    first_name_btn === "Following" ||
                    first_name_btn === "Invited"
                      ? `following-button-small follow-button-disabled fixed-size`
                      : `follow-button-small fixed-size`
                  }
                  onClick={() => {
                    mfb_click(
                      first_name_email.current.value,
                      "first",
                      setFNE,
                      setFNT,
                      setFirstAlert,
                      first_name_btn,
                      setFirstNameBtn
                    );
                  }}
                >
                  {first_name_btn}
                </button>
              </div>
              {first_alert && (
                <div className="row">
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={first_name_alert}
                      style={{ paddingLeft: "3.5rem" }}
                      className="warn-text"
                    >
                      {first_name_error}
                    </small>
                  </div>
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={first_name_alert}
                      style={{ marginLeft: "-2.4rem" }}
                      className="warn-text"
                    >
                      {first_name_alert_text}
                    </small>
                  </div>
                </div>
              )}
            </div>

            <div className="my-2">
              <div className="d-flex">
                <p className="invite-count">2</p>
                &nbsp;
                <FormInput
                  emotion={second_name_error_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    onBlur={(e) => {
                      check_existence(
                        second_name_email.current.value,
                        "second"
                      );
                    }}
                    placeholder="Full name"
                    style={{ fontWeight: "bold" }}
                    ref={second_name}
                    disabled={
                      second_name_btn === "Following" ||
                      second_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormInput
                  emotion={second_name_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    placeholder="Email/Phone"
                    style={{ fontWeight: "bold" }}
                    onBlur={(e) => {
                      check_existence(e.target.value, "second");
                    }}
                    ref={second_name_email}
                    disabled={
                      second_name_btn === "Following" ||
                      second_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className={
                    second_name_btn === "Following" ||
                    second_name_btn === "Invited"
                      ? `following-button-small follow-button-disabled fixed-size`
                      : `follow-button-small fixed-size`
                  }
                  onClick={() => {
                    mfb_click(
                      second_name_email.current.value,
                      "second",
                      setSNE,
                      setSNT,
                      setSecondAlert,
                      second_name_btn,
                      setSecondNameBtn
                    );
                  }}
                >
                  {second_name_btn}
                </button>
              </div>
              {second_alert && (
                <div className="row">
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={second_name_alert}
                      style={{ paddingLeft: "3.5rem" }}
                      className="warn-text"
                    >
                      {second_name_error}
                    </small>
                  </div>
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={second_name_alert}
                      style={{ marginLeft: "-2.4rem" }}
                      className="warn-text"
                    >
                      {second_name_alert_text}
                    </small>
                  </div>
                </div>
              )}
              {/* <div className="d-flex justify-content-start">
                <small
                  ref={second_name_alert}
                  style={{ paddingLeft: "3.2rem" }}
                  className="warn-text"
                >
                  {second_name_alert_text}
                </small>
              </div> */}
            </div>

            <div className="my-2">
              <div className="d-flex">
                <p className="invite-count">3</p>
                &nbsp;
                <FormInput
                  emotion={third_name_error_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    onBlur={(e) => {
                      check_existence(third_name_email.current.value, "third");
                    }}
                    placeholder="Full name"
                    style={{ fontWeight: "bold" }}
                    ref={third_name}
                    disabled={
                      third_name_btn === "Following" ||
                      third_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormInput
                  emotion={third_name_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    placeholder="Email/Phone"
                    style={{ fontWeight: "bold" }}
                    onBlur={(e) => {
                      check_existence(e.target.value, "third");
                    }}
                    ref={third_name_email}
                    disabled={
                      third_name_btn === "Following" ||
                      third_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className={
                    third_name_btn === "Following" ||
                    third_name_btn === "Invited"
                      ? `following-button-small follow-button-disabled fixed-size`
                      : `follow-button-small fixed-size`
                  }
                  onClick={() => {
                    mfb_click(
                      third_name_email.current.value,
                      "third",
                      setTNE,
                      setTNT,
                      setThirdAlert,
                      third_name_btn,
                      setThirdNameBtn
                    );
                  }}
                >
                  {third_name_btn}
                </button>
              </div>
              {third_alert && (
                <div className="row">
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={third_name_alert}
                      style={{ paddingLeft: "3.5rem" }}
                      className="warn-text"
                    >
                      {third_name_error}
                    </small>
                  </div>
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={third_name_alert}
                      style={{ marginLeft: "-2.4rem" }}
                      className="warn-text"
                    >
                      {third_name_alert_text}
                    </small>
                  </div>
                </div>
              )}
              {/* <div className="d-flex justify-content-start">
                <small
                  ref={third_name_alert}
                  style={{ paddingLeft: "3.2rem" }}
                  className="warn-text"
                >
                  {third_name_alert_text}
                </small>
              </div> */}
            </div>

            <div className="my-2">
              <div className="d-flex">
                <p className="invite-count">4</p>
                &nbsp;
                <FormInput
                  emotion={fourth_name_error_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    onBlur={(e) => {
                      check_existence(
                        fourth_name_email.current.value,
                        "fourth"
                      );
                    }}
                    placeholder="Full name"
                    style={{ fontWeight: "bold" }}
                    ref={fourth_name}
                    disabled={
                      fourth_name_btn === "Following" ||
                      fourth_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormInput
                  emotion={fourth_name_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    placeholder="Email/Phone"
                    style={{ fontWeight: "bold" }}
                    onBlur={(e) => {
                      check_existence(e.target.value, "fourth");
                    }}
                    ref={fourth_name_email}
                    disabled={
                      fourth_name_btn === "Following" ||
                      fourth_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className={
                    fourth_name_btn === "Following" ||
                    fourth_name_btn === "Invited"
                      ? `following-button-small follow-button-disabled fixed-size`
                      : `follow-button-small fixed-size`
                  }
                  onClick={() => {
                    mfb_click(
                      fourth_name_email.current.value,
                      "fourth",
                      setFoNE,
                      setFoNT,
                      setFourthAlert,
                      fourth_name_btn,
                      setFourthNameBtn
                    );
                  }}
                >
                  {fourth_name_btn}
                </button>
              </div>
              {fourth_alert && (
                <div className="row">
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={fourth_name_alert}
                      style={{ paddingLeft: "3.5rem" }}
                      className="warn-text"
                    >
                      {fourth_name_error}
                    </small>
                  </div>
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={fourth_name_alert}
                      style={{ marginLeft: "-2.4rem" }}
                      className="warn-text"
                    >
                      {fourth_name_alert_text}
                    </small>
                  </div>
                </div>
              )}
              {/* <div className="d-flex justify-content-start">
                <small
                  ref={fourth_name_alert}
                  style={{ paddingLeft: "3.2rem" }}
                  className="warn-text"
                >
                  {fourth_name_alert_text}
                </small>
              </div> */}
            </div>

            <div className="my-2">
              <div className="d-flex">
                <p className="invite-count">5</p>
                &nbsp;
                <FormInput
                  emotion={fifth_name_error_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    onBlur={(e) => {
                      check_existence(fifth_name_email.current.value, "fifth");
                    }}
                    placeholder="Full name"
                    style={{ fontWeight: "bold" }}
                    ref={fifth_name}
                    disabled={
                      fifth_name_btn === "Following" ||
                      fifth_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormInput
                  emotion={fifth_name_emotion}
                  custom_styles={{ maxHeight: "2.7rem", fontWeight: "900" }}
                  custom_class={"w-100"}
                >
                  <input
                    placeholder="Email/Phone"
                    style={{ fontWeight: "bold" }}
                    onBlur={(e) => {
                      check_existence(e.target.value, "fifth");
                    }}
                    ref={fifth_name_email}
                    disabled={
                      fifth_name_btn === "Following" ||
                      fifth_name_btn === "Invited"
                        ? true
                        : false
                    }
                  />
                </FormInput>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className={
                    fifth_name_btn === "Following" ||
                    fifth_name_btn === "Invited"
                      ? `following-button-small follow-button-disabled fixed-size`
                      : `follow-button-small fixed-size`
                  }
                  onClick={() => {
                    mfb_click(
                      fifth_name_email.current.value,
                      "fifth",
                      setFiNE,
                      setFiNT,
                      setFifthAlert,
                      fifth_name_btn,
                      setFifthNameBtn
                    );
                  }}
                >
                  {fifth_name_btn}
                </button>
              </div>
              {fifth_alert && (
                <div className="row">
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={fifth_name_alert}
                      style={{ paddingLeft: "3.5rem" }}
                      className="warn-text"
                    >
                      {fifth_name_error}
                    </small>
                  </div>
                  <div
                    className="col-sm-12 col-md-6 col-lg-6"
                    style={{ textAlign: "justify" }}
                  >
                    <small
                      ref={fifth_name_alert}
                      style={{ marginLeft: "-2.4rem" }}
                      className="warn-text"
                    >
                      {fifth_name_alert_text}
                    </small>
                  </div>
                </div>
              )}
              {/* <div className="d-flex justify-content-start">
                <small
                  ref={fifth_name_alert}
                  style={{ paddingLeft: "3.2rem" }}
                  className="warn-text"
                >
                  {fifth_name_alert_text}
                </small>
              </div> */}
            </div>
          </div>

          <div
            className="col-sm-11 col-md-6 col-lg-6 text-center"
            style={{ margin: "0 auto" }}
          >
            <button
              onClick={setEarnInvite}
              className={
                invite_count === 0
                  ? `btn primary-btn-blk`
                  : `disabled-button btn primary-btn-blk`
              }
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarnInvite;
