import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// Components
import Header from "../../components/Header";
import PreloginComp from "../../components/PreLoginComp";
import RightSideBar from "../../components/RightSideBar";
import Spinner from "../../components/Spinner";
// assets/styles
// import { Typography } from "@mui/material";
import "react-placeholder/lib/reactPlaceholder.css";
import NetworkSvg from "../../assets/icons/network.svg";
import "../../components/PopularUI/style.css";
import { MainDiv } from "../../global_styles/global_style";
import { CenterDiv, RightDiv, Title } from "./style";

import { ShepherdTourContext } from "react-shepherd";
import PreLoginFooter from "../../components/PreLoginFooter";
import SuccessDialog from "../../components/SuccessDialog";
import { metaData } from "../../constants/StaticPagesMetaTags";
import { MOBILE_VIEW } from "../../constants/env";
import { drawerFlag, toggleFlag } from "../../redux/actions/compActions";
import { userProfileData } from "../../redux/actions/profileAction/userProfileAction";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
// import TownHallIconActive from "../../assets/icons/home_icon_active.svg";
import { globalImages } from "../../assets/imagesPath/images";
import { moengageEvent } from "../../utils/utils";
import CenterHome from "./CenterHome";
import News from "./News";
import NewsParent from "./NewsParent";
import Tabs from "./Tabs";
import "./style.css";

// lang
import { allWords } from "../../App";

const Home = () => {
  // variables
  const navigate = useNavigate();
  const ref = React.useRef();
  const dispatch = useDispatch();

  const hideFlag = useSelector((state) => state.compRed.flag);
  const tabFlag = useSelector((state) => state.tabSwitchRed.tabFlag);
  const open = useSelector((state) => state.drawerSwitchRed.drawFlag);
  let current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  const tour = useContext(ShepherdTourContext);
  const userData = useSelector((state) => state.user_profile.data);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    moengageEvent("View Page", "ALL", {
      URL: `${window.location.origin}/${window.location.pathname}`,
    });
  }, []);

  useEffect(() => {
    if (tour?.isActive) {
      setActiveTab(tabFlag);
    }
  }, [tabFlag]);
  useEffect(() => {
    if (localStorage.getItem("is_new")) {
      localStorage.removeItem("is_new");
    }

    dispatch(userProfileData({ username: current_user?.["username"] }));

    setIsLoaded(true);
  }, []);

  const [uData, setUData] = useState([]);
  const [userDialog, setUserDialog] = useState({
    flag: 1,
    data: [],
    updated: false,
  });
  const [successDialog, setSuccessDialog] = useState(false);

  useEffect(() => {
    if (userData && userData?.status === 200) {
      if (
        userData?.["data"]?.["self_user"]?.["product_walkthrough"]?.[
          "is_interested"
        ] === true
      ) {
        dispatch(toggleFlag(true));
      } else if (
        userData?.["data"]?.["self_user"]?.["product_walkthrough"]?.[
          "is_interested"
        ] === false
      ) {
        dispatch(toggleFlag(false));
      }
      setUData(userData?.["data"]?.["self_user"]?.["product_walkthrough"]);
      setUserDialog({
        flag: userData?.["data"]?.["user_other"]?.["username_updated"]
          ? 1
          : current_user?.hasChangedUsername
          ? 1
          : 0,
        data: userData?.["data"]?.["user_other"],
        updated: false,
      });
    }
  }, [userData]);

  const [allPostData, setAllPostData] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState({ message: "", val: false });
  const updatedPostData = useSelector((state) => state.post.posts);
  const circulateData = useSelector((state) => state.post.circulateData);
  // const limit = 20;
  const [skip, setSkip] = useState(0);

  const [callingApi, setCallingApi] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [activeTab, setActiveTab] = useState("news");

  const [day_duration, setDayDuration] = useState("");
  const [hour_duration, setHourDuration] = useState("");

  useEffect(()=>{
    let activeItem = localStorage.getItem("activeTab")
    if(activeItem == null) {
      localStorage.setItem("activeTab","news")
      setActiveTab("news")
    }else if (["khabrikekhabre","BKK"].includes(activeItem)) {
      setActiveTab("news");
    }else {
      setActiveTab(activeItem)
    }
  },[])

  return (
    <>
      <MetaTagsGenerator metaTags={metaData["home"]} />
      <Header />
      <MainDiv>
        <CenterDiv
          id="home_center"
          // onScroll={handleScroll}
          // style={{ paddingLeft: 0, overflowX: "hidden" }}
        >
          <div
            className="contHeadkk"
            style={{
              // border: "1px solid green",
              position: "sticky",
              top: "-2px",
              // height: !localStorage.anonymous_user ? "0" : "110px"
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                // paddingBottom: "10px",
                zIndex: "20",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title ref={ref}>{allWords.th.townhall}</Title>
              <div className="d-flex">
                {localStorage.current_user && !localStorage.anonymous_user && (
                  <lottie-player
                    src="https://assets7.lottiefiles.com/packages/lf20_iPQINbCsKE.json"
                    background="transparent"
                    speed="1"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      visibility: hideFlag === false ? "hidden" : "visible",
                    }}
                    loop
                    autoplay
                    onClick={() => {
                      dispatch(
                        userProfileData({
                          username: current_user?.["username"],
                        })
                      );
                      if (uData?.["walkthrough_step"] <= 6) {
                        tour?.show(uData?.["walkthrough_step"], true);
                        if (MOBILE_VIEW) {
                          if (uData?.["walkthrough_step"] === 1)
                            return dispatch(drawerFlag(!open));
                        }
                      } else {
                        navigate("/roundtable/all?shtc=tc");
                      }
                    }}
                  />
                )}
                <div className="snippetStep">
                  <button
                    className="SnippetButton"
                    onClick={() => {
                      navigate("/snip-it");
                    }}
                  >
                    {/* <OndemandVideoOutlined
                      size={25}
                      color="#fff"
                      style={{ marginRight: "0.5rem" }}
                    /> */}
                    <img
                      src={globalImages.si_snip_menu}
                      alt="snip-it icon"
                      color="white"
                    />
                    <span className="snip-it-text">{allWords.th.snipit}</span>
                  </button>
                </div>
              </div>
            </div>

            <hr style={{ border: "1px solid #EEE", margin: "3px 0" }} />
            {localStorage.current_user && !localStorage.anonymous_user && (
              <>
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setAnonymous={setAnonymous}
                />
              </>
            )}
          </div>

          <div className="popPost" style={{ marginTop: "-2px" }}>
            {activeTab === "news" ? (
              localStorage.current_user && !localStorage.anonymous_user ? (
                <News />
              ) : (
                <NewsParent
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setAnonymous={setAnonymous}
                />
              )
            ) : (
              <CenterHome
                day_duration={day_duration}
                hour_duration={hour_duration}
                setDayDuration={setDayDuration}
                setHourDuration={setHourDuration}
              />
            )}
            {callingApi && <Spinner />}
            {postError.val && !callingApi && <img src={NetworkSvg} alt="" />}
            {/* </ReactPlaceholder> */}
          </div>
        </CenterDiv>

        <RightDiv>
          <RightSideBar />
        </RightDiv>
      </MainDiv>

      <PreloginComp
        modalOpen={anonymous}
        setModalOpen={setAnonymous}
        icon={
          <img src={globalImages.si_rt_menu_a} alt="" width={40} height={40} />
        }
        title={allWords.misc.pages.prelog}
        description={""}
      />

      {!localStorage.current_user && localStorage.anonymous_user && (
        <PreLoginFooter />
      )}

      <SuccessDialog
        open={successDialog}
        setOpen={setSuccessDialog}
        msg={allWords.misc.pages.proupdated}
        fromHome={true}
      />
    </>
  );
};

export default Home;
