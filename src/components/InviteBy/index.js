import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Redux
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";

// Material UI
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";

// React Icons
import ListComponent from "../ListComponent";
import { useDispatch, useSelector } from "react-redux";
import { InviteByData, getInviteByReset } from "../../redux/actions/inviteByAction";
import axios from "axios";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import Spinner from "../Spinner";
import { CancelOutlined } from "@material-ui/icons";
import { allWords } from "../../App";

const InviteBy = (props) => {
  const { setInviteBy, scroll, inviteBySkip, setInviteBySkip, nt_id } = props;

  // Useref
  const descriptionElementRef = useRef(null);

  // Global State
  const inviteByData = useSelector((state) => state.inviteBy.data);
  const inviteByError = useSelector((state) => state.inviteBy.error);
  const inviteByLoading = useSelector((state) => state.inviteBy.loading);

  // Local State
  const [followers, setFollowers] = useState([]);
  const [inviteData, setInviteData] = useState([]);
  const [inviteCalling, setInviteCalling] = useState(false);

  const dispatch = useDispatch();

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 10;
    if (bottom) {
      setInviteBySkip(inviteByData?.data?.data?.length);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(getInviteByReset())
    }
  }, [])
  

  useEffect(() => {
    if (inviteCalling) return;

    if (inviteBySkip > 0) {
      dispatch(InviteByData({ nt_id: nt_id, skip: inviteBySkip }));
    }
  }, [inviteBySkip]);

  useEffect(() => {
    if (inviteByData) {
      if (inviteByData?.status === 200) {
        let temp = [];
        inviteByData?.data?.data?.map((item) =>
          temp.push({
            username: item?.["username"],
            name: item?.["name"],
            is_following: item?.["following"],
            user_id: item?.["user_id"],
          })
        );
        let inv = [...inviteData, ...temp];

        const unique_arr = inv?.filter((element) => {
          const isDuplicate = inv?.includes(element?.username);

          if (!isDuplicate) {
            inv?.push(element?.username);

            return true;
          }

          return false;
        });
        setInviteData(unique_arr);
        setFollowers(unique_arr);
        setInviteCalling(false);
      }
    }

    if (inviteByLoading) {
      setInviteCalling(true);
    }

    if (inviteByError) {
      setInviteCalling(true);
    }
  }, [inviteByData, inviteByLoading, inviteByError]);

  const follow_unfollow_driver = async (handle, type, id) => {
    if (!handle || !type) {
      return;
    }
    let data = JSON.stringify({ handle, type });
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
            IdOth: id,
            UsernameOth: handle,
          });

          let temp_solution = [...followers];
          let toset = true;
          if (type === "unfollow") {
            toset = false;
          }
          for (let i = 0; i < temp_solution.length; i++) {
            if (temp_solution[i]["username"] === handle) {
              temp_solution[i]["is_following"] = toset;
              setInviteData(temp_solution);
              return;
            }
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
    dispatch(InviteByData({ nt_id: nt_id, skip: inviteBySkip }));
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
          <h4 style={{ fontWeight: "bold" }}>You are invited by</h4>
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
                  setInviteBy(false);
                  setInviteBySkip(0);
                  setInviteData([]);
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
        style={{ minWidth: 550, overflowY: "scroll" }}
        onScroll={handleScroll}
      >
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          {/* Use this Once follow - following key is available */}
          {inviteCalling === false && (
            <>
              <ListComponent
                render_points={inviteData}
                btn_fucntion={follow_unfollow_driver}
                type={"follow"}
                need_badge={false}
                div_border={false}
                btn_disabled={true}
              />
            </>
          )}
          {inviteCalling === true && <Spinner />}
        </DialogContentText>
      </DialogContent>
    </>
  );
};

export default InviteBy;
