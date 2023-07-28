import { useEffect, useRef, useState } from "react";
import StarMessageChat from "./StarMessageChat";
import StarChat from "../../../assets/icons/not_starred.svg";
import Starred from "../../../assets/icons/starred.svg";
import { db } from "../../../push_firebase";
import { rt_id } from "../../../pages/AgoraSandbox/settings";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../../../constants/env";
import axios from "axios";
import { IconButton } from "@mui/material";
import { TimeImg, Visibility } from "../style";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function StarMessage(props) {
  //props destructuring here
  const {
    role,
    post_id_list,
    scroll,
    setScroll,
    setPostIdList,
    rtm_channel,
    handle_wildcard_removal,
    mod_pan_list,
    wc_uids,
    msg = "",
  } = props;

  //store selectors here
  const raisehand = useSelector((state) => state.raiseHand.showRaiseHand);
  const fullScr = useSelector((state) => state.fullScreen.full);

  //states here
  const [openS, setOpenS] = useState(false);
  const [allPost, setAllPost] = useState([]);
  const [gotAllPost, setGotAllPost] = useState(false);

  //state for positioning the star message popup
  const [style, setStyle] = useState({});

  //refs here
  const starRef = useRef();

  useEffect(() => {
    if (!starRef.current) return;

    if (window.innerWidth < 768) {
      setStyle({
        width: "90%",
        height: "70vh",
      });
      return;
    }

    const elem = starRef.current.getBoundingClientRect();

    setStyle({
      top: `${elem.top + 20}px`,
      right: `calc(100% - ${elem.right + 35}px)`,
    });

    const onresizeEvent = () => {
      const elem = starRef.current.getBoundingClientRect();

      setStyle({
        top: `${elem.top + 20}px`,
        right: `calc(100% - ${elem.right + 35}px)`,
      });
    };

    window.addEventListener("resize", onresizeEvent);

    return () => {
      window.removeEventListener("resize", onresizeEvent);
    };
  }, [starRef, raisehand, fullScr]);

  useEffect(() => {
    if (post_id_list.length === 0) {
      setOpenS(false);
    }
  }, [post_id_list]);

  useEffect(() => {
    if (allPost.length === 0 || gotAllPost) return;
    setGotAllPost(true);
    getStarMsgList();
  }, [allPost]);

  useEffect(() => {
    let userInteractionPost = [];
    db.collection("roundtable")
      .doc(rt_id)
      .collection("messages")
      .orderBy("created_at", "desc")
      .onSnapshot((snapshot) => {
        userInteractionPost = [];
        snapshot.forEach((doc) => {
          userInteractionPost.push(doc.data());
        });
        setAllPost(userInteractionPost);
      });
  }, []);

  //functions here
  const handleClickStar = (scrollType) => {
    setOpenS(true);
    setScroll(scrollType);
  };

  const handleCloseStar = () => {
    setOpenS(false);
  };

  const getStarMsgList = async () => {
    const data = new FormData();
    data.append("roundtable_id", rt_id);

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/rt-pin-data/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        let temp = [];

        response.data.data.map((item) => temp.push(item["_id"]));
        temp = temp.filter((item) => {
          let post = allPost.find((elem) => elem.post_id === item);

          if (post.is_deleted === 1) return false;

          return true;
        });

        setPostIdList(temp);

        if (temp.length === 0) {
          setOpenS(false);
        }
      })
      .catch();
  };

  return (
    <>
      {(role === "moderator" ||
        role === "admin" ||
        role === "admin-moderator" ||
        role === "admin-panelist") && (
        <>
          <motion.div whileHover={{ scale: 1.1, opacity: 0.8 }}>
            <IconButton
              onClick={() => {
                handleClickStar("paper");
              }}
              className="star-msg-click-appear"
              ref={starRef}
              style={{ padding: "initial" }}
            >
             <div style={{height: "30px", width: "30px", borderRadius: "50%", border: "1px solid #000", display: 'flex', alignItems: "center", justifyContent: 'center', marginRight: "5px"}}> 
                <TimeImg src={post_id_list.length > 0 ? Starred : StarChat} />
              </div>
              <span style={{ fontSize: "16px", color: "#000" }}>
                {msg !== "" ? <>&nbsp; {msg} </> : ""}
              </span>
            </IconButton>
          </motion.div>

          <StarMessageChat
            openS={openS}
            handleCloseStar={handleCloseStar}
            scroll={scroll}
            post_id_list={post_id_list}
            role={role}
            rtm_channel={rtm_channel}
            setPostIdList={setPostIdList}
            allPost={allPost}
            handle_wildcard_removal={handle_wildcard_removal}
            mod_pan_list={mod_pan_list}
            wc_uids={wc_uids}
            style={style}
          />
        </>
      )}
    </>
  );
}
