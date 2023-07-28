import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getInitialToken } from "../../../redux/actions/authAction";
import {
  ENCRYPTED_PASSWORD_KEY,
  LOGIN_URL,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../../constants/env";
import axios from "axios";
import FormInput from "../../../components/FormInput";
import Khulkelogo from "../../../assets/icons/KhulKe_logo.svg";
import check_green from "../../../assets/icons/check_green.svg";
import eye_visible from "../../../assets/icons/eye_visible.svg";
import eye_hidden from "../../../assets/icons/eye_hidden.svg";
import CircularProgress from "@mui/material/CircularProgress";
import TagManager from "react-gtm-module";
import { get_encrypted_password } from "../../../utils/utils";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //Username refs
  const username = useRef("");
  const [username_emotion, setUsernameEmotion] = useState("");
  const [loginData, setLoginData] = useState(null);

  //Pass1 refs
  const pass1 = useRef("");
  const pass1_icon = useRef("");
  const pass1_alert_text = useRef("");
  const [pass1_emotion, setPass1Emotion] = useState("");
  const [pass1_alert, setPass1Alert] = useState("");

  //Login
  const [loading, setLoading] = useState(false);
  const [authentication, setAuthentication] = useState(false);
  const [tokens, setTokens] = useState(null);

  // const tokens = useSelector((state) => state.token.tokens);

  // const authentication = useSelector((state) => state.token.error);

  const loginUser = async (valid_user_id) => {
    let user_id = valid_user_id;
    let password = pass1.current.value;
    dispatch(getInitialToken({ user_id, password }));
  };

  useEffect(() => {
    if (localStorage.getItem("access") && localStorage.getItem("refresh")) {
      try {
        if (localStorage.getItem("current_user")) {
          let temp = JSON.parse(localStorage.getItem("current_user"));
          if (temp["is_invited"] === 0) {
            navigate("/waiting");
          } else if (temp["is_invited"] === 1) {
            if (localStorage.getItem("redirect_origin")) {
              navigate(localStorage.redirect_origin);
            } else {
              navigate("/home");
            }
          } else {
            localStorage.clear();
          }
        }
      } catch (err) {
        localStorage.clear();
      }
    }
  }, []);

  useEffect(() => {
    if (tokens) {
      setLoading(false);
      if (!localStorage.getItem("access") || !localStorage.getItem("refresh")) {
        localStorage.setItem("access", loginData?.["access"]);
        localStorage.setItem("refresh", loginData?.["refresh"]);
        setPass1Alert("");
        if (localStorage.getItem("current_user")) {
          let current_user = JSON.parse(localStorage.getItem("current_user"));
          if (
            current_user["added_by_name"] === "" &&
            current_user["is_invited"] === 0
          ) {
            window.location.replace("/waiting");
          } else {
            if (current_user["interest"]?.length > 0) {
              if (localStorage.getItem("redirect_origin")) {
                window.location.replace(localStorage.redirect_origin);
                return;
              } else {
                gtmEventLogin(current_user);
                window.location.replace("/home");
                return;
              }
            }
            window.location.replace("/welcome");
            return;
          }
        }
      }
    }
  }, [tokens]);

  useEffect(() => {
    if (authentication) {
      setUsernameEmotion("-alert");
      setPass1Emotion("-alert");
      pass1_alert_text.current.classList = ["warn-text"];
      setPass1Alert("Username / Password entered is incorrect!");
    } else {
      setPass1Emotion("");
      setUsernameEmotion("");
      pass1_alert_text.current.classList = ["alert-text"];
      setPass1Alert("");
    }
  }, [authentication]);

  const toggleVisibility = (field, status) => {
    //!Toggles password visibility
    if (field === "pass1") {
      if (status === "password") {
        pass1.current.type = "text";
        pass1_icon.current.src = eye_hidden;
      } else {
        pass1.current.type = "password";
        pass1_icon.current.src = eye_visible;
      }
    }
  };
  const [country_code, setCountryCode] = useState("+91");
  const [country_name, setCountryName] = useState("India");
  const [city_name, setCityName] = useState("Mumbai");

  const getCountryCode = async () => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        setCountryCode(response.data.country_calling_code);
        setCountryName(response.data.country_name);
        setCityName(response.data.city);
      })
      .catch();
  };
  useEffect(() => {
    getCountryCode();
  }, []);

  const getUserDetails = async () => {
    setLoading(true);
    let temp_username = username.current.value;
    let temp_password = pass1.current.value;
    let is_phone = false;
    if (
      Number.isInteger(Number(temp_username)) &&
      !temp_username.includes("+")
    ) {
      is_phone = true;
    }
    const encrypted_password = await get_encrypted_password(temp_password);
    let data = JSON.stringify({
      username: is_phone ? country_code + temp_username : temp_username,
      password: encrypted_password,
      // password: temp_password,
    });
    var config = {
      method: "POST",
      url: LOGIN_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };
    await axios(config)
      .then(function (response) {
        if (response.status === 252) {
          setAuthentication(true);
          setUsernameEmotion("-alert");
          setPass1Emotion("-alert");
          pass1_alert_text.current.classList = ["warn-text"];
          setPass1Alert("Username / Password entered is incorrect!");
          setLoading(false);
        } else if (response.status === 200) {
          setLoginData(response.data);
          setTokens(response.data.access);
          setUsernameEmotion("");
          setPass1Emotion("");
          pass1_alert_text.current.classList = ["alert-text"];
          setPass1Alert("");
          localStorage.setItem("current_user", JSON.stringify(response.data));
          localStorage.setItem(ENCRYPTED_PASSWORD_KEY, encrypted_password);
          // loginUser(response.data["username"]);
          window.Moengage?.add_unique_user_id(response.data["username"]);
          window.Moengage?.add_first_name(response.data["name"]);
          window.Moengage?.add_user_name(response.data["username"]);
          window.Moengage?.add_email(response.data["email"]);
          window.Moengage?.add_mobile(response.data["phone_number"]);

          window.Moengage?.track_event("User Sign In", {
            "First Name": response.data["name"],
            Email: response.data["email"],
            "Mobile Number": response.data["phone_number"],
            Country: country_name,
            City: city_name,
            Location: response.data["location"],
            Age: response.data["age"],
          });

          window.location.replace("/home");
        }
      })
      .catch(function (error) {
        setLoading(false);
      });
  };
  // let current_user = JSON.parse(localStorage.current_user || localStorage.anonymous_user);

  // gtm events
  function gtmEventLogin(current_user) {
    TagManager.dataLayer({
      dataLayer: {
        event: "Login event",
        category: "Login",
        action: "click",
        label: "success",
        userID: current_user._id,
      },
    });
  }
  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      <div className="row mb-2 col-sm-12 col-md-9 col-lg-9">
        <div className="col-sm-6 col-md-6 col-lg-6">
          <img
            src={Khulkelogo}
            style={{ height: "9rem" }}
            className="img-fluid"
            alt="KhulKe Logo"
          />
        </div>
      </div>
      <h1 className="primary-heading">Login To Your Account</h1>
      <p className="text-muted-dark">Enter the world of conversations</p> <br />
      <form className="col-lg-9 col-md-9 col-sm-12">
        <FormInput emotion={username_emotion}>
          <input
            ref={username}
            autoFocus
            placeholder="Username / Email / Mobile"
          />
          <img style={{ visibility: "hidden" }} src={check_green} alt="" />
        </FormInput>{" "}
        <br />
        <FormInput emotion={pass1_emotion}>
          <input type="password" ref={pass1} placeholder="Enter Password" />
          <img
            ref={pass1_icon}
            onClick={() => {
              toggleVisibility("pass1", pass1.current.type);
            }}
            src={eye_visible}
            alt=""
          />
        </FormInput>
        <small ref={pass1_alert_text} className="alert-text">
          {pass1_alert}
        </small>
        <br />
        <div className="text-center my-2">
          <small>
            <Link to="/forgot_password">Forgot Password?</Link>
          </small>
        </div>
        <div>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              getUserDetails();
              // gtmEventLogin();
            }}
            disabled={loading}
            className="btn primary-btn-blk"
          >
            {loading ? (
              <CircularProgress
                style={{ color: "#66B984", width: 27, height: 27 }}
              />
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="text-center">
          <small className="alert-text">
            New User?{" "}
            <Link to="/step-1" style={{ fontWeight: "bold" }}>
              Create an account
            </Link>
          </small>
        </div>
        <div className="text-center mb-5 ">
          <small className="alert-text">
            For any support, you can reach us at{" "}
            <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
              {" "}
              <a href="mailto: support@khulke.com">support@khulke.com</a>
            </span>
          </small>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;
