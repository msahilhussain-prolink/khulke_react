import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Assets
import Back from "../../assets/icons/back.svg";
import cake from "../../assets/icons/cake.svg";
import locationIcon from "../../assets/icons/locationIcon.svg";
import shareInProfile from "../../assets/icons/shareInProfile.svg";

// Components
import Spinner from "../../components/Spinner";
import EditImage from "../Post/AddPostDialog/EditImage";
import PreloginComp from "../PreLoginComp";
import VIPComp from "../VipComp";

// Styles
import {
  EditBtn,
  FollowerCount,
  FollowerDiv,
  FollowerTag,
  Title,
} from "./style";
import "./style.css";

// Constants
import {
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../constants/env";

// Material UI
import PersonIcon from "@mui/icons-material/Person";
import { Button, Grid, Modal, Paper } from "@mui/material";

// Utils
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import ToastHandler from "../../utils/ToastHandler";
import {
  auto_login_continue,
  moengageEvent,
  replaceURLs,
} from "../../utils/utils";

// Lang
import { allWords } from "../../App";
import UserProfile from "../UserProfile";
import { globalImages } from "../../assets/imagesPath/images";
import FullScreenDialog from "../common/FullSizeDialobox";

const ProfileHeader = ({
  edit_btn,
  follow,
  follow_btn,
  blockUser = false,
  onImageChange,
  p_loading = false,
  p_error = false,
  loadingimg,
  setImageUrl,
}) => {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [user_name, setUsername] = useState("");
  const [user_id, setUserId] = useState("");
  const [dob, setDOB] = useState("");
  const [web, setWebsite] = useState("");
  const [interest, setInterest] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState([]);
  const [privacy_settings, setPrivacySettings] = useState([]);
  const follows = useRef(false);
  const [is_following, setIsFollowing] = useState(false);
  const [privacy_temp, setPrivacyTemp] = useState([]);
  const [profilehOpen, setProfilehOpen] = useState(false);
  const [userType, setUserType] = useState("");

  //states and refs regarding edit image
  const [tempImage, setTempImage] = useState([]);
  const [editImage, setEditImage] = useState(false);

  const imageEditorRef = useRef();
  // URL Params
  const url_search_params = new URL(window.location.href);
  let username =
    url_search_params.pathname.split("/")[2] ||
    JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
      "username"
    ];

  // Profile Data
  async function getProfileData() {
    const data = JSON.stringify({
      username: username,
    });

    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}${
        anonymous_user ? "/anonymous/user_profile/" : "/profile/"
      }`,
      headers: {
        Authorization: `Bearer ${
          anonymous_user ? anonymous_user?.["token"] : localStorage.access
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    setFollowers(0);
    setFollowing(0);

    await axios(config)
      .then(async function (response) {
        if (response.status === 200) {
          setFollowers(response.data.data["count"]["followers"]);
          setFollowing(response.data.data["count"]["following"]);
          setLocation(response.data.data["user_other"]["location"]);
          setBio(response.data.data["user_other"]["one_liner"]);
          setName(response.data.data["user_other"]["name"]);
          setUsername(response.data.data["user_other"]["username"]);
          setDOB(response.data.data["user_other"]["date_of_birth"]);
          setUserId(response.data.data["user_other"]["_id"]);
          setUserType(response?.data?.data?.["user_other"]?.["user_type"]);
          setPrivacySettings(
            response.data.data["user_other"]["privacy_settings"]
          );
          moengageEvent("View Page", "ALL", {
            URL: `${window.location.origin}/${window.location.pathname}`,
          });
          try {
            //Returns blank dict when empty
            if (
              Array.isArray(response.data.data["user_other"]["website_info"])
            ) {
              setWebsite(response.data.data["user_other"]["website_info"][0]);
            } else {
              setWebsite("");
            }
          } catch (err) {
            setWebsite("");
          }
          setInterest(response.data.data["user_other"]["interest"]);

          if (response.data.data["is_following"] === "False") {
            setIsFollowing(false);
          } else {
            setIsFollowing(true);
          }
        }
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(getProfileData);
        }
      });
  }

  const selfState = useLocation();

  useEffect(() => {
    getProfileData();
  }, [selfState]);

  useEffect(() => {
    let interest_array = [];
    interest?.map((item) => interest_array.push(item.sub_category));
    let sub_interest_array = [];
    interest_array?.map((item) =>
      item.map((i) => sub_interest_array.push(i.sub_category_name))
    );
    setSubCategoryName(sub_interest_array);
  }, [interest]);

  useEffect(() => {
    let temp = [];
    if (!privacy_settings) return;
    if (privacy_settings?.includes("dob")) {
      temp.push("dob");
    } else if (privacy_settings?.includes("location")) {
      temp.push("location");
    } else if (privacy_settings?.includes("website")) {
      temp.push("website");
    } else if (privacy_settings?.includes("interest")) {
      temp.push("interest");
    }
    setPrivacyTemp(temp);
  }, [privacy_settings]);
  const uploadDP = useRef("");

  // profile pic open
  const [imgOpen, setImgOpen] = useState(false);
  const editDP = () => {
    if (window.location.pathname.includes("personal_details")) {
      uploadDP.current.click();
    } else {
      setImgOpen(true);
    }
  };

  const follow_unfollow_driver = async (handle, type) => {
    if (!handle) {
      return;
    }
    let temp1 = follows.current.innerHTML;
    let temp = "";
    if (temp1 === "Follow") {
      temp = "follow";
    } else {
      temp = "unfollow";
    }
    let data = JSON.stringify({ handle, type: temp });
    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/follow-friends/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    await axios(config)
      .then(async (res) => {
        if (res.status === 200) {
          moengageEvent(type === "follow" ? "Follow" : "UnFollow", "User", {
            IdOth: user_id,
            UsernameOth: handle,
          });

          if (res.data.message == "User added successfully") {
            let followingConcat = localStorage
              .getItem("followings")
              .concat(",", handle);
            localStorage.setItem("followings", followingConcat);
          }
          if (res.data.message == "User unfollowed") {
            let followingFromLS4arr2 = Array.from(
              localStorage.getItem("followings").split(",")
            );
            localStorage.setItem(
              "followings",
              followingFromLS4arr2.filter((i) => i !== handle)
            );
          }
          if (temp === "unfollow") {
            follows.current.classList = ["follow-button-small"];
            follows.current.innerHTML = "Follow";
          } else {
            follows.current.classList = ["following-button-small"];
            follows.current.innerHTML = "Following";
          }
        }
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(() =>
            follow_unfollow_driver(handle, type)
          );
        }
      });
  };

  //image editing effects
  useEffect(() => {
    if (!tempImage[0]?.cropped) return;
    onImageChange({ target: { files: [tempImage[0].file] } });
    setEditImage(false);
    uploadDP.current.value = "";
    setTempImage([]);
    setImageUrl(tempImage[0].url);
  }, [tempImage]);

  async function shareProfile() {
    const data = JSON.stringify({
      username: username,
    });

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/${
        !localStorage.current_user
          ? "anonymous/share-profile-data-links"
          : "share-user-data-links"
      }`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
      },
      data: data,
    };

    return axios(config)
      .then((res) => {
        ToastHandler("sus", allWords.misc.succcopied);
        navigator.clipboard.writeText(res?.data?.data?.[0]?.["link"]);
        moengageEvent("Share", "User", {
          IdOth: user_id,
          UsernameOth: username,
        });
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          await auto_login_continue(() => {
            return shareProfile({
              username,
            });
          });
        }
        return res;
      });
  }
  // observer
  const myStickyRef = useRef();
  let options = {
    root: myStickyRef.current,
    rooMargin: "0px",
    threshold: 0.25,
  };
  const [yesOut, setYesOut] = useState();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setYesOut(entry.isIntersecting);
    }, options);
    observer.observe(myStickyRef.current);
  }, []);

  return (
    <>
      {p_loading && <Spinner />}
      {p_error && (
        <div className="text-center">
          <small className="warn-text">
            Something went wrong! Try again later.
          </small>
        </div>
      )}

      <MetaTagsGenerator
        metaTags={{
          title: `${username} | Khul ke`,
          description: `${username}, khul ke, social media platform`,
          keywords: `profiles, networks, notification`,
          image: `${POST_API_BASE_URL}/profile-photo/${username}/pp`,
        }}
      />

      {!p_loading && !p_error && (
        <>
          <div className="headiheadi">
            {/* seo stuff */}
            {/* ------------------- */}
            <section className="containerstick">
              <h1 id="page-title" style={{ display: "none" }}>
                {`${username} -Khul Ke - Connect With Your Network`}
              </h1>

              <div className="leftck">
                <img
                  style={{ display: "inline-block", marginTop: "0.1rem" }}
                  src={Back}
                  alt="back button"
                  onClick={() => {
                    navigate(-1);
                  }}
                />
                <Title className="usernBesidesArrow">
                  {blockUser === true ? (
                    allWords.profile.pageTitle
                  ) : (
                    <>
                      {yesOut ? (
                        allWords.profile.pageTitle
                      ) : (
                        <div style={{ display: "flex" }}>
                          {`@${user_name}`}
                          <VIPComp user_type={userType} />
                        </div>
                      )}
                    </>
                  )}
                </Title>
              </div>

              {window.location.pathname.split("/")[1] === "profile" && (
                <>
                  <button
                    id="share_button"
                    onClick={shareProfile}
                    className="sharebtnn"
                    hidden={blockUser}
                  >
                    <img src={shareInProfile} alt="" />
                  </button>
                </>
              )}
            </section>
          </div>

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
                    ToastHandler("warn", "Upload an image less than 15 MB.");
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
          {blockUser === true ? (
            <div className="text-center">
              <small className="warn-text">
                User with username {username} is blocked.
              </small>
            </div>
          ) : (
            <section className="newBottom">
              <div className="imgNStats">
                {loadingimg ? (
                  <Spinner />
                ) : (
                  <UserProfile
                    username={username}
                    className="profileImg"
                    onClick={editDP}
                    size="large"
                  />
                )}
                {/* user stats */}
                <div className="divForStatsTop">
                  {blockUser === true ? (
                    <>
                      <div className="text-center warn-text"></div>
                    </>
                  ) : (
                    <>
                      {follow && (
                        <div style={{ display: "flex" }}>
                          <div
                            className="statparent"
                            onClick={() => {
                              if (
                                !localStorage.current_user &&
                                localStorage.anonymous_user
                              )
                                return setProfilehOpen(true);
                              navigate(`/profile/${username}/followings`);
                            }}
                          >
                            <FollowerDiv>
                              <FollowerTag to="#">
                                {" "}
                                {allWords.profile.btnFollowing}
                              </FollowerTag>
                              <FollowerCount>{following}</FollowerCount>
                            </FollowerDiv>
                          </div>
                          <div
                            className="statparent"
                            onClick={() => {
                              if (
                                !localStorage.current_user &&
                                localStorage.anonymous_user
                              )
                                return setProfilehOpen(true);
                              navigate(`/profile/${username}/followers`);
                            }}
                          >
                            <FollowerDiv>
                              <FollowerTag to="#">
                                {allWords.profile.btnFollowers}
                              </FollowerTag>
                              <FollowerCount>{followers}</FollowerCount>
                            </FollowerDiv>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {/* modal that opens when clicked on image thumbnail */}
                <FullScreenDialog open={imgOpen} setOpen={setImgOpen}>
                  <UserProfile
                    username={username}
                    alt="profile"
                    id="img01"
                    width="auto"
                    height="40vh"
                    className="modal-content mcImg"
                    size="large"
                  />
                </FullScreenDialog>
              </div>
              <div className="newDataDiv">
                <div className="divNamenBtn">
                  <div className="nameDiv3">
                    <p className="nameIn3">{name}</p>
                    <div className="usernamenVip">
                      <p className="usernameIn3" ref={myStickyRef}>
                        @{user_name}
                      </p>
                      <VIPComp user_type={userType} />
                    </div>
                  </div>

                  {edit_btn &&
                    username ===
                      JSON.parse(
                        localStorage.current_user || localStorage.anonymous_user
                      )["username"] &&
                    window.location.pathname !== "/personal_details" && (
                      <EditBtn onClick={() => navigate("/personal_details")}>
                        {allWords.profile.btnEdit}
                      </EditBtn>
                    )}

                  {blockUser === true ? (
                    ""
                  ) : (
                    <>
                      {follow_btn &&
                        username !==
                          JSON.parse(
                            localStorage.current_user ||
                              localStorage.anonymous_user
                          )["username"] && (
                          <button
                            style={{
                              fontSize: "0.9rem",
                              padding: "0rem 0.8rem",
                              height: "35px",
                              marginTop: "0",
                            }}
                            className={
                              is_following
                                ? `following-button-small`
                                : `follow-button-small`
                            }
                            ref={follows}
                            onClick={() => {
                              if (
                                !localStorage.current_user &&
                                localStorage.anonymous_user
                              )
                                return setProfilehOpen(true);
                              follow_unfollow_driver(username, is_following);
                            }}
                          >
                            {is_following
                              ? `Following`
                              : allWords.misc.livert.follow}
                          </button>
                        )}
                    </>
                  )}
                </div>
              </div>
              <div className="dataDivbelow">
                {(!bio?.trim() &&
                  !location &&
                  !dob &&
                  !web &&
                  !!subCategoryName) || (username !== user_name) && (
                    <div className="nodataGifDiv">
                      <lottie-player
                        src={globalImages.si_pr_incomplete}
                        background="transparent"
                        speed="1"
                        style={{
                          width: "300px",
                        }}
                        loop
                        autoplay
                      />
                    </div>
                  )}
                <div className="biol">
                  <p className="bioP">{bio}</p>
                </div>
                <div
                  hidden={
                    user_name ===
                    JSON.parse(
                      localStorage.current_user || localStorage.anonymous_user
                    )?.["username"]
                      ? false
                      : privacy_settings?.includes("location_radio")
                      ? false
                      : true
                  }
                >
                  {location && <img alt="" src={locationIcon} />}
                  <small style={{ marginLeft: "8px" }}>{location}</small>
                </div>
                <div
                  className="dobDiv"
                  hidden={
                    user_name ===
                    JSON.parse(
                      localStorage.current_user || localStorage.anonymous_user
                    )?.["username"]
                      ? false
                      : privacy_settings?.includes("dob")
                      ? false
                      : true
                  }
                >
                  {dob && <img alt="" src={cake} />}
                  {dob &&
                    dob.length > 1 &&
                    moment(dob).format("DD-MM-YY") !== "Invalid date" && (
                      <small style={{ marginLeft: "8px" }}>
                        {moment(dob).format("DD-MMM-YYYY")}
                      </small>
                    )}
                </div>
                <>
                  <div
                    className="websiteDiv"
                    dangerouslySetInnerHTML={{
                      __html: replaceURLs(web),
                    }}
                    hidden={
                      user_name ===
                      JSON.parse(
                        localStorage.current_user || localStorage.anonymous_user
                      )?.["username"]
                        ? false
                        : privacy_settings?.includes("website_radio")
                        ? false
                        : true
                    }
                  />
                </>
                <div
                  className="interestNwDiv"
                  hidden={
                    user_name ===
                    JSON.parse(
                      localStorage.current_user || localStorage.anonymous_user
                    )?.["username"]
                      ? false
                      : privacy_settings?.includes("interest_radio")
                      ? false
                      : true
                  }
                >
                  {subCategoryName?.map((i, v) => (
                    v== subCategoryName.length - 1 ?
                    <small key={i}>{`#${i}`} &nbsp;</small> :
                    <small key={i}>{`#${i}`}, &nbsp;</small>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* new design ends here */}
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
        <Paper
          elevation={4}
          style={{
            backgroundColor: "white",
            padding: "20px",
            minWidth: "600px",
            maxWidth: "1000px",
          }}
        >
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
                Save
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

      <PreloginComp
        modalOpen={profilehOpen}
        setModalOpen={setProfilehOpen}
        icon={
          <PersonIcon style={{ color: "#66B984" }} width={40} height={40} />
        }
        title={"For follow, Login or sign up to Khul Ke"}
        description={""}
      />
    </>
  );
};

export default ProfileHeader;
