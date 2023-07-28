/* eslint-disable react/jsx-pascal-case */
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDebounce } from "use-debounce";
import {
  REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../constants/env";
// **Components
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import { country_codes } from "../../data";

import SettingsHeader from "../../components/SettingsHeader";
import { MainDiv, LeftDiv, CenterDiv, RightDiv, Deactive_btn } from "./style";
import FormInput from "../../components/FormInput";
import "./style.css";
import DeactivateDialog from "../../components/DeactivateDialog";
import Dialog from "../../components/LeftSideBar/Dialog";
import UpdatePhoneDialog from "./UpdatePhoneDialog";
import UpdateEmailDailog from "./UpdateEmailDialog";
import check_green from "../../assets/icons/check_green.svg";
// import cross_red from "../../assets/icons/cross_red.svg";
import {
  auto_login_continue,
  device_info,
  moengageEvent,
} from "../../utils/utils";
import UpdateUsername from "./UpdateUsername";
import ToastHandler from "../../utils/ToastHandler";
import Header from "../../components/Header";
// text Import
import { allWords } from "../../App";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { metaData } from "../../constants/StaticPagesMetaTags";

const customCodeStyles = {
  dropdownIndicator: (base) => ({
    ...base,
    color: "#63779c", // Custom colour
  }),
  valueContainer: (base) => ({
    ...base,
    justifyContent: "space-between",
    height: "50px",
  }),
  container: (base) => ({
    ...base,
    width: "70px",
    textAlign: "center",
  }),
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    margin: "0.6rem 0px 0.3rem 0px",
    height: "3rem",
    width: "4rem",
  }),
  indicatorContainer: (base) => ({
    ...base,
    padding: "0px",
    marginRight: "20px",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "1em",
    color: "#63779c",
    fontWeight: 400,
  }),
  menu: (base) => ({
    ...base,
    height: "150px",
    backgroundColor: "white",
    // overflow: "hidden",
  }),
  menuList: (base) => ({
    ...base,
    height: "150px",
    backgroundColor: "white",
    // overflow: "hidden",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#999999" : null,
      color: "#333333",
    };
  },
};

const AccountSettings = () => {
  // vars
  const navigate = useNavigate();
  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );
  // local state
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [edit_email, setEditEmail] = useState("");
  const [edit_phone, setEditPhone] = useState("");
  const [phone_debounce] = useDebounce(phone, 1000);
  const [email_debounce] = useDebounce(email, 1000);
  const [update_phone, setUpdatePhone] = useState("");
  const [edit_username, setUsername] = useState(current_user["username"]);
  const [old_username, setOldUsername] = useState("");

  //First Time Checks
  const [user_first, setUserFirst] = useState(true);
  const [email_first, setEmailFirst] = useState(true);
  const [phone_first, setPhoneFirst] = useState(true);

  const [otp_for, setOTPFor] = useState("");
  const [should_send, setShouldSend] = useState(false);

  // Dialog Variable
  const [deactivateAcc, setDeactivateAcc] = useState(false);
  const [update_phone_dialog, setUpdatePhoneDialog] = useState(false);
  const [update_email_dialog, setUpdateEmailDialog] = useState(false);

  // Email and Phone validation
  const emailId = useRef("");
  const email_alert_text = useRef("");
  const [email_emotion, setEmailEmotion] = useState("");
  const [email_alert, setEmailAlert] = useState("");

  const phoneId = useRef("");
  const phone_alert_text = useRef("");
  const [phone_emotion, setPhoneEmotion] = useState("");
  const [phone_alert, setPhoneAlert] = useState("");

  const [is_valid, setIsValid] = useState(false);
  const [is_valid_email, setIsValidEmail] = useState(false);
  const [is_valid_phone, setIsValidPhone] = useState(false);
  // const [new_username, setNewUsername] = useState("");

  //Send OTP
  const sendOTP = async () => {
    let url = `${REACT_APP_BASE_URL_FOR_USER}/`;
    let data = { r_type: "password" };
    if (!otp_for) {
      return;
    }
    if (otp_for === "phone" && phone !== "") {
      url += "send-otp-phone/";
      data["phone_number"] = phone.length === 10 ? "+91" + phone : phone;
    } else if (otp_for === "email" && email !== "") {
      url += "send-otp-email/";
      data["email"] = email;
    }
    var config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: JSON.stringify(data),
    };

    await axios(config).then().catch();
  };

  // Profile Data
  function getProfileData(new_username) {
    var data = JSON.stringify({
      username: new_username !== undefined ? new_username : edit_username,
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
        if (response.status !== 200) {
          // return alert(
          //   response?.data?.message || "Something went wrong please try later"
          // );
          return ToastHandler(
            "dan",
            response?.data?.message || allWords.misc.somethingwrong
          );
        }
        let master = response.data.data["user_other"];
        localStorage.setItem("current_user", JSON.stringify(master));

        setUsername(master?.["username"]);
        setOldUsername(master?.["username"]);
        setName(master.name);

        if (master?.["email"] !== null) {
          setEmail(master?.["email"]);
          setEditEmail(master?.["email"]);
        } else if (master?.["email"] === null) {
          setEditEmail(email);
        }
        if (master?.["phone_number"] !== null) {
          setPhone(master?.["phone_number"].slice(-10));
          setEditPhone(master?.["phone_number"]);
        } else {
          setEditPhone(update_phone);
        }
        if (master?.["phone_number"] === "" && master?.["phone"] !== null) {
          setPhone(master?.["phone"].slice(-10));
          setEditPhone(master?.["phone"]);
        }
        moengageEvent("View Page", "ALL", {
          URL: `${window.location.origin}/${window.location.pathname}`,
        });
      })
      .catch(async function (error) {
        const res = error.response;
        if (!res) {
          return;
        }

        if (res.status === 401) {
          return await auto_login_continue(getProfileData);
        }
        // setMetadataLoading(false);
      });
  }

  useEffect(() => {
    handleCodeChange({ label: "+91", value: "1" });
    getProfileData();
  }, []);

  const validate = (validate_type) => {
    let phoneId_value = phoneId.current.value.trim();
    let emailId_value = emailId.current.value.trim();
    if (phoneId_value.length === 0 || emailId_value.length === 0) {
      if (phoneId_value.length >= 1) {
        setEmailEmotion("");
        setEmailAlert("");
      } else if (emailId_value.length >= 1) {
        setPhoneEmotion("");
        setPhoneAlert("");
      }
    }
    if (validate_type === "phone") {
      let validPhone = REACT_APP_BASE_URL.includes("perf")
        ? /^([0|\+[0-9]{1,5})?([1-9][0-9]{9})$/
        : /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/;
      if ("+91" + phoneId_value === current_user["phone_number"]) {
        setPhoneAlert("Nothing's changed");
        setPhoneEmotion("-alert");
        phone_alert_text.current.classList = ["warn-text"];
        setIsValid(false);
        return false;
      } else if (!validPhone.test(phoneId_value)) {
        setPhoneAlert("Enter a valid Mobile Number.");
        setPhoneEmotion("-alert");
        phone_alert_text.current.classList = ["warn-text"];
        setIsValidPhone(false);
        return false;
      } else if (phoneId_value.length != 10) {
        setPhoneAlert("Mobile number is not valid.");
        setPhoneEmotion("-alert");
        phone_alert_text.current.classList = ["warn-text"];
        setIsValidPhone(false);
        return false;
      } else if (phoneId_value.length === 0) {
        if (emailId_value.length === 0) {
          setPhoneAlert("Mobile Number should not be empty.");
          setPhoneEmotion("-alert");
          phone_alert_text.current.classList = ["warn-text"];
          setIsValidPhone(false);
          return false;
        }
      } else {
        setPhoneAlert("");
        setPhoneEmotion("-success");
        if (current_user["phone_number"] !== phone) {
          setIsValidPhone(true);
          return true;
        }
        return false;
      }
    } else {
      let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (emailId_value === "") {
        if (phoneId_value.length === 0) {
          setEmailAlert("Email & Phone can not be empty");
          setEmailEmotion("-alert");
          email_alert_text.current.classList = ["warn-text"];
          setIsValidEmail(false);
          return false;
        }
      }
      if (emailId_value === current_user["email"]) {
        setEmailAlert("Nothing's changed!");
        setEmailEmotion("-alert");
        email_alert_text.current.classList = ["warn-text"];
        setIsValidEmail(false);
        return false;
      }
      if (!validEmail.test(emailId_value)) {
        setEmailAlert("Enter a valid Email Id.");
        setEmailEmotion("-alert");
        email_alert_text.current.classList = ["warn-text"];
        setIsValidEmail(false);
        return false;
      } else {
        setEmailAlert("");
        setEmailEmotion("-success");
        if (current_user["email"] !== email) {
          setIsValidEmail(true);
          return true;
        }
        return false;
      }
    }
  };

  // Country Code
  const [country_code, setCountryCode] = useState([]);

  function handleCodeChange(country_code_set) {
    setCountryCode({ country_code_set });
  }

  const c_value = country_code && country_code.value;

  useEffect(() => {
    if (otp_for !== "") {
      sendOTP();
      setOTPFor("");
    }
  }, [otp_for]);

  const check_existence = async (for_field) => {
    if (phone_debounce === "" && email_debounce === "") {
      setEmailEmotion("");
      setPhoneEmotion("");
      setEmailAlert("You must enter a valid phone number or email!");
      email_alert_text.current.classList = ["warn-text"];
      return;
    }
    let data = {};
    if (for_field === "phone") {
      data = JSON.stringify({
        device_info: device_info,
        phone_number: country_code["country_code_set"].label + phone_debounce,
      });
      setUpdatePhone(country_code["country_code_set"].label + phone_debounce);
    } else if (for_field === "email") {
      data = JSON.stringify({
        device_info: device_info,
        email: email_debounce,
      });
    } else {
      return;
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
        if (response.data["status"] !== 200) {
          //email/phone in use
          if (for_field === "email") {
            setEmailEmotion("-alert");
            setEmailAlert("This email is already in use.");
            email_alert_text.current.classList = ["warn-text"];
            setPhoneEmotion("");
            setPhoneAlert("");
            phone_alert_text.current.classList = ["alert-text"];
            setIsValid(false);
          } else if (for_field === "phone") {
            setEmailEmotion("");
            setEmailAlert("");
            email_alert_text.current.classList = ["alert-text"];
            setPhoneEmotion("-alert");
            setPhoneAlert("This phone number is already in use.");
            phone_alert_text.current.classList = ["warn-text"];
            setIsValid(false);
          }
        } else if (response.data["status"] === 200) {
          sendOTP();
          if (for_field === "phone") {
            validate("phone");
          } else if (for_field === "email") {
            validate("email");
          }
          return false;
        }
      })
      .catch(function (error) {
        return false;
      });
  };

  useEffect(() => {
    if (phone_debounce && !phone_first) {
      check_existence("phone");
    }
  }, [phone_debounce]);

  useEffect(() => {
    if (email_debounce && !email_first) {
      check_existence("email");
    }
  }, [email_debounce]);

  return (
    <>
      <MetaTagsGenerator metaTags={metaData.settings} />
      <Header />
      <MainDiv>
        <LeftDiv>
          <AccountLeftSideBar />
        </LeftDiv>
        <CenterDiv>
          <div className="as-uni-outer">
            <SettingsHeader page_header={allWords.leftAccounts.acc} />

            <UpdateUsername
              is_valid={is_valid}
              setIsValid={setIsValid}
              current_user={current_user}
              edit_username={edit_username}
              email_alert_text={email_alert_text}
              phone_alert_text={phone_alert_text}
              setUsername={setUsername}
              old_username={old_username}
              getProfileData={getProfileData}
            />

            {/* Update Email */}
            <div className="custom_email">
              <small className="text-muted">
                {allWords.setting.EmailLegend}
              </small>
              <div className="account-settings-div-mob">
                <FormInput
                  custom_class="account-settings-email-emotion"
                  emotion={email_emotion}
                >
                  <input
                    ref={emailId}
                    value={email}
                    onChange={(e) => {
                      setEmailFirst(false);
                      setEmail(e.target.value);
                    }}
                    type="email"
                    placeholder="Enter Email Address"
                    required
                  />
                  <img style={{ display: "none" }} alt="" />
                </FormInput>
                <span style={{ visibility: "hidden" }}>||</span>
                <button
                  className={
                    is_valid_email && email_alert === ""
                      ? `update-button-small`
                      : `disabled-button update-button-small`
                  }
                  style={{ borderRadius: "10px" }}
                  onClick={() => {
                    setOTPFor("email");
                    setUpdateEmailDialog(true);
                  }}
                >
                  {allWords.misc.update}
                </button>
              </div>
              <small className="warn-text" ref={email_alert_text}>
                {email_alert}
              </small>
            </div>

            {/* Update Phone */}
            <div>
              <small className="text-muted">
                {allWords.setting.mobileLegend}
              </small>
              <div className="account-settings-div-mob">
                <div className="d-flex justify-content-stretch">
                  <Select
                    className="custom_sel"
                    value={c_value}
                    onChange={handleCodeChange}
                    options={country_codes}
                    closeMenuOnSelect={true}
                    components={{
                      IndicatorSeparator: () => null,
                      IndicatorsContainer: () => null,
                    }}
                    styles={customCodeStyles}
                    placeholder="+91"
                    defaultValue={{ label: "+91", value: "1" }}
                  />
                  <span style={{ display: "none" }}>||</span>
                  <div className="w-100">
                    <FormInput
                      custom_class="account-settings-phone-emotion"
                      emotion={phone_emotion}
                      custom_styles={{ marginTop: "10px" }}
                    >
                      <input
                        ref={phoneId}
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhoneFirst(false);
                          setPhone(e.target.value);
                          if (e.target.value.length < 10)
                            setIsValidPhone(false);
                        }}
                        placeholder={allWords.misc.mob}
                        required
                        style={{ width: "17.3rem" }}
                      />
                      <img
                        style={{ display: "none" }}
                        src={check_green}
                        alt=""
                      />
                    </FormInput>
                  </div>
                  <br />
                </div>
                <span style={{ display: "none" }}>||</span>

                <button
                  className={
                    is_valid_phone && phone_alert === ""
                      ? `update-button-small`
                      : `disabled-button update-button-small`
                  }
                  style={{ borderRadius: "10px" }}
                  onClick={() => {
                    setOTPFor("phone");
                    setUpdatePhoneDialog(true);
                  }}
                >
                  {allWords.misc.update}
                </button>
              </div>
              <small className="warn-text" ref={phone_alert_text}>
                {phone_alert}
              </small>
            </div>
            {success && is_valid && (
              <div className="mt-2">
                <small className="text-success">
                  {allWords.misc.changessaved}
                </small>
              </div>
            )}

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            {/* <br />
            <br />
            <br />
            <br /> */}
            <div>
              <h5>{allWords.setting.deactivateHeading}</h5>
              <small style={{ color: "#63779C", lineHeight: "0" }}>
                {allWords.setting.deactivateInfo}
              </small>
              <br />

              <Deactive_btn
                onClick={() =>
                  navigate(
                    {
                      pathname: "/deactivate_info",
                    },
                    {
                      state: {
                        username: edit_username,
                        name: name,
                      },
                    }
                  )
                }
              >
                {allWords.setting.deactiveBtn}
              </Deactive_btn>
            </div>
          </div>

          <UpdatePhoneDialog
            should_send={should_send}
            setShouldSend={setShouldSend}
            otp_for="phone"
            otp_to={phone}
            getProfileData={getProfileData}
            title={"Verification Phone Code"}
            subtitle={"Please enter verification code below"}
            open={update_phone_dialog}
            setOpen={setUpdatePhoneDialog}
            onCloseBtnClick={() => {
              setUpdatePhoneDialog(false);
            }}
            setSuccess={setSuccess}
            setIsValid={setIsValid}
            is_valid={is_valid}
          />
          <UpdateEmailDailog
            otp_for="email"
            otp_to={email}
            getProfileData={getProfileData}
            title={"Verification Email Code"}
            subtitle={"Please enter verification code below"}
            open={update_email_dialog}
            setOpen={setUpdateEmailDialog}
            onCloseBtnClick={() => {
              setUpdateEmailDialog(false);
            }}
            setSuccess={setSuccess}
            setIsValid={setIsValid}
            is_valid={is_valid}
          />
          <Dialog
            title={"Enter Password to Deactivate Account"}
            open={deactivateAcc}
            setOpen={setDeactivateAcc}
            onCloseBtnClick={() => {
              setDeactivateAcc(false);
            }}
          >
             <DeactivateDialog setDeactivateAcc={setDeactivateAcc} />
          </Dialog>
        </CenterDiv>
        <RightDiv />
      </MainDiv>
    </>
  );
};

export default AccountSettings;
