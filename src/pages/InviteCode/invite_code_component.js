import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// import moment from "moment";
import {
  getInitialToken,
  getUserRegister,
} from "../../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import Timeline from "../../components/Timeline";
// import Khulkelogo from "../../assets/icons/KhulKe_logo.svg";
// import twitter_logo from "../../assets/icons/twitter_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import FormInput from "../../components/FormInput";
import Disclaimer from "../../components/Disclaimer";
import { REACT_APP_BASE_URL_FOR_USER, STATIC_TOKEN } from "../../constants/env";
import Spinner from "../../components/Spinner";
import { globalImages } from "../../assets/imagesPath/images";
import { allWords } from "../../App";
// import TagManager from "react-gtm-module";

const InviteCodeComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokens = useSelector((state) => state.token.tokens);
  if (!JSON.parse(sessionStorage.getItem("step3-user"))) {
    window.location.replace("step-1");
  }

  const [is_loading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  //Invite alert refs
  const invite_alert = useRef("");
  const [invite_alert_text, setInviteAlertText] = useState("");
  const [invite_code_emotion, setInviteCodeEmotion] = useState("");
  const [invite_status, setInviteStatus] = useState(false);
  const [onboard_twitter_data, setOnboardTwitterData] = useState(null);
  const [invite_code, setInviteCode] = useState("");
  const [invite_debounce] = useDebounce(invite_code, 1000);
  const [country_name, setCountryName] = useState("India");
  const [city_name, setCityName] = useState("Mumbai");

  const getCountryCode = async () => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        setCountryName(response.data.country_name);
        setCityName(response.data.city);
      })
      .catch();
  };
  useEffect(() => {
    getCountryCode();
  }, []);

  //Obtain Initial Tokens
  const obtainToken = async () => {
    let parsed_data = JSON.parse(sessionStorage.getItem("step3-user"));
    let user_id = parsed_data["username"];
    let password = parsed_data["password"];
    dispatch(getInitialToken({ user_id, password }));
  };

  let res = useSelector((state) => state.user.data);
  let registration_error = useSelector((state) => state.user.error);
  useEffect(() => {
    if (Object.keys(res).length > 0) {
      localStorage.setItem("current_user", JSON.stringify(res));
    } else {
      return;
    }
    if (res["message"]) {
    } else if (res["status"] === "unblocked") {
      localStorage.setItem("current_user", JSON.stringify(res));
      obtainToken();
      if (res && localStorage.getItem("access")) {
        if (res["added_by_name"] !== "") {
          sessionStorage.setItem("invited_by", res["added_by_name"]);
          sessionStorage.setItem("invited_by_id", res["added_by_username"]);
          navigate("/welcome");
        } else if (res["added_by_name"] === "") {
          navigate("/waiting");
        }
      }
      if (localStorage.getItem("access")) {
        if (res["added_by_name"] !== "") {
          sessionStorage.setItem("invited_by", res["added_by_name"]);
          sessionStorage.setItem("invited_by_id", res["added_by_username"]);
          navigate("/welcome");
        } else if (res["added_by_name"] === "") {
          navigate("/waiting");
        }
      }

      window.Moengage?.add_unique_user_id(res["username"]);
      window.Moengage?.add_first_name(res["name"]);
      window.Moengage?.add_user_name(res["username"]);
      window.Moengage?.add_email(res["email"]);
      window.Moengage?.add_mobile(res["phone_number"]);

      window.Moengage?.track_event("User Sign Up", {
        "First Name": res["name"],
        Email: res["email"],
        "Mobile Number": res["phone_number"],
        Country: country_name,
        City: city_name,
        Location: res["location"],
        Age: res["age"],
      });
    }
  }, [res, tokens]);

  const createUser = async (skip) => {
    setIsLoading(true);
    if (
      invite_alert_text === "Entered invitiation code is invalid." ||
      invite_alert_text === "Something went wrong! Please try again later!"
    ) {
      return;
    }
    let parsed_data = JSON.parse(sessionStorage.getItem("step3-user"));
    let data = {};
    let sess_email = sessionStorage.getItem("step-1-email");
    let sess_phone = sessionStorage.getItem("step-1-phone");

    if (sess_email !== "") {
      data = {
        email: sess_email,
        username: parsed_data["username"],
        name: parsed_data["full_name"],
        password: parsed_data["password"],
        age: sessionStorage.getItem("age"),
        email_verification: JSON.parse(
          sessionStorage.getItem("verification_obj")
        ),
      };
    } else if (sess_phone !== "") {
      data = {
        username: parsed_data["username"],
        name: parsed_data["full_name"],
        password: parsed_data["password"],
        age: sessionStorage.getItem("age"),
        phone_number: sess_phone,
        phone_verification: JSON.parse(
          sessionStorage.getItem("verification_obj")
        ),
      };
    }

    // check data
    if (!skip) {
      data["invitation_code"] = invite_debounce;
      if (onboard_twitter_data) {
        data["twitter_id"] = onboard_twitter_data["twitter_id"];
        data["access_tokens"] = onboard_twitter_data["token"]["access_tokens"];
      }
    }
    dispatch(getUserRegister(data));
  };

  useEffect(() => {
    if (tokens) {
      localStorage.setItem("access", tokens["access"]);
      localStorage.setItem("refresh", tokens["refresh"]);
    }
  }, [tokens]);

  //Registration checks
  const reg_fail = useSelector((state) => state.user.error);

  //Invite code refs

  const checkInvite = async () => {
    if (invite_debounce === "") {
      setInviteCodeEmotion("-alert");
      setInviteAlertText("Invitation code can't be blank.");
      invite_alert.current.classList = ["warn-text"];
      setIsValid(false);
      return;
    }
    let temp_email = sessionStorage.getItem("step-1-email");
    let temp_phone = sessionStorage.getItem("step-1-phone");
    let data = {
      invitation_code: invite_debounce,
    };

    if (
      localStorage.getItem("is_new") === "/step-4" &&
      sessionStorage.getItem("onboard_twitter_data")
    ) {
      try {
        setOnboardTwitterData(
          JSON.parse(sessionStorage.getItem("onboard_twitter_data"))["data"][0]
        );
        let temp = JSON.parse(sessionStorage.getItem("onboard_twitter_data"))[
          "data"
        ][0];
        data["twitter_id"] = temp["twitter_id"];
      } catch (err) {}
    } else {
      if (temp_email !== "") {
        data["email"] = temp_email;
      } else if (temp_phone !== "") {
        data["phone_number"] = temp_phone;
      }
    }

    // api integration
    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/check-invite-code`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    await axios(config)
      .then((response) => {
        if (response.status === 253 || response.status === 252) {
          setInviteCodeEmotion("-alert");
          setInviteAlertText("Entered invitiation code is invalid.");
          invite_alert.current.classList = ["warn-text"];
          setIsValid(false);
          setInviteStatus(false);
          return false;
        } else if (response.status === 200) {
          setInviteCodeEmotion("-success");
          setInviteAlertText("Invite code verified!");
          invite_alert.current.classList = ["text-success"];
          sessionStorage.setItem("referral-code", invite_code);
          setIsValid(true);
          setInviteStatus(true);
          return true;
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setInviteCodeEmotion("-alert");
        setInviteAlertText(allWords.th.suggested.error);
        invite_alert.current.classList = ["warn-text"];
        sessionStorage.setItem("referral-code", invite_code);
        setIsValid(false);
        setInviteStatus(false);
        return false;
      });
  };

  // const getTwitterCallback = () => {
  //   var config = {
  //     method: "get",
  //     url: `${REACT_APP_BASE_URL_FOR_USER}/access_contacts/`,
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       localStorage.setItem("is_new", "/step-4");
  //       window.location.replace(response.data.redirect_url);
  //     })
  //     .catch(function (error) {});
  // };
  const [first_time, setFirstTime] = useState(true);
  // const [first_time_twitter, setFirstTimeTwitter] = useState(true);

  // useEffect(() => {
  //   if (!first_time) {
  //     checkInvite();
  //   }
  // }, [invite_debounce]);

  useEffect(() => {
    if (registration_error) {
      setIsLoading(false);
    }
  }, [registration_error]);

  // gtm events
  // function gtmEventWithCode() {
  //   TagManager.dataLayer({
  //     dataLayer: {
  //       event: "sign-up event",
  //       category: "Sign-up",
  //       action: "Step4",
  //       label: "invitation_code",
  //     },
  //   });
  // }
  // function gtmEventWithoutCode() {
  //   TagManager.dataLayer({
  //     dataLayer: {
  //       event: "sign-up event",
  //       category: "Sign-up",
  //       action: "Step4",
  //       label: "skip",
  //     },
  //   });
  // }

  useEffect(() => {
    createUser(true);
  }, []);

  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      {registration_error && (
        <section className="text-center container">
          <small className="warn-text">
            Looks like something went wrong while creating your account!
          </small>
          <span
            className="text-muted"
            onClick={() => {
              window.location.replace("/step-1");
            }}
          >
            Try again!
          </span>
        </section>
      )}
      {is_loading ? (
        <section style={{ marginTop: "45%" }}>
          <div className="text-center container">
            <Spinner />
            <br />
            <h6 className="text-success">
              Please wait while your account is being created
            </h6>
          </div>
        </section>
      ) : (
        <>
          <div className="row mb-5 col-sm-12 col-md-9 col-lg-9">
            <div className="col-sm-6 col-md-6 col-lg-6 mb-3">
              <img
                src={globalImages.logo}
                style={{ height: "9rem" }}
                className="img-fluid"
                alt="KhulKe Logo"
              />
            </div>
            <Timeline
              status={{
                "step-1": "completed",
                "step-2": "completed",
                "step-3": "completed",
                "step-4": "current",
              }}
            />
          </div>
          <h1 className="primary-heading">Enter Invitation Code</h1>
          <p className="text-muted-dark">
            This is the beginning of a strong friendship
          </p>
          <div className="col-lg-9 col-md-9 col-sm-12">
            <FormInput emotion={invite_code_emotion}>
              <input
                onChange={(e) => {
                  setInviteCode(e.target.value);
                  setFirstTime(false);
                }}
                placeholder="Enter Code"
              />
            </FormInput>
            <small ref={invite_alert}>{invite_alert_text}</small>
            {/* {!first_time_twitter && (
              <>
                {sessionStorage.getItem("onboard_twitter_data") ? (
                  <div className="text-center mt-4 container">
                    <small className="text-success">
                      Twitter authentication was successful!
                    </small>
                  </div>
                ) : (
                  <div className="text-center mt-4 container">
                    <small className="warn-text">
                      Twitter authentication failed!
                    </small>
                  </div>
                )}
              </>
            )} */}

            {/* {localStorage.is_new !== "step-4" &&
              !sessionStorage.getItem("onboard_twitter_data") && (
                <div className="my-1 text-center">
                  <button
                    className="twitter_btn"
                    onClick={() => {
                      setFirstTimeTwitter(false);
                      getTwitterCallback();
                    }}
                  >
                    <img src={twitter_logo} alt="Twitter logo" />
                    &emsp;Connect using Twitter
                  </button>
                </div>
              )} */}

            <div className="mt-5">
              <Disclaimer origin_url={window.location.href} />
              <button
                onClick={() => createUser(false)}
                className={
                  isValid
                    ? `btn primary-btn-blk`
                    : `disabled-button btn primary-btn-blk`
                }
              >
                CONTINUE
              </button>
            </div>

            {invite_alert_text !== "Invite code verified!" && (
              <div className="text-center mb-5">
                <small className="alert-text">
                  Don't have a invite code?{" "}
                  <Link
                    to="#"
                    // onClick={() => {
                    //   setIsLoading(true);
                    //   createUser(true);
                    // }}
                  >
                    Skip
                  </Link>
                </small>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InviteCodeComponent;
