import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { components } from "react-select";
import { useDebounce } from "use-debounce";
import { allWords } from "../../App";

// Redux
import { getVisitorSearch } from "../../redux/actions/visitorSearchAction";

// Assests
import search_icon from "../../assets/icons/search.svg";

// Constants
import {
  REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../constants/env";

// Components
import FormInput from "../FormInput";
import Spinner from "../Spinner";
import SelectedOptions from "./SelectedOptions";

// Material UI
import { IconButton } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Styles
import { CancelOutlined } from "@material-ui/icons";
import UserProfile from "../UserProfile";
import "./style.css";

const SearchCustomStyle = {
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px",
    display: "flex",
    padding: "0.1rem",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#999999" : null,
      color: "#333333",
    };
  },
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={search_icon} alt="" />
    </components.DropdownIndicator>
  );
};

const LoadingIndicator = () => {
  return <Spinner />;
};

const FormatOptionLabel = (props) => {
  return (
    <components.Option {...props}>
      <div
        className="d-flex my-1 pb-2"
        style={{ borderBottom: "1px solid lightgray" }}
      >
        <div>
          <UserProfile username={props?.data?.label} className="avatar" />
        </div>
        <div className="px-3" style={{ width: "80%" }}>
          <h6>{props?.data?.value}</h6>
          <p style={{ color: "#475376", fontSize: "0.8rem" }}>
            @{props?.data?.label}
          </p>
        </div>
      </div>
    </components.Option>
  );
};

const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span>No Options</span>
    </components.NoOptionsMessage>
  );
};

const SearchInviteDialog = (props) => {
  // Props
  const {
    speakers,
    moderator,
    setSearchInvite,
    scroll,
    setVisitorId,
    inviteFollower,
    setEmail,
    setPhone,
  } = props;
  // Global State
  const visitorSearchData = useSelector((state) => state.visitorSearch.data);
  const visitorSearchError = useSelector((state) => state.visitorSearch.err);
  const visiotrSearchLoading = useSelector(
    (state) => state.visitorSearch.loading
  );

  // Local State
  const [userTags, setUserTags] = useState();
  const [selected, setSelected] = useState([]);
  const [audience, setAudience] = useState("");
  const [audience_debounce] = useDebounce(audience, 1000);
  const [error_message, setErrorMessage] = useState("");
  const [temp_select_value, setTempSelectValue] = useState([]);
  const [phone_emotion, setPhoneEmotion] = useState("");
  const [phone_alert, setPhoneAlert] = useState("");
  const [addMobile, setAddMobile] = useState([]);
  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  let validPhone = REACT_APP_BASE_URL.includes("perf")
    ? /^([0|\+[0-9]{1,5})?([1-9][0-9]{9})$/
    : /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/;
  let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  // useRef
  const addInput = useRef();
  const phone_alert_text = useRef("");
  const descriptionElementRef = useRef(null);

  const dispatch = useDispatch();

  // useEffect
  useEffect(() => {
    if (visitorSearchData) {
      let temp_usertags = [
        // { label: current_user["username"], value: current_user["name"] },
      ];
      visitorSearchData.data.map((item) => {
        let temp_dict = {};
        if (item.username !== current_user["username"]) {
          temp_dict["_id"] = item._id;
          temp_dict["value"] = item.name;
          temp_dict["label"] = item.username;
          temp_usertags.push(temp_dict);
        }
      });
      setUserTags(temp_usertags);
    }
    if (visitorSearchError) {
      return;
    }
    if (visiotrSearchLoading) {
      return;
    }
  }, [visitorSearchData, visiotrSearchLoading, visitorSearchError]);

  // Visitor ID
  useEffect(() => {
    let tempid = [];
    selected.map((item) => tempid.push(item?._id));
    setVisitorId(tempid);
  }, [selected]);

  const getUserTags = (values) => {
    let data = {
      search_term: values,
    };
    dispatch(getVisitorSearch(data));
  };

  useEffect(() => {
    if (audience_debounce) {
      getUserTags(audience_debounce);
    }
  }, [audience_debounce]);

  useEffect(() => {
    let temp_phone = [];
    let temp_email = [];
    addMobile.map((item) =>
      item.match(validPhone)
        ? (temp_phone.push(item), setPhone(temp_phone))
        : (temp_email.push(item), setEmail(temp_email))
    );
  }, [addMobile]);

  const handleAudInputChange = (newValue) => {
    setAudience(newValue);
  };

  const handleSelectChange = (values) => {
    let temp = [];

    values.map((item) => {
      setErrorMessage("");
      temp.push({
        _id: item._id,
        label: item.label,
        value: item.value,
      });
    });

    temp.forEach((i, index) => {
      speakers?.forEach((speaker) => {
        if (
          i.label === speaker.speaker_name ||
          i.label === speaker.username ||
          i.label === moderator?.username
        ) {
          setErrorMessage(allWords.misc.invite.notModPanInvite);
          temp.splice(index);
        }
      });
    });
    setTempSelectValue(temp);
  };

  function uniqueValue(temp_select_value1, key) {
    return [
      ...new Map(temp_select_value1.map((item) => [key(item), item])).values(),
    ];
  }

  useEffect(() => {
    setSelected(uniqueValue(temp_select_value, (it) => it._id));
  }, [temp_select_value]);

  const removeMobile = (i) => {
    const newMob = [...addMobile];
    newMob.splice(i, 1);
    setAddMobile(newMob);
  };

  const validate = (validate_for) => {
    if (validate_for === "email") {
      if (!validEmail.test(addInput.current.value)) {
        return false;
      }
      return "email";
    } else if (validate_for === "phone") {
      if (!validPhone.test(addInput.current.value)) {
        return false;
      }
      return "phone";
    }
  };

  const check_existence = async (value) => {
    let data = {};

    if (value.match(validPhone)) {
      if (value.length === 10) {
        data = JSON.stringify({
          phone_number: "+91" + value,
        });
      } else if (value.length > 10) {
        data = JSON.stringify({
          phone_number: value,
        });
      }
    } else if (value.match(validEmail)) {
      data = JSON.stringify({ email: value });
    } else {
      return;
    }

    const config = {
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
          if (value.match(validEmail)) {
            setPhoneEmotion("-alert");
            setPhoneAlert("This email is already in use.");
          } else if (value.match(validPhone)) {
            setPhoneEmotion("-alert");
            setPhoneAlert("This phone number is already in use.");
          } else {
            setPhoneEmotion("");
            setPhoneAlert("");
          }
        } else {
          if (
            addMobile.find((mob) => mob.toLowerCase() === value.toLowerCase())
          ) {
            return;
          }
          setAddMobile([...addMobile, value]);

          addInput.current.value = null;
          setPhoneAlert("");
          setPhoneEmotion("-success");
          return false;
        }
      })
      .catch(function (error) {
        return false;
      });
  };

  const inputAddDown = (e) => {
    const val = e.target.value;
    if (e.key === "Enter" && val) {
      if (!validate("phone") && !validate("email")) {
        setPhoneAlert("Enter a valid phone number /email ID.");
        setPhoneEmotion("-alert");
        return false;
      } else {
        check_existence(val);
      }
    } else if (e.key === "Backspace" && !val) {
      removeMobile(addMobile.length);
    }
  };

  return (
    <>
      <DialogTitle id="scroll-dialog-title">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: "bold" }}>{allWords.misc.pg4.invitemore}</p>
          <div id="cross_div_button">
            <motion.div
              id="cross_motion_button"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
            >
              <IconButton
                id="cross_ib_button"
                onClick={() => {
                  setSearchInvite(false);
                }}
                style={{ width: 50, height: 50 }}
              >
                <CancelOutlined id="cross_icon_button" />
              </IconButton>
            </motion.div>
          </div>
        </div>
      </DialogTitle>
      <DialogContent
        dividers={scroll === "paper"}
        style={{
          minWidth: window.screen.width >= 768 ? 550 : "",
          overflowY: "hidden",
        }}
      >
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <>
            <div>
              <FormInput emotion={phone_emotion} custom_class={"w-100"}>
                <input
                  // value={mobileEmail}
                  type="text"
                  style={{
                    border: "none",
                    width: "100%",
                    height: "1.5rem",
                    outline: "none",
                  }}
                  maxLength={"300"}
                  placeholder={allWords.misc.pg4.addMobile}
                  onKeyDown={inputAddDown}
                  ref={addInput}
                />
              </FormInput>
              {phone_alert !== "" && (
                <small className="warn-text" ref={phone_alert_text}>
                  {phone_alert}
                </small>
              )}
              <br />
            </div>

            <SelectedOptions
              closeMenuOnSelect={false}
              options={userTags}
              isMulti
              placeholder={allWords.misc.pg4.searchuser}
              isClearable={true}
              components={{
                IndicatorSeparator: () => null,
                ClearIndicator: () => null,
                DropdownIndicator,
                LoadingIndicator,
                Option: FormatOptionLabel,
                NoOptionsMessage,
              }}
              styles={SearchCustomStyle}
              onInputChange={handleAudInputChange}
              onChange={handleSelectChange}
              value={selected}
              addMobile={addMobile}
              removeMobile={removeMobile}
              error_message={error_message}
            />
          </>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <button
          className={
            window.screen.width >= 768
              ? "btn primary-btn-blk w-75 invite_btns"
              : "btn primary-btn-blk w-50 invite_btns"
          }
          onClick={() => {
            setSearchInvite(false);
            inviteFollower(false);
          }}
        >
          INVITE
        </button>
      </DialogActions>
    </>
  );
};

export default SearchInviteDialog;
