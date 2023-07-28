import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allWords } from "../../App";
import welcomeGif from "../../assets/gif/welcome.gif";
import "./welcome3.css";

import { Done } from "@material-ui/icons";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Input,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Box } from "@mui/system";
import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import editIcon from "../../assets/icons/edit.svg";
import editProfile from "../../assets/icons/editProfile.svg";
import defaultUser from "../../assets/images/default_user.png";
import {
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../constants/env";
import logger from "../../logger";
import { toggleSignUpFlag } from "../../redux/actions/compActions";
import { userProfileData } from "../../redux/actions/profileAction/userProfileAction";
import ToastHandler from "../../utils/ToastHandler";
import {
  auto_login_continue,
  device_info,
  moengageEvent,
} from "../../utils/utils";
import EditImageWelcome from "./EditImagWelcome";

export default function Welcome3({
  welcomeScreen,
  fromHome = false,
  userData,
  setUserDialog,
  setSuccessDialog,
  hasUpdatedUsername,
}) {
  const [lang, setLang] = useState("English");
  const [languages, setLanguages] = useState(["English", "Hindi", "Tamil"]);

  const handleChange = (e) => {
    const { value } = e.target;
    setLang(value);

    const ind = languages.indexOf(value);

    const tempLangs = [...languages];

    let slicedArr = tempLangs.splice(0, ind);
    tempLangs.splice(1, 0, ...slicedArr);
    setLanguages(tempLangs);
  };

  // vars
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let us = JSON.parse(localStorage.getItem("current_user"));

  //states here
  const [editUsername, setEditUsername] = useState(false);
  const [editProfileImage, setEditProfileImage] = useState();
  const [avatar, setAvatar] = useState(
    `${POST_API_BASE_URL}/profile-photo/${us?.["username"]}/pp`
  );
  const [tempImage, setTempImage] = useState([]);
  const [profileMessage, setProfileMessage] = useState({
    type: "default",
    message: "Add your best pic here",
  });

  const [usernameMessage, setUsernameMessage] = useState({
    type: "default",
    // message: "Want to change your username?",
    message: "",
  });

  const [EditNameMessage, setEditNameMessage] = useState({
    type: "",
    message: "",
  });

  const [username, setUsername] = useState(us?.username || "");
  const [userForInput, setUserForInput] = useState(username);
  const [openEditor, setOpenEditor] = useState(false);
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [updatingImage, setUpdatingImage] = useState(false);
  const [validUsername, setValidUsername] = useState(true);
  // Refs
  const imageInputRef = useRef();

  useEffect(() => {
    if (!us) {
      sessionStorage.clear();

      navigate("/");
    }
    if (us && !sessionStorage.getItem("showWelcome")) {
      navigate("/home");
    }

    axios
      .get(avatar)
      .then((res) => {
        if (res.status !== 200) {
          setAvatar(defaultUser);
        }
      })
      .catch((err) => {
        if (
          err.response === undefined &&
          window.location.href.includes("welcome")
        ) {
          setAvatar(defaultUser);
        }
      });
  }, []);
  const editRef = useRef(null);

  // handler
  async function passFunc() {
    let url = `${REACT_APP_BASE_URL_FOR_USER}/check_passwordpresent/`;
    const data = {
      user_data: JSON.parse(localStorage.getItem("current_user"))["username"],
    };
    var config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    await axios(config)
      .then((res) => {
        if (res.data.data[0].pflag === false) {
          // window.location.replace("/")
          navigate("/setPass");
        }
        if (res.data.data[0].pflag === true) {
          navigate("/oldpass");
        }
        sessionStorage.removeItem("showWelcome");
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  useEffect(() => {
    setUsername(us?.username);
  }, [editUsername]);

  useEffect(() => {
    imageInputRef.current.value = "";

    if (!editProfileImage) {
      return setTempImage([]);
    }

    setTempImage([
      { file: editProfileImage, url: URL.createObjectURL(editProfileImage) },
    ]);
  }, [editProfileImage]);

  //updateprofile image function
  const updateProfileImg = (file) => {
    if (!file) return;
    setUpdatingImage(true);
    var reader = new FileReader();
    reader.onloadend = function () {
      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", file, "profile.jpg");
      data.append("type", "profile_photo");
      // data.append("image_encode", reader.result.split("base64,")[1]);
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
          setEditProfileImage();
          imageInputRef.current.value = "";
          setUpdatingImage(false);
          if (response.status === 200) {
            return setProfileMessage({
              message: "Your profile picture has been updated",
              type: "success",
            });
          }

          setProfileMessage({
            message: "Something went wrong, please try again",
            type: "success",
          });
          setAvatar(
            `${POST_API_BASE_URL}/profile-photo/${us?.["username"]}/pp`
          );
        })
        .catch(async function (e) {
          setAvatar(
            `${POST_API_BASE_URL}/profile-photo/${us?.["username"]}/pp`
          );
          setUpdatingImage(false);
          imageInputRef.current.value = "";
          const res = e.response;
          setEditProfileImage();

          if (!res)
            return setProfileMessage({
              message: "Something went wrong, please try again",
              type: "error",
            });

          if (res.status === 401) {
            return await auto_login_continue(() => updateProfileImg(file));
          }

          return setProfileMessage({
            message: "Something went wrong, please try again",
            type: "error",
          });
        });
    };
    reader.readAsDataURL(file);
  };

  const updateUsernameAndProfileName = async () => {
    let username_value = username.trim();
    if (username_value === us?.username) {
      return setEditNameMessage({
        message: "Nothing changed",
        type: "error",
      });
    } else {
      const updateName = async () => {
        let data = { name: username_value };
        let config = {
          method: "put",
          url: `${REACT_APP_BASE_URL_FOR_USER}/edit_profile/`,
          headers: {
            Authorization: `Bearer ${us?.access}`,
            "Content-Type": "application/json",
          },
          data: data,
        };

        try {
          const response = await axios(config);
          if (response.status === 200) {
            localStorage.setItem(
              "current_user",
              JSON.stringify({
                ...us,
                username: username_value,
                name: username_value,
                hasChangedUsername: true,
              })
            );

            let join_rt = localStorage.join_rt;
            if (join_rt) {
              join_rt = JSON.parse(join_rt);
              const updatedJoinRT = {
                ...join_rt,
                uid: username_value,
              };
              localStorage.setItem("join_rt", JSON.stringify(updatedJoinRT));
            }

            setUsernameMessage({
              message: "Your Username has been updated",
              type: "success",
            });
            if (fromHome == false) dispatch(toggleSignUpFlag(true));
          } else {
            setUsernameMessage({
              message: "Username updated but could not update profile name",
              type: "error",
            });
          }
          setEditUsername(false);
        } catch (e) {
          setEditUsername(false);
          const res = e.response;
          setUsernameMessage({
            message: "Username updated but could not update profile name",
            type: "error",
          });
          if (!res) return;
          if (res.status === 401) {
            auto_login_continue(() => {
              return updateName();
            });
          }
          return res;
        }
      };

      var data = JSON.stringify({
        device_info: device_info,
        new_username: username_value,
        old_user_name: us?.username,
        store_old_username: false,
        restore_flag: false,
      });

      var config = {
        method: "post",
        url: `${REACT_APP_BASE_URL_FOR_USER}/edit_username/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.access}`,
        },
        data: data,
      };

      try {
        const response = await axios(config);
        if (response.status === 200) {
          localStorage.setItem(
            "current_user",
            JSON.stringify({
              ...us,
              username: username_value,
              hasChangedUsername: true,
            })
          );
          let join_rt = localStorage?.join_rt;
          if (join_rt) {
            join_rt = JSON.parse(join_rt);
            const updatedJoinRT = {
              ...join_rt,
              uid: username_value,
            };
            localStorage.setItem("join_rt", JSON.stringify(updatedJoinRT));
          }
          updateName();
          moengageEvent("Update Username", "User", {
            Username: username_value,
          });
          if (fromHome == false) dispatch(toggleSignUpFlag(true));
        } else {
          setUsernameMessage({
            message: "Something went wrong! Please try again",
            type: "error",
          });
        }
      } catch (e) {
        const res = e.response;
        setUsernameMessage({
          message: "Something went wrong! Please try again",
          type: "error",
        });
        if (!res) return;
        if (res.status === 401) {
          auto_login_continue(() => {
            return updateUsernameAndProfileName();
          });
        }
        return res;
      }
    }
  };

  const VerifyUsername = async (cancelToken) => {
    setValidUsername(false);
    let regexp =
      /^[A-Za-z0-9\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u4e00-\u9eff\u3040–\u309F\u30A0–\u30FF]*[._-]?[a-zA-Za-z0-9\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u4e00-\u9eff\u3040–\u309F\u30A0–\u30FF]*[._-]?[a-zA-Za-z0-9\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u4e00-\u9eff\u3040–\u309F\u30A0–\u30FF]*$/gu;
    let username_value = username.trim();
    if (username_value === us?.username) {
      setValidUsername(true);
      return setEditNameMessage({
        message: "",
        type: "",
      });
    }
    if (username_value === "") {
      setEditNameMessage({
        message: "Username can not be empty",
        type: "error",
      });
    } else if (username_value?.length < 3) {
      setEditNameMessage({
        message: "Username must be atlease 3 characters long",
        type: "error",
      });
    } else if (username_value?.length > 15) {
      setEditNameMessage({
        message: "Username should be less than or equal to 15 letters",
        type: "error",
      });
    } else if (!regexp.test(username_value) || username_value.includes("@")) {
      setEditNameMessage({
        message: " Use only letters, numbers, . , - and _",
        type: "error",
      });
    } else {
      var data = JSON.stringify({
        username: username_value,
      });

      var config = {
        method: "post",
        url: `${REACT_APP_BASE_URL_FOR_USER}/user-search/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: STATIC_TOKEN,
        },
        data: data,
        cancelToken: cancelToken.token,
      };

      try {
        const response = await axios(config);
        if (response.status === 200 && response.data["status"] === 200) {
          setValidUsername(true);
          return setEditNameMessage({
            message: "Username is available",
            type: "success",
          });
        }

        if (response.status === 252 && response.data["status"] === 252) {
          return setEditNameMessage({
            message: "This username already exists",
            type: "error",
          });
        }
        setEditNameMessage({
          message: "Something went wrong, Please Try Again",
          type: "error",
        });
      } catch (e) {
        setEditNameMessage({
          message: "Something went wrong, Please Try Again",
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    VerifyUsername(source);
    return () => {
      source.cancel("Cancelling in cleanup");
    };
  }, [username]);

  const [langApiResLoading, setLangApiResLoading] = useState(false);
  async function continueBtnHandler() {
    await update_profile_lang();
    if (welcomeScreen !== true) {
      navigate("/home");
    } else {
      if (fromHome === false) {
        window.location.reload();
      } else {
        setUserDialog({ flag: 1, data: userData, updated: true });
        setSuccessDialog(true);
        dispatch(userProfileData({ username: us?.["username"] }));
      }
    }
    sessionStorage.removeItem("showWelcome");
  }

  const update_profile_lang = async () => {
    let access = localStorage.getItem("access");

    const langVal = lang.toLowerCase().slice(0, 2);

    try {
      setLangApiResLoading(true);
      var config = {
        method: "POST",
        url: `${REACT_APP_BASE_URL_FOR_USER}/update-profile-language`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        data: { display_language: langVal },
      };
      const res = await axios(config);

      if (res.status == 200) {
        let locData = JSON.parse(localStorage.getItem("current_user"));
        locData.display_language = langVal;
        localStorage.setItem("current_user", JSON.stringify(locData));
      }
    } catch (err) {
      ToastHandler("dan", allWords.misc.somethingwrong);
      setLangApiResLoading(false);
      return logger.error(err.message);
    }
  };
  useEffect(() => {
    editRef?.current?.click();
  }, []);

  return (
    <>
      <Grid
        container
        style={{
          width: welcomeScreen === true ? "100%" : "100vw",
          height: welcomeScreen === true ? "100%" : "100vh",
          background:
            welcomeScreen === true
              ? "transparent 0% 0% no-repeat padding-box"
              : "#999999 0% 0% no-repeat padding-box",
          position: welcomeScreen === true ? "fixed" : "",
          top: welcomeScreen ? "0px" : "",
          left: welcomeScreen ? "0px" : "",
          zIndex: welcomeScreen === true ? "1000" : "",
        }}
        justifyContent="center"
        alignItems={"center"}
      >
        <Grid
          container
          sx={{
            width: "100%",
            maxWidth: "580px",
            height: "85%",
            maxHeight: "650px",
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            boxShadow: "5px 5px 10px #0000001F",
            border: "1px solid #00000029",
            borderRadius: "16px",
            padding: fromHome === false ? "20px 4%" : "20px 2%",
          }}
          justifyContent="center"
        >
          <Grid
            item
            xs={12}
            style={{
              position: "relative",
            }}
          >
            <img
              className="welcomeImgStyle"
              hidden={fromHome}
              src={welcomeGif}
              alt=""
            />
            <Typography
              variant={"h2"}
              style={{
                textAlign: "center",
                font: "normal normal bold 40px Work Sans",
                color: "black",
              }}
            >
              {allWords.welcomePop.welcome}
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Box
              style={{
                width: "30%",
                aspectRatio: "1",
                margin: "auto",
                border: "2px solid #54B798",
                borderRadius: "50%",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {updatingImage ? (
                <CircularProgress />
              ) : (
                <img
                  src={avatar}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                  }}
                  alt="edit"
                />
              )}

              <input
                type="file"
                id="welcome-profile-edit"
                style={{ display: "none" }}
                ref={imageInputRef}
                accept="image/png, image/jpeg"
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
                        setEditProfileImage(imageFile);
                        setOpenEditor(true);
                      }
                    }
                  }
                }}
              />
              <IconButton
                style={{
                  position: "absolute",
                  bottom: "-2%",
                  right: "-2%",
                }}
                onClick={() => {
                  imageInputRef.current.click();
                }}
              >
                <img src={editProfile} />
              </IconButton>
            </Box>
            {editProfileImage && (
              <>
                <Button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "4px",
                    height: "fit-content",
                    font: "normal normal 600 12px Work Sans",
                    letterSpacing: "0.6px",
                    padding: "5px 30px",
                    margin: "10px 10px 10px 0px",
                    opacity: updatingImage ? "0.6" : "1",
                  }}
                  onClick={() => {
                    setEditProfileImage();
                    setTempImage([]);
                    setAvatar(
                      `${POST_API_BASE_URL}/profile-photo/${us?.["username"]}/pp`
                    );
                  }}
                  disabled={updatingImage}
                >
                  {allWords.misc.livert.dis}
                </Button>
                <LoadingButton
                  style={{
                    backgroundColor: "#54B798",
                    color: "white",
                    border: "4px",
                    height: "fit-content",
                    font: "normal normal 600 12px Work Sans",
                    letterSpacing: "0.6px",
                    padding: "5px 30px",
                    margin: "10px 0px",
                    opacity: updatingImage || updatingUsername ? "0.6" : "1",
                  }}
                  onClick={() => {
                    updateProfileImg(editProfileImage);
                  }}
                  loading={updatingImage}
                  loadingIndicator={<CircularProgress size={16} />}
                  disabled={updatingUsername}
                >
                  Save
                </LoadingButton>
              </>
            )}
          </Grid>
          {!editUsername && (
            <Grid item xs={12}>
              <Typography
                style={{
                  textAlign: "center",
                  font: "normal normal 600 32px Work Sans",
                  color: "#54B798",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                @{username}
                <IconButton
                  style={{
                    marginLeft: "5px",
                    borderRadius: "0px",
                  }}
                  ref={editRef}
                  onClick={() => {
                    setEditUsername((prev) => !prev);
                    setUserForInput("");
                  }}
                >
                  <img src={editIcon} />
                </IconButton>
              </Typography>
            </Grid>
          )}
          {editUsername && (
            <Grid item xs={12}>
              <Box className="box-style">
                <Input
                  type="text"
                  className={`input ${
                    window.location.pathname === "/home" ? "updateInput" : ""
                  }`}
                  placeholder={
                    window.location.pathname === "/home"
                      ? allWords.welcomePop.updateUsername
                      : allWords.welcomePop.createUsername
                  }
                  value={userForInput}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUserForInput(e.target.value);
                  }}
                  disabled={updatingUsername}
                  inputProps={{ maxLength: 15 }}
                />
                <LoadingButton
                  style={{
                    backgroundColor: "#54B798",
                    color: "white",
                    border: "4px",
                    height: "fit-content",
                    font: "normal normal 600 12px Work Sans",
                    letterSpacing: "0.6px",
                    padding: "5px 30px",
                    opacity:
                      updatingImage || !validUsername || userForInput.length < 1
                        ? "0.6"
                        : "1",
                  }}
                  disabled={
                    updatingImage || !validUsername || userForInput.length < 1
                  }
                  loadingIndicator={<CircularProgress size={16} />}
                  loading={updatingUsername}
                  onClick={() => {
                    updateUsernameAndProfileName();
                  }}
                >
                  {allWords.misc.update}
                </LoadingButton>
              </Box>
              {EditNameMessage.message && (
                <Typography
                  className={`errorMessage ${
                    EditNameMessage.type === "error" ? "error" : ""
                  }`}
                >
                  {EditNameMessage.message}
                </Typography>
              )}
            </Grid>
          )}
          <Grid item xs={12} hidden={fromHome}>
            <Typography
              style={{
                textAlign: "center",
                font: "normal normal 600 18px Work Sans",
                color:
                  usernameMessage.type === "default"
                    ? "black"
                    : usernameMessage.type === "error"
                    ? "red"
                    : "#54B798",
              }}
            >
              {usernameMessage.message}
            </Typography>
          </Grid>
          {/* ----------------------------------------------- */}
          <Grid item xs={12}>
            <Typography className="profileMessage">
              {allWords.welcomePop.addDP}
            </Typography>
            <Typography className="profileMessage languageMessage">
              {allWords.welcomePop.selectLang}
            </Typography>
          </Grid>
          {/* ----------------------------------------------- */}
          <div style={{ width: "80%" }}>
            <FormControl
              className="welcome-lang-select"
              fullWidth
              size="small"
              success
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={lang}
                onChange={handleChange}
                style={{ borderRadius: "10px", color: "#6A779B" }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: "8px",
                      "& .MuiMenuItem-root.Mui-selected": {
                        backgroundColor: "#6A779B15",
                      },
                      "& .MuiMenuItem-root:hover": {
                        backgroundColor: "#6A779B15",
                      },
                      "& .MuiMenuItem-root.Mui-selected:hover": {
                        backgroundColor: "#6A779B15",
                      },
                    },
                  },
                }}
              >
                {languages.map((el) => (
                  <MenuItem
                    className="language-popup-list"
                    key={el}
                    value={el}
                    itemID={el}
                    style={
                      lang === el
                        ? {
                            color: "#66b984",
                            borderBottom: "1px solid #00000029",
                            borderRadius: "10px",
                            padding: "10px",
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }
                        : {
                            color: "#000",
                            borderRadius: "10px",
                            padding: "10px",
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }
                    }
                  >
                    {el}
                    {lang === el ? (
                      <Done
                        className="done-icon-select"
                        color="#66b984"
                        style={{ marginLeft: "5px" }}
                      />
                    ) : null}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Grid item xs={12}>
            <Typography className="loginMessage">
              {allWords.welcomePop.interested}
              <br /> {allWords.welcomePop.kindly}{" "}
              <a to="/setPass" onClick={() => passFunc()}>
                {allWords.welcomePop.setPass}
              </a>
            </Typography>
          </Grid>
          <Button
            onClick={continueBtnHandler}
            style={{
              height: "fit-Content",
              width: "80%",
              backgroundColor:
                window.location.pathname === "/home" && !us?.hasChangedUsername
                  ? "#0000001f"
                  : "#1A1A1A",
              borderRadius: "8px",
              color: "white",
              padding: "15px 0px",
              opacity:
                editUsername ||
                editProfileImage ||
                updatingImage ||
                updatingUsername
                  ? "0.6"
                  : "1",
              cursor: "pointer",
            }}
            disabled={
              langApiResLoading ||
              editUsername ||
              editProfileImage ||
              updatingImage ||
              updatingUsername ||
              (window.location.pathname === "/home"
                ? hasUpdatedUsername
                  ? false
                  : us?.hasChangedUsername
                  ? false
                  : true
                : false)
            }
          >
            {allWords.login.btn}
          </Button>
        </Grid>
      </Grid>
      <EditImageWelcome
        editImage={editProfileImage}
        setEditImage={setEditProfileImage}
        tempImage={tempImage}
        setTempImage={setTempImage}
        openEditor={openEditor}
        setOpenEditor={setOpenEditor}
        setAvatar={setAvatar}
      />
    </>
  );
}
