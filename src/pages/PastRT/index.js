import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getRTSingleData,
  getRTSingleReset,
} from "../../redux/actions/roundtableAction/single_roundtable";

// Material UI
import { Box } from "@mui/material";

// Constants
import {
  IS_ANDROID_OR_IOS,
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../../constants/env";

// Components
import RecommendedRT from "../../components/RecommendedRT";
import CustomizedSnackbars from "../../components/Snackbar.component";
import Spinner from "../../components/Spinner";
import PastCenter from "./PastCenter";
import PastHeader from "./PastHeader";

// Utils
import logger from "../../logger";
import { db } from "../../push_firebase";
import ReadMoreReadLess from "../../utils/ReadMoreReadLess";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";
import { VideoSchema } from "../../utils/VideoSchema";
import ThumbnailImage from "../../components/ThumbnailImage";

export default function PastRT() {
  let current_user = null;
  current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  // Const
  const dispatch = useDispatch();
  // const { id: rt_id } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();

  // Global State
  const single_rt_data = useSelector((state) => state.single_rt.data);
  const single_rt_error = useSelector((state) => state.single_rt.error);
  const single_rt_loading = useSelector((state) => state.single_rt.loading);
  const rtAction = useSelector((state) => state.rtActionRed.data);

  //   Local State
  const [loading, setLoading] = useState(true);
  const [rt_data, setRTData] = useState([]);
  const [rt_id, setRTID] = useState("");
  const [videoTimer, setVideoTimer] = useState("");
  const [ownRecommendData, setOwnRecommendData] = useState([]);
  const [modRecommendData, setModRecommendData] = useState([]);
  const [hideSection, setHideSection] = useState(false);
  const [hideFull, setHideFull] = useState(false);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [removeAction, setRemoveAction] = useState(0);
  const [open, setOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [interactionData, setInteractionData] = useState([]);
  const [btnDisable, setBtnDisable] = useState(false);
  const [shareProgress, setShareProgress] = useState(false);

  const videoElem = useRef();
  const audioElem = useRef();

  useEffect(() => {
    setRTID(loc.pathname.split("/")[3]);
  }, [loc]);

  useEffect(() => {
    if (rt_id !== "") {
      // Used for audience interaction posts.
      db.collection("roundtable")
        .doc(rt_id)
        .collection("messages")
        .orderBy("created_at", "desc")
        .onSnapshot((snapshot) => {
          let userInteractionPost = [];
          snapshot.forEach((doc) => {
            userInteractionPost.push(doc.data());
          });
          setInteractionData(userInteractionPost);
        });

      // For getting particular rt data
      dispatch(
        getRTSingleData({
          rt_id: rt_id,
          token:
            localStorage.access ||
            JSON.parse(localStorage.anonymous_user).token,
        })
      );

      // For recommended rt
      recommendRT();

      // For like/dislike count
      if (localStorage?.current_user && !localStorage?.anonymous_user) {
        getLikeDislikeCount();
      }
    }
  }, [rt_id]);

  useEffect(() => {
    // If rt is deleted, we will get 252/253 and redirect it to the rt/all page => Show toast msg
    if (single_rt_data && single_rt_data?.status === 200) {
      setRTData(single_rt_data?.data);
      setLoading(false);
      setBtnDisable(false);
    }

    if (single_rt_loading) {
      setLoading(true);
      setBtnDisable(true); // To keep like/dislike disable untill all rt data loads
    }

    if (single_rt_error) {
      navigate("/roundtable/all");
    }
  }, [rt_id, single_rt_data, single_rt_error]);

  useEffect(() => {
    if (shareProgress) {
      if (rtAction && rtAction?.data?.status == 200) {
        setShareProgress(false);
        setRedirectUrl(rtAction?.data?.data?.[0]?.url);
      }
    }
  }, [rtAction]);

  const callDeepLink = async () => {
    dispatch(rtActionData({ rt_id: rt_id, action: "SHARE" }));
    setShareProgress(true);
  };

  useEffect(() => {
    if (IS_ANDROID_OR_IOS && redirectUrl === "") {
      callDeepLink();
    }

    return () => {
      dispatch(getRTSingleReset());
    };
  }, []);

  function recommendRT() {
    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));
    var config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/${
        anonymous_user ? "anonymous/" : ""
      }recommended-rt/${rt_id}`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
      },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setOwnRecommendData(response?.data?.data?.[0]?.["owner"]);
          setModRecommendData(response?.data?.data?.[0]?.["moderator"]);
        }
      })
      .catch(function (error) {
        logger.error(error);
      });
  }

  function getLikeDislikeCount() {
    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));

    var config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/${
        anonymous_user ? "anonymous/" : ""
      }check-rt-liked-disliked/${rt_id}`,
      headers: {
        Authorization: `Bearer ${
          !anonymous_user ? localStorage.access : anonymous_user["token"]
        }`,
      },
    };

    setBtnDisable(true);
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setBtnDisable(false);
          if (response?.data?.data?.[0]?.like === 1) {
            setLike(true);
            setRemoveAction(1);
          } else if (response?.data?.data?.[0]?.dislike === 1) {
            setDislike(true);
            setRemoveAction(1);
          } else if (
            response?.data?.data?.[0]?.like === 0 &&
            response?.data?.data?.[0]?.dislike === 0
          ) {
            setLike(false);
            setDislike(false);
            setRemoveAction(0);
          }
        }
      })
      .catch();
  }

  return (
    <>
      {loading === true ? (
        <Spinner />
      ) : (
        <Box style={{ width: "100%" }}>
          {open && (
            <CustomizedSnackbars
              open={open}
              handleClose={() => {
                setOpen(false);
              }}
              redirectUrl={redirectUrl}
            />
          )}
          {rt_data.length && (
            <>
              <MetaTagsGenerator
                metaTags={{
                  title: `${rt_data[0]?.metadata?.og_title}`,
                  description: `${rt_data[0]?.metadata?.description}`,
                  keywords: `${rt_data[0]?.metadata?.keywords?.join("")}`,
                }}
              />
              <VideoSchema
                name={`"${rt_data[0]?.metadata?.title}"`}
                contentUrl={`"${window.location.origin}/roundtable/recorded/${rt_id}"`}
                description={`"${rt_data[0]?.metadata?.description}"`}
                duration={videoTimer}
                thumbnailURL={`"${ThumbnailImage(rt_data[0])}"`}
                uploadDate={`"${rt_data[0]?.start}"`}
              />
            </>
          )}
          <div>
            <PastHeader
              rt_id={rt_data?.[0]?.["_id"]}
              title={rt_data?.[0]?.name}
              videoTime={videoTimer}
              viewer_count={rt_data?.[0]?.join_count}
              other_count={rt_data?.[0]?.other_count}
              navigate={navigate}
              hideFull={hideFull}
              start={rt_data?.[0]?.["start"]}
              r_type={rt_data?.[0]?.["r_type"]}
              rt_nature={rt_data?.[0]?.["open_to_all"]}
              setRTData={setRTData}
              audioElem={audioElem}
              videoElem={videoElem}
              redirectUrl={redirectUrl}
            />

            <PastCenter
              rt_data={rt_data}
              rt_id={rt_data?.[0]?.["_id"]}
              current_user={current_user}
              ownerUsername={rt_data?.[0]?.["owner"]?.["username"]}
              setVideoTimer={setVideoTimer}
              setLoading={setLoading}
              recommendData={ownRecommendData}
              hideSection={hideSection}
              setHideSection={setHideSection}
              hideFull={hideFull}
              setHideFull={setHideFull}
              like={like}
              setLike={setLike}
              dislike={dislike}
              setDislike={setDislike}
              removeAction={removeAction}
              cover_img={
                rt_data?.[0]?.media?.length > 0 &&
                `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${rt_data?.[0]?.owner?.user_id}/roundtable/${rt_data?.[0]?.["_id"]}/profile/${rt_data?.[0]?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
              }
              interactionData={interactionData}
              getLikeDislikeCount={getLikeDislikeCount}
              btnDisable={btnDisable}
              setBtnDisable={setBtnDisable}
              audioElem={audioElem}
              videoElem={videoElem}
            />
          </div>

          {window.screen.width >= 1200 && (
            <div
              className="rmrl"
              hidden={
                true
                // rt_data?.[0]?.["description"]?.length === 0 ? true : false
              }
            >
              <br />
              <div
                style={{
                  backgroundColor: "#E4E9F0",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <ReadMoreReadLess
                  children={rt_data?.[0]?.["description"]}
                  txtSlice={80}
                  txtLength={72}
                  txtColorM="#66B984"
                  txtColorL="#66B984"
                  label="rt"
                />
              </div>
              <br />
            </div>
          )}

          {hideFull === false && hideSection === false && (
            <>
              <hr
                className="hrMobile"
                hidden={hideSection}
                style={{ marginTop: "2.5rem" }}
              />
            </>
          )}
          <div className="recommend-rt-parent">
            <RecommendedRT
              label="owner"
              recommendData={ownRecommendData}
              hideSection={hideSection}
              hideFull={hideFull}
            />

            {modRecommendData?.length > 0 && (
              <RecommendedRT
                label="moderator"
                recommendData={modRecommendData}
                hideSection={hideSection}
                hideFull={hideFull}
              />
            )}
          </div>
        </Box>
      )}
    </>
  );
}
