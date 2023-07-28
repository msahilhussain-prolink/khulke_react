import axios from "axios";
import { subtract } from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select, { components } from "react-select";
import { useDebounce } from "use-debounce";

// Components
import FormInput from "../../components/FormInput";
import Permission from "../../components/Permission";
import EditImage from "../../components/Post/AddPostDialog/EditImage";
import { AccountSetting, Title } from "../../components/ProfileHeader/style";
import RightSideBar from "../../components/RightSideBar";
import CustomizedSnackbars from "../../components/Snackbar.component";
import Spinner from "../../components/Spinner";
import UserProfile from "../../components/UserProfile";

// Material UI
import { ExpandMore } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import EditIcon from "@mui/icons-material/Edit";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// Constants
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";

// Styles
import {
  CenterDiv,
  MainDiv,
  MyContentCard,
  RightDiv,
} from "../../global_styles/global_style.js";
import "./style.css";

import { editDetailsData } from "../../redux/actions/profileAction/editAction";

// Assets
import Back from "../../assets/icons/back.svg";
import search_icon from "../../assets/icons/search.svg";

// Utils
import { allWords } from "../../App";
import Header from "../../components/Header";
import { getPersonalDetailsData } from "../../redux/actions/personalDetailsAction";
import ToastHandler from "../../utils/ToastHandler";
import SelectForLanguage from "./SelectForLanguage";
import { moengageEvent } from "../../utils/utils";

const customStyles = {
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
    width: "17.813rem",
    textAlign: "left",
  }),
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    margin: "0.6rem 0px 0.3rem 0px",
    height: "3rem",
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
    overflow: "hidden",
  }),
  menuList: (base) => ({
    ...base,
    height: "150px",
    backgroundColor: "white",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#999999" : null,
      color: "#333333",
    };
  },
};

const SearchCustomStyle = {
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px",
    display: "flex",
    padding: "0.1rem",
    margin: "0.6rem 0px 0.3rem 0px",
  }),
};

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
    width: "20%",
    textAlign: "center",
  }),
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    margin: "0.6rem 0px 0.3rem 0px",
    height: "3rem",
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
    overflow: "hidden",
  }),
  menuList: (base) => ({
    ...base,
    height: "150px",
    backgroundColor: "white",
    overflow: "hidden",
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

const useStyles = makeStyles({
  card: {
    borderRadius: "10px",
    backgroundColor: "#66B984",
    width: "auto",
    color: "white",
    "&.active": {
      backgroundColor: "#F2F3F5",
      color: "#11141C",
    },
  },
});

const getvalidIntitalDateofBirth = () => {
  let a = moment(); 
  let b = a.subtract(4, 'years'); 
  return b.format("YYYY-MM-DD");
}

const PersonalDetail = () => {
  useEffect(Permission, []);

  let userII = [];
  //States
  const [first_time, setFirstTime] = useState(true);
  const [edit_Bio, setBio] = useState("");
  const [edit_Name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullname_emotion, setFullNameEmotion] = useState("");
  const [fullname_error, setFullNameError] = useState("");
  const name_alert_text = useRef("");
  const [name_debounce] = useDebounce(edit_Name, 1000);
  const [edit_Username, setUsername] = useState("");
  const [edit_Location, setLocation] = useState("");
  const [edit_WebsiteInfo, setWebsiteInfo] = useState("");
  const [imgState, setImgState] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [loadingimg, setLoadingimg] = useState(false);
  const [avatar, setAvatar] = useState(
    "https://via.placeholder.com/300x300/66B984/FFFFFF?text=?"
  );
  const personalInfo = useSelector((state) => state.personalDetails);
  const [imgOpen, setImgOpen] = useState(false);
  const [open, setOpen] = useState(false); // for side popup
  const [redirectUrl, setRedirectUrl] = useState("");
  const [chars_left, setCharsLeft] = useState(0);
  const [success, setSuccess] = useState(false);
  const [selected_iterests, setSelectedInterests] = useState([...userII]);
  const [curated, setCurated] = useState([]);
  const [highlighted_interests, setHighlightedInterests] = useState([]);
  const [selected, setSelected] = useState([]);
  const [profile_loading, setProfileLoading] = useState(true);
  const [profile_error, setProfileError] = useState(false);
  const [gender, setGender] = useState({ label: "", value: "" });
  const [dateValue, setDateValue] = useState(getvalidIntitalDateofBirth());
  const [date_error, setDateError] = useState("");
  const [country_code, setCountryCode] = useState([]);
  const [web_emotion, setWebEmotion] = useState("");
  const [web_alert, setWebAlert] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [main_categories, setMainCategories] = useState([]);
  const [intData, setIntData] = useState([]);
  const [tempImage, setTempImage] = useState([]);
  const [editImage, setEditImage] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hasProfileImage, setHasProfileImage] = useState(null);
  const maxDate =
    new Date().getFullYear() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getDate();

  // useRef
  const imageEditorRef = useRef();
  const website = useRef("");
  const web_alert_text = useRef("");
  const uploadDP = useRef("");
  const fullname = useRef("");
  const bio = useRef("");
  const date_picker = useRef("");
  const location = useRef("");

  // useDispatch
  const dispatch = useDispatch();

  // useSelector
  const loading = useSelector((state) => state.interest.loading);
  const error = useSelector((state) => state.interest.error);

  const regexx = /[!@#$%^&*(),?":{}|<>]/g;

  // useNavigate
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPersonalDetailsData());
  }, []);

  const onImageChange = (e) => {
    if (e.target.files[0]) {
      setImgFile(e.target.files[0]);
      setImgState(true);
      setImgUrl(URL.createObjectURL(e.target.files[0]));
    }
  };
  let current_user = { username: "anonymous" };
  try {
    current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );
  } catch (err) {}

  const checkFullName = () => {
    const name_value = edit_Name.trim();
    if (name_value === "") {
      setFullNameEmotion("-alert");
      setFullNameError("Please enter your full name");
      name_alert_text.current.classList = ["warn-text"];
    } else if (name_value.length < 3) {
      setFullNameEmotion("-alert");
      setFullNameError("Fullname should be more than 2 letters");
      name_alert_text.current.classList = ["warn-text"];
    } else if (regexx.test(name_value)) {
      setFullNameEmotion("-alert");
      setFullNameError(
        "only contain alphabets, numbers, '.', '_', '-' and ' '(space) characters"
      );
      name_alert_text.current.classList = ["warn-text"];
    } else {
      setFullNameEmotion("-success");
      setFullNameError("");
      name_alert_text.current.classList = ["alert-text"];
    }
  };

  useEffect(() => {
    if (!first_time) {
      checkFullName();
    }
  }, [name_debounce]);

  // change profile pic api
  const profileImg = (file, encoded) => {
    if (!file) return;
    setLoadingimg(true);
    var reader = new FileReader();
    reader.onloadend = function () {
      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", file, "profile.jpg");
      data.append("type", "profile_photo");
      var config = {
        method: "post",
        url: `${REACT_APP_BASE_URL_FOR_USER}/upload_image/`,
        headers: {
          Authorization: `Bearer ${localStorage.access}`,
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            setLoadingimg(false);
            setImgState(false);
            setImageUrl(imgUrl);
            window.location.reload();
          }
        })
        .catch(async function (e) {
          const res = e.response;
          if (!res) return setLoadingimg(false);

          if (res.status === 401) {
            return await auto_login_continue(() => profileImg(file, encoded));
          }
          setLoadingimg(false);
        });
    };
    reader.readAsDataURL(file);
    setAvatar(URL.createObjectURL(file));
  };

  // Character count

  const handleWordcount = () => {
    const charCount = bio.current.value.length;
    const maxChar = 300;
    const charLength = maxChar - charCount;
    setCharsLeft(charCount);
  };

  if (
    JSON.parse(localStorage.getItem("current_user"))["interest"] !== undefined
  ) {
    userII = JSON.parse(localStorage.getItem("current_user"))["interest"];
  }

  const handleGenderChange = (gender) => {
    setGender(gender);
  };

  const handleSelectChange = (values) => {
    setSelected(values);
  };

  // Profile Data
  function getProfileData() {
    if (personalInfo) {
      setProfileLoading(false);
      setProfileError(false);
      let master = personalInfo.data?.data?.self_user;
      if (master) {
        const {
          preferred_language,
          one_liner,
          name,
          username,
          phone_number,
          sex,
          location,
          date_of_birth,
          website_info,
          profile_photo,
        } = master;
        let temp = preferred_language;
        let temp_pref_lang = [];
        try {
          temp?.forEach((lang) => {
            temp_pref_lang.push({ label: lang, value: lang });
          });
        } catch (err) {
          return;
        }
         setBio(master["one_liner"] === " " ? "" : master["one_liner"]);
        setName(master["name"]);
        setUsername(master["username"]);
        handleGenderChange({
          label: master?.["sex"],
          value: master?.["sex"],
        });
        setLocation(master["location"]);
        handleChange(master?.["date_of_birth"]);
        setWebsiteInfo(master["website_info"][0]);
        handleSelectChange(temp_pref_lang);
        setSelectedInterests(master["interest"]);
        setHasProfileImage(profile_photo);
        moengageEvent("View Page", "ALL", {
          URL: `${window.location.origin}/${window.location.pathname}`,
        });
      }
    } else {
      setProfileLoading(true);
      setProfileError(false);
    }
  }
const genderValue = [
    { label: allWords.profile.male, value: allWords.profile.male },
    { label: allWords.profile.female, value: allWords.profile.female },
    { label: allWords.profile.other, value: allWords.profile.other },
  ];

  // Calendar
  const handleChange = (newValue) => {
    if (newValue !== "") {
      let currentDate = moment();
      let newValueDate = moment(new Date(newValue));
      if (Math.abs(currentDate.diff(newValueDate, 'years')) >= 4) {
        setDateValue(newValue);
        setDateError("");
      } else {
        setDateValue(newValue);
        setDateError(allWords.dateTime.validation.dobValidation);
      }
    } 
  };

  // Country Code
  const handleCodeChange = (country_code) => {
    setCountryCode({ country_code });
  };

  const WebValidate = () => {
    const webValue = website.current.value.trim();
    let webRegex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    if (website.current.value !== "") {
      if (!webRegex.test(webValue)) {
        setWebAlert("Enter a valid website.");
        setWebEmotion("-alert");
        web_alert_text.current.classList = ["warn-text"];
        setIsValid(false);
        return false;
      } else {
        setWebAlert("");
        setWebEmotion("-success");
        return true;
      }
    } else if (website.current.value === "") {
      setWebAlert("");
      setWebEmotion("");
      return true;
    }
  };

  // Api
  function check_user_exist() {
    if (
      !localStorage.getItem("current_user") ||
      !localStorage.getItem("access")
    ) {
      window.location.replace("/");
    }
  }
// Get Data
const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };
const update_profile = async () => {
    let languages = [];
    selected.forEach((language) => {
      languages.push(language["value"]);
    });
    if (regexx.test(fullname.current.value)) {
      ToastHandler(
        "dan",
        "only contain alphabets, numbers, '.', '_', '-' and ' '(space) characters"
      );
    }if(date_error){
      ToastHandler(
        "dan",
        date_error
      );
    } else {
      let profile_data = {
        one_liner: bio.current.value === "" ? " " : bio.current.value,
        name: fullname.current.value,
        date_of_birth: moment(new Date(dateValue)).format("YYYY-MM-DD"),
        website_info: [website.current.value],
        location: location.current.value,
        preferred_language: languages,
        interest: selected_iterests,
        sex: gender["value"],
        display_language: lang,
      };
      let access = localStorage.getItem("access");
      let data = { access: access, profile_data: profile_data };

      await dispatch(editDetailsData(data));
      await changeLocalStorage();
      dispatch({ type: "changed" });
      //change profile pic function
      try {
        profileImg(imgFile);
      } catch (err) {
        ToastHandler("dan", "Failed. try again!");
      }
    }
  };

  // ** All data interest
  useEffect(() => {
    var config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_USER}/view_interest/`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    };

    axios(config)
      .then(function (response) {
        const all_interest_data = response.data;
        setIntData(all_interest_data);
      })
      .catch(async function (e) {
        const res = e.response;
        if (!res) return;

        if (res.status === 401) {
          return await auto_login_continue(() => {
            axios(config).then(function (response) {
              const all_interest_data = response.data;
              setIntData(all_interest_data);
            });
          });
        }
      });

    handleCodeChange({ label: "+91", value: "1" });
  }, []);

  useEffect(() => {
    if (intData?.data) {
      let temp_structure = {};
      let temp_curated = [...curated];
      try {
        intData["data"].forEach((item) => {
          let temp_main_category = item["item"][0]["category_name"];
          temp_structure[temp_main_category] = [];
          item["item"][0]["sub_category"].forEach((sub_item) => {
            temp_structure[temp_main_category].push(
              sub_item["sub_category_name"]
            );
          });
        });
        temp_curated.push(temp_structure);
        setCurated(temp_curated);
        if (
          JSON.parse(localStorage.getItem("current_user"))["interest"] !==
          undefined
        ) {
          setSelectedInterests(
            JSON.parse(localStorage.getItem("current_user"))["interest"]
          );
        }
        return;
      } catch (err) {
        return;
      }
    }
    if (
      JSON.parse(localStorage.getItem("current_user"))["interest"] !== undefined
    ) {
      setSelectedInterests(
        JSON.parse(localStorage.getItem("current_user"))["interest"]
      );
    }
  }, [intData]);

  useEffect(() => {
    if (selected_iterests?.length > 0) {
      let temp_highlight = [];
      selected_iterests.forEach((interest) => {
        interest["sub_category"].forEach((sub_interest) => {
          temp_highlight.push(
            interest["category_name"] + "|" + sub_interest["sub_category_name"]
          );
        });
      });
      setHighlightedInterests(temp_highlight);
    }
  }, [curated, selected_iterests]);

  const handleInterestChange = (subitem, mainitem, action) => {
    let temp_selected_interests = [...selected_iterests];
    if (action === "add") {
      let structure = {
        category_name: mainitem,
        sub_category: [
          {
            sub_category_name: subitem,
          },
        ],
      };
      if (temp_selected_interests.length === 0) {
        temp_selected_interests.push(structure);
        setSelectedInterests(temp_selected_interests);
        return true;
      }
      let key_exists = false;
      temp_selected_interests.forEach((item) => {
        if (item["category_name"] === mainitem) {
          item["sub_category"].push({ sub_category_name: subitem });
          setSelectedInterests(temp_selected_interests);
          key_exists = true;
        }
      });
      if (!key_exists) {
        temp_selected_interests.push(structure);
        setSelectedInterests(temp_selected_interests);
      }

      return true;
    } else if (action === "remove") {
      temp_selected_interests.forEach((item) => {
        if (item["category_name"] === mainitem) {
          item["sub_category"] = item["sub_category"].filter(
            (interest) => interest["sub_category_name"] !== subitem
          );
        }
      });
      setSelectedInterests(temp_selected_interests);
    }
  };

  const changeLocalStorage = () => {
    var data = JSON.stringify({
      username: JSON.parse(
        localStorage.current_user || localStorage.anonymous_user
      )["username"],
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
          localStorage.removeItem("current_user");
          localStorage.setItem(
            "current_user",
            JSON.stringify(response.data.data["user_other"])
          );
          setHasProfileImage(
            response?.data?.data?.["user_other"]?.["profile_photo"]
          );
        }
        setSuccess(true);
      })
      .catch(async function (e) {
        const res = e.response;
        if (!res) return;

        if (res.status === 401) {
          return await auto_login_continue(changeLocalStorage);
        }
      });
  };

  useEffect(() => {
    getProfileData();
    check_user_exist();
  }, [personalInfo]);

  const filter_interests = () => {
    let temp_curated = [];
    Object.keys(curated[0]).forEach((main_item) => {
      curated[0][main_item].forEach((sub_item) => {
        if (sub_item.toLowerCase().includes(searchInput.toLowerCase())) {
          if (!temp_curated.includes(main_item)) {
            temp_curated.push(main_item);
          }
        }
      });
    });
    setMainCategories(temp_curated);
  };

  useEffect(() => {
    if (curated.length > 0) {
      filter_interests();
    }
  }, [curated, searchInput]);

  useEffect(() => {
    if (!tempImage[0]?.cropped) return;
    onImageChange({ target: { files: [tempImage[0].file] } });
    setEditImage(false);
    uploadDP.current.value = "";
    setTempImage([]);
    setImageUrl(tempImage[0].url);
  }, [tempImage]);

  const handleExpandChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProfileChange = () => {
    uploadDP.current.click();
  };

  // Change Language
  const [languages, setLanguages] = useState(["English", "Hindi"]);
  const [lang, setLang] = useState(
    JSON.parse(localStorage.getItem("current_user")).display_language
  );
  const handleChangeForSelect = (e) => {
    const { value } = e.target;
    const tempVal = value.toLowerCase().slice(0, 2);
    setLang(tempVal);

    const ind = languages.indexOf(value);

    const tempLangs = [...languages];

    let slicedArr = tempLangs.splice(0, ind);
    tempLangs.splice(1, 0, ...slicedArr);
    setLanguages(tempLangs);
  };

  useEffect(() => {
    const value = languages.find((el) => el.toLowerCase().includes(lang));

    const ind = languages.indexOf(value);

    const tempLangs = [...languages];

    let slicedArr = tempLangs.splice(0, ind);
    tempLangs.splice(1, 0, ...slicedArr);
    setLanguages(tempLangs);
  }, []);

  return (
    <>
      <Header />
      {open && (
        <CustomizedSnackbars
          open={open}
          handleClose={handleClose}
          redirectUrl={redirectUrl}
        />
      )}
      <MainDiv
        label="follow"
        style={{
          height: "100vh",
        }}
      >
        <CenterDiv label="follow">
          {profile_loading && <Spinner />}
          {profile_error && (
            <div className="text-center">
              <small className="warn-text">{allWords.profile.fallback}</small>
            </div>
          )}
          {!profile_loading && !profile_error && (
            <>
              <input
                type="file"
                accept="image/*"
                hidden
                style={{ display: "none" }}
                ref={uploadDP}
                onChange={(e) => {
                  const imageFile = e.target.files[0];
                  if (!imageFile) return;

                  if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
                    ToastHandler(
                      "warn",
                      allWords.misc.toastMsg.invalidImgFormat
                    );
                    return false;
                  }

                  if (imageFile) {
                    for (let i = 0; i < e.target.files.length; i++) {
                      let size = e.target.files[i].size;
                      if (Math.round(size / 1024) > 1024 * 15) {
                        ToastHandler(
                          "warn",
                          "Upload an image less than 15 MB."
                        );
                        e.target.value = null;
                        return false;
                      } else {
                        setTempImage([
                          {
                            file: e.target.files[0],
                            url: URL.createObjectURL(e.target.files[0]),
                            name: imageFile.name,
                          },
                        ]);
                        setEditImage(true);
                      }
                    }
                  }
                }}
              />

              <div className="top-profile-nav">
                <div className="d-flex justify-content-start">
                  <img
                    className="back-icon-not-for-mobile"
                    style={{ display: "inline-block", cursor: "pointer" }}
                    src={Back}
                    alt="back button"
                    onClick={() => {
                      navigate(-1);
                    }}
                  />

                  <Title>{allWords.profile.pageTitle} </Title>
                </div>
                <div className="save-personal-details-btn">
                  {edit_Username ===
                    JSON.parse(
                      localStorage.current_user || localStorage.anonymous_user
                    )["username"] &&
                    window.location.pathname === "/personal_details" && (
                      <div className="btn-save-change-div">
                        <AccountSetting
                          type="submit"
                          onClick={() => {
                            update_profile();
                            // changeLocalStorage();
                          }}
                        >
                          {allWords.misc.save}
                        </AccountSetting>
                      </div>
                    )}
                </div>
              </div>

              {loadingimg ? (
                <Spinner />
              ) : (
                <div
                  style={{
                    height: "12rem",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <div
                    className="pdHeadDiv"
                    // style={{ justifyContent: "center" }}
                  >
                    {imageUrl ? (
                      <img
                        src={`${imageUrl}`}
                        alt="profile"
                        className="profileImgs"
                      />
                    ) : (
                      <>
                        {edit_Username !== "" && (
                          <UserProfile
                            username={edit_Username}
                            className="profileImgs"
                          />
                        )}
                      </>
                    )}
                    &emsp;
                    <IconButton
                      className="proPicEdit"
                      onClick={handleProfileChange}
                    >
                      <EditIcon style={{ color: "#66b984" }} />
                    </IconButton>
                  </div>

                  <div
                    id="myModal"
                    className="modal"
                    style={{ display: imgOpen ? "block" : "none" }}
                  >
                    <span className="close" onClick={() => setImgOpen(false)}>
                      &times;
                    </span>
                    <UserProfile
                      username={edit_Username}
                      className="modal-content"
                      id="img01"
                      style={{
                        objectFit: "contain",
                        boxShadow: "0 2px 4px 2px #3d3d3d",
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                className="personal-details-parent"
                style={{ marginTop: "1.5rem" }}
              >
                <small className="personalDetails">
                  {allWords.profile.perso4}
                </small>
                <div>
                  {/* <small className="alert-text bioText">{allWords.profile.bio}</small> */}

                  <div className="bioCount">
                    <textarea
                      rows="5"
                      style={{ resize: "none", border: "none", width: "100%" }}
                      ref={bio}
                      value={edit_Bio}
                      onChange={(e) => {
                        setBio(e.target.value);
                        handleWordcount();
                      }}
                      maxLength={"300"}
                      placeholder={allWords.profile.bio}
                    />
                    <p style={{ textAlign: "right", marginBottom: "0rem" }}>
                      {edit_Bio.length || chars_left}/300
                    </p>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6">
                    <small className="alert-text">
                      {allWords.misc.fullname}
                    </small>
                    <FormInput
                      custom_class="fullNameFI"
                      emotion={fullname_emotion}
                    >
                      <input
                        minLength={3}
                        maxLength={30}
                        ref={fullname}
                        type="text"
                        onChange={(e) => {
                          setFirstTime(false);
                          setName(e.target.value);
                        }}
                        placeholder="Enter Full Name"
                        value={edit_Name}
                      />
                    </FormInput>
                    <small ref={name_alert_text} className="warn-text">
                      {fullname_error}
                    </small>
                  </div>
                  <small style={{ display: "none" }}>Fullna||</small>
                  <div className="col-12 col-sm-12 col-md-6">
                    <small className="alert-text">
                      {allWords.misc.pages.dob}
                    </small>
                    <div className="widthDiv">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={1}>
                          <DatePicker
                            value={dateValue}
                            ref={date_picker}
                            maxDate={moment()}
                            onChange={handleChange}
                            inputFormat="dd/MM/yyyy"
                            renderInput={({
                              inputRef,
                              inputProps,
                              InputProps,
                            }) => (
                              <Box className="localBox">
                                <input
                                  style={{ border: "transparent" }}
                                  ref={inputRef}
                                  {...inputProps}
                                />
                                {InputProps?.endAdornment}
                              </Box>
                            )}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </div>
                    <small className="warn-text"> {date_error} </small>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6">
                    <small className="alert-text">
                      {allWords.misc.pages.gender}
                    </small>
                    <Select
                      closeMenuOnSelect={true}
                      value={gender}
                      onChange={handleGenderChange}
                      options={genderValue}
                      components={{
                        IndicatorSeparator: () => null,
                        IndicatorsContainer: () => null,
                      }}
                      styles={customStyles}
                      className="dropdown-personal-details"
                    />
                  </div>

                  <small style={{ visibility: "hidden", display: "none" }}>
                    Full Na|
                  </small>

                  <div className="col-12 col-sm-12 col-md-6">
                    <small className="alert-text">
                      {allWords.misc.pages.loc}
                    </small>
                    <FormInput custom_class="widthDiv">
                      <input
                        ref={location}
                        type="text"
                        value={edit_Location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                        }}
                        placeholder={allWords.misc.enterlocation}
                      />
                    </FormInput>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div>
                    <small className="alert-text">
                      {allWords.misc.website}
                    </small>
                    <FormInput emotion={web_emotion} custom_class="webFormI">
                      <input
                        ref={website}
                        type="text"
                        onChange={(e) => {
                          setWebsiteInfo(e.target.value);
                          WebValidate();
                        }}
                        placeholder={allWords.profile.Enterwbsiteplace}
                        value={edit_WebsiteInfo}
                      />
                    </FormInput>

                    <small ref={web_alert_text}>{web_alert}</small>
                  </div>
                </div>
                <SelectForLanguage
                  lang={lang}
                  handleChangeForSelect={handleChangeForSelect}
                  languages={languages}
                />
                <div>
                  <small style={{ color: "#63779C", fontWeight: "bold" }}>
                    {allWords.misc.pages.interest}
                  </small>
                  <FormInput>
                    <input
                      type="text"
                      placeholder={allWords.misc.pg3.catergoryplace}
                      onChange={handleSearch}
                    />
                    <img src={search_icon} alt="" />
                  </FormInput>
                  <MyContentCard>
                    <div className="px-2 event_container">
                      <Grid margin="0 auto" width="100%" container spacing={2}>
                        <>
                          {curated.length > 0 &&
                            Object.keys(curated[0])?.map((item, index) => (
                              <div
                                className="container-fluid categories-parent-div"
                                key={index}
                              >
                                {main_categories.includes(item) && (
                                  <Box
                                    style={{
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    <Accordion
                                      expanded={expanded === `panel${index}`}
                                      onChange={handleExpandChange(
                                        `panel${index}`
                                      )}
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-controls={`panel${index}bh-content`}
                                        id={`panel${index}bh-header`}
                                        style={{
                                          padding: "5px 10px",
                                          width: "100%",
                                        }}
                                      >
                                        <div>
                                          <img
                                            src={`https://via.placeholder.com/300x300/66B984/FFFFFF?text=${item[0].toUpperCase()}`}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              borderRadius: "7px",
                                            }}
                                            alt="Interest"
                                          />
                                          <small
                                            style={{
                                              marginLeft: "15px",
                                              marginTop: "-25px",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {item}
                                          </small>
                                        </div>
                                      </AccordionSummary>
                                      <AccordionDetails
                                        style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          marginTop: "-40px",
                                        }}
                                      >
                                        {curated[0][item]
                                          .filter((fil_sub_item) => {
                                            if (
                                              fil_sub_item
                                                .toLowerCase()
                                                .includes(
                                                  searchInput.toLowerCase()
                                                )
                                            ) {
                                              return fil_sub_item;
                                            }
                                          })
                                          .map((sub_item, sub_index) => (
                                            <div key={sub_index}>
                                              <Grid
                                                item
                                                className={
                                                  highlighted_interests.includes(
                                                    item + "|" + sub_item
                                                  )
                                                    ? `px-4 active`
                                                    : `px-4 card`
                                                }
                                                style={{
                                                  marginRight: "0.4rem",
                                                  textAlign: "center",
                                                  padding: "0.3rem",
                                                  fontSize: "1rem",
                                                  marginTop: "1rem",
                                                }}
                                                onClick={(e) => {
                                                  if (
                                                    e.target.classList.contains(
                                                      "active"
                                                    )
                                                  ) {
                                                    e.target.classList = [
                                                      "px-4 card",
                                                    ];
                                                    handleInterestChange(
                                                      sub_item,
                                                      item,
                                                      "remove"
                                                    );
                                                  } else {
                                                    e.target.classList = [
                                                      "px-4 active",
                                                    ];
                                                    handleInterestChange(
                                                      sub_item,
                                                      item,
                                                      "add"
                                                    );
                                                  }
                                                }}
                                              >
                                                {sub_item}
                                              </Grid>
                                            </div>
                                          ))}
                                      </AccordionDetails>
                                    </Accordion>
                                  </Box>
                                )}
                              </div>
                            ))}
                          {loading && (
                            <div
                              style={{
                                width: "100%",
                                minHeight: 300,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Spinner />
                            </div>
                          )}
                          {error && (
                            <div
                              style={{
                                width: "100%",
                                minHeight: 300,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <h6>{error}</h6>
                            </div>
                          )}
                        </>
                      </Grid>
                    </div>
                  </MyContentCard>
                </div>
                <hr />
                {success && (
                  <div className="mt-2">
                    <small className="text-success">
                      {allWords.misc.changessaved}
                    </small>
                  </div>
                )}
                <button
                  type="submit"
                  onClick={() => {
                    update_profile();
                  }}
                  className="btn primary-btn-blk hide-btn-mobile"
                  style={{ width: "50%" }}
                >
                  {allWords.misc.savechanges}
                </button>
                &emsp;
                <button
                  className="update_username hide-btn-mobile"
                  onClick={() => {
                    navigate("/account_settings");
                  }}
                >
                  {allWords.misc.updateuname}
                </button>
              </div>
            </>
          )}

          <Modal
            onClose={() => {
              setEditImage(false);
              uploadDP.current.value = "";
            }}
            open={editImage}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper className="proPicModal" elevation={4}>
              <EditImage
                imageSrc={{
                  index: 0,
                  file: tempImage[0]?.file,
                  url: tempImage[0]?.url,
                }}
                setImgArray={setTempImage}
                imgArray={tempImage}
                ref={imageEditorRef}
                fixedRatio={1 / 1}
              />
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Button
                    onClick={() => {
                      imageEditorRef.current.setCroppedImage();
                    }}
                    variant="contained"
                    style={{
                      padding: "10px 30px",
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "10px",
                      marginTop: "20px",
                    }}
                  >
                    {allWords.misc.save}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => {
                      setEditImage(false);
                      setTempImage([]);
                      uploadDP.current.value = "";
                    }}
                    variant="contained"
                    style={{
                      padding: "10px 30px",
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "10px",
                      marginTop: "20px",
                    }}
                  >
                    {allWords.misc.livert.dis}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Modal>
        </CenterDiv>
        <RightDiv style={{ marginLeft: "10px", width: "360px" }}>
          <RightSideBar showRoundtabaleContent />
        </RightDiv>
      </MainDiv>
    </>
  );
};

export default PersonalDetail;
