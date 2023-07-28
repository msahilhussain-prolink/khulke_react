import { Cross, Div, LeftSideBarDiv } from "./style";
import ListItem from "./ListItem";
import { globalImages } from "../../assets/imagesPath/images";
import { useDispatch } from "react-redux";
import CloseIcon from "../../assets/icons/close_icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../global_styles/style";
import { allWords } from "../../App";
import Meet from "../../assets/icons/meet.svg";
import { AddCircle, Notifications } from "@material-ui/icons";
import Button from "../common/Button";
import SuggestedToYou from "./SuggestedToYou";
import UserCard from "./UserCard";
import YappSideBar from "./YappSideBar";
import { getPostData } from "../../redux/actions/postAction";


const CommonLeftbarItem = ({condition, 
    isNotItemTtitle,handleClose,setExpanded,
    rtInvite,rt_count, setRTCount,
     current_user,
     notification_count,
     setNotificationCount,
     expanded,
     windowWidth,
     setModalOpen,
     hasClickedNotification,
     setAddPost
     }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = window.location.pathname;


    return (
        <LeftSideBarDiv
        id="leftSide_div"
        style={{
          overflowY: "auto",
        }}
      >
        <div>
          <div style={{position: "relative"}} className="head-icon khulkeLogoHome">
            <div
              style={{
                display: "flex",
                justifyContent: (windowWidth < 969 || condition) ? "flex-end" : "flex-start",
              }}
            >
              <Link to={"/home"}>
                <Logo
                  className="logo-khulke-img"
                  src={globalImages.logo}
                  style={{ marginTop: "1rem" }}
                />
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent:  "flex-end",
                position: "absolute",
                right: "0",
              }}
            >
              {
              //TODO work on second part of RTListing
            }
            {/* {isNotItemTtitle &&
              <IconButton onClick= {() => setExpanded(false)}>
              <ArrowBackIosIcon  sx={{width: 42, height: 42, color: "black"}}/>
              </IconButton>
    } */}
    </div>
            <div>
              <Cross src={CloseIcon} onClick={handleClose} />
            </div>
          </div>
          {location.split("/")[1] === "yapp" ? (
            <YappSideBar
              username={current_user?.["username"]}
              setModalOpen={setModalOpen}
              hasClickedNotification={hasClickedNotification}
              notification_count={notification_count}
              rtInvite={rtInvite}
            />):
          <Div style={{ marginTop: ".563rem" }}>
            {location === "/home" || location === "/" ? (
              <ListItem
                selected
                title={isNotItemTtitle ? "" : allWords.th.townhall}
                Icon={globalImages.si_th_menu_a}
                path={"/home"}
                onClick={() => {
                  dispatch(getPostData(20));
                  navigate("/home");
                }}
                className="townhallStep"
              />
            ) : (
              <ListItem
                title={isNotItemTtitle ? "" : allWords.th.townhall}
                Icon={globalImages.si_th_menu}
                path={"/home"}
                onClick={() => {
                  dispatch(getPostData(20));
                  navigate("/home");
                }}
              />
            )}

            {location.split("/")[1] === "roundtable" ? (
              <ListItem
                selected
                title={isNotItemTtitle ? "" : allWords.th.rt}
                notifications={
                  rt_count !== 0 ? rt_count : ""
                }
                setNotificationCount={setRTCount}
                Icon={globalImages.si_rt_menu_a}
                path={"/roundtable/all"}
                onClick={rtInvite}
              />
            ) : (
              <ListItem
                title={isNotItemTtitle ? "" : allWords.th.rt}
                notifications={
                  rt_count !== 0 ? rt_count : ""
                }
                setNotificationCount={setRTCount}
                Icon={globalImages.si_rt_menu}
                path={"/roundtable/all"}
                className="roundtableStep"
                onClick={rtInvite}
              />
            )}

            {!window.location.origin.includes("stage") && (
              <ListItem
                selected={
                  window.location.pathname.includes("meet") ? true : false
                }
                title={isNotItemTtitle ? "" : allWords.th.meet}
                Icon={Meet}
                onClick={() => {
                  if (!localStorage.current_user && localStorage.anonymous_user)
                    return setModalOpen(true);

                  if (windowWidth <= 768 || condition)
                    return (window.location.href = `https://meet.khulke.com?token=${localStorage.access}`);
                  else
                    return window.open(
                      `https://meet.khulke.com?token=${localStorage.access}`
                    );
                }}
              />
            )}
            {localStorage.current_user && !localStorage.anonymous_user && (
              <>
                {location.split("/")[1] === "yapp" ? (
                  <ListItem
                    selected
                    title={isNotItemTtitle ? "" :allWords.th.yapp}
                    Icon={globalImages.si_yapp_menu_a}
                    path={"/yapp"}
                    onClick={() => {
                      navigate("/yapp");
                    }}
                  />
                ) : (
                  <ListItem
                    title={isNotItemTtitle ? "" :allWords.th.yapp}
                    Icon={globalImages.si_yapp_menu}
                    path={"/yapp"}
                    className="yappStep"
                    onClick={() => {
                      navigate("/yapp");
                    }}
                  />
                )}
              </>
            )}

            {localStorage.current_user && !localStorage.anonymous_user && (
              <>
                <ListItem
                  comp
                  Icon={Notifications}
                  title={isNotItemTtitle ? "" : allWords.th.noti}
                  path={"/notifications/interaction"}
                  notifications={
                    notification_count !== 0 ? notification_count : ""
                  }
                  setNotificationCount={setNotificationCount}
                  style={{ color: "#63779c" }}
                  onClick={() => {
                    navigate("/notifications/interaction");
                    localStorage.setItem(
                      "current_user",
                      JSON.stringify({
                        ...hasClickedNotification,
                        clicked_notification: true,
                        notification_count: notification_count,
                      })
                    );
                  }}
                />
                {/* )} */}
              </>
            )}

            {localStorage.current_user && !localStorage.anonymous_user && (
              <>
                {location.split("/")[1] === "profile" ? (
                  <ListItem
                    selected
                    title={isNotItemTtitle ? "" : allWords.th.profile}
                    username={current_user?.["username"]}
                    Icon
                    path={`/profile/${current_user?.["username"]}`}
                    txt="profile"
                    onClick={() => {
                      navigate(`/profile/${current_user?.["username"]}`);
                    }}
                  />
                ) : (
                  <ListItem
                    title={isNotItemTtitle ? "" : allWords.th.profile}
                    username={current_user?.["username"]}
                    Icon
                    path={`/profile/${current_user?.["username"]}`}
                    txt="profile"
                    onClick={() => {
                      navigate(`/profile/${current_user?.["username"]}`);
                    }}
                  />
                )}
              </>
            )}
          </Div>
     }
          <div
            className="newPostStep"
            style={{
              marginTop: (windowWidth <= 968 || condition) && !expanded ? "0" : "1.5rem",
              display: (windowWidth <= 968 || condition) ? "flex" : "",
              justifyContent: (windowWidth <= 968 || condition) ? "center" : "",
            }}
          >
            {((windowWidth <= 968 || condition) && !expanded ||
            location.split("/")[1] === "yapp") ?
             (
              <div
                style={{
                  cursor: "pointer",
                  marginLeft:
                  location.split("/")[1] === "yapp" ? "22px" : "-10px",
                }}
              >
                <AddCircle
                  onClick={() => setAddPost(true)}
                  size={30}
                  style={{
                    fontSize:
                      location.split("/")[1] === "yapp" ? "2rem" : "1.5rem",
                  }}
                  color="#66B984"
                  className="mt-3"
                />
              </div>
            ) : (
              <Button
                onClick={() => {
                  setAddPost(true);
                }}
                style={{
                  width: "100%",
                  minWidth: "0px",
                  transition: "all 80ms linear",
                }}
              >
                {allWords.th.newpost}
              </Button>
            )}
          </div>
          {
              //TODO work on second part of RTListing
            }
          {/* {!expanded &&
              <IconButton onClick= {() => setExpanded(true)}>
              <ArrowForwardIosIcon  sx={{width: 42, height: 42}}/>
              </IconButton>
    } */}
          {!localStorage.current_user && localStorage.anonymous_user && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  margin: "30px 0px 10px 0px",
                  font: "normal normal bold 16px/19px Work Sans",
                }}
              >
                {allWords.th.loginCTA}
              </p>
              <Button
                onClick={() => {
                  navigate("/login");
                }}
                variant={"contained"}
                style={{
                  padding: "10px 30px",
                  backgroundColor: "#66b984",
                  width: "100%",
                }}
              >
                {allWords.th.loginBtn}
              </Button>
            </div>
          )}
          {((windowWidth > 968 ) && location.split("/")[1] !== "yapp") && <SuggestedToYou />}
        </div>

        {localStorage.current_user && !localStorage.anonymous_user &&
          location.split("/")[1] !== "yapp" &&
         (
          <UserCard windowWidth={windowWidth} />
        )}
      </LeftSideBarDiv>
    )
}

export default  CommonLeftbarItem;