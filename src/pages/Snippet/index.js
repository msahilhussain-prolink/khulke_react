import { AddCircleOutline } from "@material-ui/icons";
import { ArrowCircleDown, ArrowCircleUp } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getSnippets } from "../../apis/snippetApi.js";
import { allWords } from "../../App";
import BackWhite from "../../assets/icons/backWhite.svg";
import RoundTableIconActive from "../../assets/icons/RoundTable_icon_active.svg";
import SearchInput from "../../components/common/SearchInput";
import Header from "../../components/Header";
import AddPostDialog from "../../components/Post/AddPostDialog";
import DiscardDialog from "../../components/Post/AddPostDialog/DiscardDialog";
import PreloginComp from "../../components/PreLoginComp";
import SnippetComponent from "../../components/Snippet";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";
import ToastHandler from "../../utils/ToastHandler";
import { moengageEvent } from "../../utils/utils";
import "./style.css";

const SnippetPage = () => {
  const [addPost, setAddPost] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [discard, setDiscard] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [msgFlag, setMsgFlag] = useState({ title: "", flag: false });
  const [muted, setMuted] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [initialY, setInitialY] = useState();
  const parentRef = useRef(null);
  const addPostLoading = useSelector((state) => state.post.loading);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (!localStorage.getItem("khulke_recents")) {
        localStorage.setItem(
          "khulke_recents",
          JSON.stringify([e.target.value])
        );
      } else {
        let recents = JSON.parse(localStorage.getItem("khulke_recents"));
        recents.push(e.target.value);
        localStorage.setItem("khulke_recents", JSON.stringify(recents));
      }
      let current = JSON.parse(
        localStorage.current_user || localStorage.anonymous_user
      );
      moengageEvent("Search", "Snip-It", { "Search Text": e.target.value });

      window.location.replace(`/search?search_term=${e.target.value.trim()}`);
    }
  };

  const handleAddPost = (flag) => {
    if (!flag && addPostLoading) {
      ToastHandler("warn", allWords.misc.toastMsg.postUploadingWait);
    }
    setAddPost(flag);
  };

  const getAllSnippets = async (val, postId) => {
    if (val === 0) {
      return await getSnippets(val, postId)
        .then((res) => setSnippets([...res.data.data]))
        .catch((err) => err);
    }
    await getSnippets(val)
      .then((res) => setSnippets([...snippets, ...res.data.data]))
      .catch((err) => err);
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
    if (bottom) {
      getAllSnippets(snippets.length);
    }
  };

  const handleSnippetScroll = (direction) => {
    if (isScrolling) return;

    setIsScrolling(true);
    const container = parentRef.current;
    if (direction === "up") {
      container.scrollBy({
        top: -container.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    } else if (direction === "down") {
      container.scrollBy({
        top: container.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    }
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  const handleTouchStart = (event) => {
    setInitialY(event.touches[0].clientY);
  };

  const handleTouchMove = (event) => {
    const currentY = event.touches[0].clientY;
    if (initialY == currentY || !initialY) return;

    if (initialY < currentY) {
      setSwipeDirection("up");
    } else {
      setSwipeDirection("down");
    }
  };

  const handleTouchEnd = (event) => {
    handleSnippetScroll(swipeDirection);
    setInitialY(null);
  };

  useEffect(() => {
    if (location?.state?.postId !== undefined) {
      getAllSnippets(0, location?.state?.postId);
    } else {
      getAllSnippets(0);
    }

    moengageEvent("View Page", "ALL", {
      URL: `${window.location.origin}/${window.location.pathname}`,
    });
  }, []);

  const selector = useSelector((state) => state.post);

  useEffect(() => {
    if (location?.state?.postId !== undefined) {
      getAllSnippets(0, location?.state?.postId);
    } else {
      getAllSnippets(0);
    }
  }, [selector?.loading]);

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          width: "100%",
        }}
        className="snippageCont"
      >
        <div
          style={{
            height: "100vh",
            overflowY: "auto",
            position: "relative",
            maxWidth: "1118px",
            width: "100%",
          }}
        >
          <div className="headerSnippet">
            <div className="headerSnippetRightCol">
              <div style={{ display: "flex" }}>
                <img
                  onClick={() => navigate("/home")}
                  alt=""
                  src={BackWhite}
                  style={{ marginRight: "5px", marginTop: "-4px" }}
                  className="backArrowTop"
                />{" "}
                <h2 className="headText">{allWords.th.snipit}</h2>
              </div>
            </div>
            <div className="headerSnippetLeftCol">
              <button
                className="addBtn"
                onClick={() => {
                  if (!localStorage.current_user && localStorage.anonymous_user)
                    return setAnonymous(true);

                  setAddPost(true);
                  setMsgFlag({ title: "", flag: false });
                }}
              >
                <AddCircleOutline />
                <span className="addBtnText">{allWords.snip.btnadd}</span>
              </button>
              <div className="searchBarSnip">
                <SearchInput
                  className="snippetSearch"
                  onKeyDown={(e) => {
                    handleSearch(e);
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              right: "3rem",
              top: "calc(10vh + 10px)",
            }}
            className="topBtnn"
            disabled={isScrolling}
            onClick={() => handleSnippetScroll("up")}
            hidden={
              !localStorage.current_user && localStorage.anonymous_user
                ? true
                : false
            }
          >
            <ArrowCircleUp color="#ccc" size="35" />
          </div>
          <div
            style={{
              position: "absolute",
              right: "3rem",
              bottom: "10px",
            }}
            className="bottomBtnn"
            onClick={() => handleSnippetScroll("down")}
            disabled={isScrolling}
            hidden={
              !localStorage.current_user && localStorage.anonymous_user
                ? true
                : false
            }
          >
            <ArrowCircleDown color="#ccc" size="35" />
          </div>

          <div
            onScroll={handleScroll}
            style={{
              overflowY: "hidden",
            }}
            ref={parentRef}
            onWheel={(e) => {
              if (e.deltaY > 0) {
                handleSnippetScroll("down");
              } else if (e.deltaY < 0) {
                handleSnippetScroll("up");
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            className="centerPuttingHeight"
          >
            {snippets.length > 0
              ? snippets.map((el, ind) => (
                  <>
                    <SnippetComponent
                      key={el?._id}
                      isLiked={el?.like_self}
                      isDisliked={el?.dislike_self}
                      hasCommented={el?.comment_self}
                      likeCount={el?.like}
                      commentCount={el?.comment}
                      hashTags={el?.text}
                      postId={el?._id}
                      userId={el?.user_id}
                      username={el?.user[0]?.username}
                      profilename={el?.user[0]?.name}
                      parentRef={parentRef.current}
                      videoVal={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                        el.user_id
                      }/post/${el._id}/${
                        el?.is_converted
                          ? el.media[0]?.metadata?.convertedFilename
                          : el.media[0]?.metadata?.tempFilename
                      }`}
                      muted={muted}
                      setMuted={setMuted}
                      user_type={el.user[0]?.user_type}
                      parentType={"SNIPPET"}
                    />
                  </>
                ))
              : null}
          </div>
        </div>
        {addPost && (
          <AddPostDialog
            open={addPost}
            setAddPost={setAddPost}
            setDialogTitle={setDialogTitle}
            setDiscard={setDiscard}
            setMsgFlag={setMsgFlag}
            parentType={"SNIPPET"}
          />
        )}
        {/* discard */}
        {discard && (
          <DiscardDialog setDiscard={setDiscard} setAddPost={handleAddPost} />
        )}

        <PreloginComp
          modalOpen={anonymous}
          setModalOpen={setAnonymous}
          icon={
            <img src={RoundTableIconActive} alt="" width={40} height={40} />
          }
          title={allWords.misc.pages.prelog}
          description={""}
        />
      </div>
    </>
  );
};

export default SnippetPage;
