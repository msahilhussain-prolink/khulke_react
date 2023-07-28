import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// Material UI
import DialogIL from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
// React Icons

// Constants
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";

// Redux
import { InviteeListData } from "../../redux/actions/roundtableAction/inviteeList";

// Components
import ListComponent from "../ListComponent";

// style
import "./style.css";
import Spinner from "../Spinner";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import { CancelOutlined } from "@material-ui/icons";
import { allWords } from "../../App";
import Nothing from "../common/Noting";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    height: "800px",

    "& .MuiDialogContent-root": {
      borderTop: "Transparent",
      borderBottom: "Transparent",
    },
  },
}));

const InviteeList = (props) => {
  const {
    invite_count,
    parsed_data,
    current_user,
    url_rt_id,
    wip_rt_id,
    progress_name,
  } = props;

  const dispatch = useDispatch();
  const classes = useStyles();

  // Global State
  const inviteeList = useSelector((state) => state.inviteeList.data);
  const inviteeListError = useSelector((state) => state.inviteeList.error);
  const inviteeListLoading = useSelector((state) => state.inviteeList.loading);

  // UseState
  const [invitee_user, setInviteeUser] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [invitee_email, setInviteeEmail] = useState([]);
  const [invitee_phone, setInviteePhone] = useState([]); // Invitee List
  const [invitee_list, setInviteeList] = useState(false);
  const [invitee, setInvitee] = useState([]);
  const [scroll, setScroll] = useState("paper");
  const [inviteesError, setInviteesError] = useState({ val: false });
  const [skip, setSkip] = useState(0);

  // UseRef
  const descriptionElementRef = useRef(null);

  const handleClickIL = (scrollType) => () => {
    setInviteeList(true);
    setScroll(scrollType);
    dispatch(
      InviteeListData({
        rt_id: !url_rt_id ? wip_rt_id : url_rt_id,
        skip: 0,
      })
    );
  };

  const handleCloseIL = () => {
    setInviteeList(false);
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 10;
    if (bottom) {
      setSkip(inviteeList?.data?.data?.length);
    }
  };

  useEffect(() => {
    if (skip > 0) {
      dispatch(
        InviteeListData({
          rt_id: !url_rt_id ? wip_rt_id : url_rt_id,
          skip: skip,
        })
      );
    }
  }, [skip]);

  useEffect(() => {
    if (inviteeList && inviteeList?.status === 200) {
      let demo = [];
      inviteeList?.data?.data?.map((item, index) =>
        demo.push({
          username: item?.["username"],
          name: item?.["name"],
          following: item?.["following"],
          email: item?.["email"],
          phone: item?.["phone"],
          index: index,
        })
      );

      let temp = [...demo];

      const unique_arr = temp?.filter((element) => {
        const isDuplicate = temp?.includes(element?.username);

        if (!isDuplicate) {
          temp?.push(element?.username);

          return true;
        }

        return false;
      });
      setInvitee(unique_arr);
    }
    if (inviteeListError) {
      setInviteesError({
        val: true,
        message: inviteeListError
          ? inviteeListError?.message
          : inviteeListError,
      });
    }
    if (inviteeListLoading) {
      setInviteesError({ val: false });
    }
  }, [inviteeList, inviteeListError, inviteeListLoading]);

  useEffect(() => {
    let temp_user = [];
    let temp_email = [];
    let temp_phone = [];
    invitee?.map((item) => {
      if (item?.["username"] !== null && item?.["name"] !== null) {
        temp_user.push({
          username: item?.["username"],
          name: item?.["name"],
          is_following: item?.["following"],
          user_id: item?.["_id"],
        });
      } else if (
        item?.["username"] === null &&
        item?.["name"] === null &&
        item?.["phone"] === null
      ) {
        temp_email.push(item?.["email"]);
      } else if (
        item?.["username"] === null &&
        item?.["name"] === null &&
        item?.["email"] === null
      ) {
        temp_phone.push(item?.["phone"]);
      }
    });
    setInviteeUser(temp_user);
    setFollowers(temp_user);
    setInviteeEmail(temp_email);
    setInviteePhone(temp_phone);
  }, [invitee]);

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
              setInviteeUser(temp_solution);
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
  };

  return (
    <>
      {parsed_data?.owner?.username === current_user["username"] ||
      (parsed_data?.moderator?.m_type === "co-owner" &&
        parsed_data?.moderator?.username === current_user["username"]) ? (
        <h6
          className="d-flex mt-4"
          style={{ cursor: "pointer" }}
          onClick={progress_name !== "confirm" ? handleClickIL("paper") : ""}
        >
          {allWords.misc.livert.invitecount} -{" "}
          {progress_name === "confirm" ? (
            <>
              &nbsp;{" "}
              <span
                className="text-muted modpan_label"
                style={{ marginTop: "-5px" }}
              >
                {allWords.misc.avionceconfirm}
              </span>
            </>
          ) : (
            invite_count - parsed_data?.["rejected_count"]
          )}
        </h6>
      ) : null}

      <DialogIL
        classes={{ paper: classes.dialogPaper }}
        open={invitee_list}
        onClose={handleCloseIL}
        maxWidth="md"
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ fontWeight: "bold", fontSize: "30px" }}>
              Invitees list
            </h5>
            <div className="d-flex">
              <h5 className="invite_count">
                {invite_count - parsed_data?.["rejected_count"]}
              </h5>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, opacity: 0.8 }}
              >
                <IconButton
                  onClick={() => {
                    setInviteeList(false);
                    setInvitee([]);
                    setInviteeUser([]);
                    setSkip(0);
                  }}
                  style={{ width: 50, height: 50 }}
                >
                  <CancelOutlined />
                </IconButton>
              </motion.div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent
          dividers={scroll === "paper"}
          style={{ minWidth: 550 }}
          onScroll={handleScroll}
        >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <div>
              <div>
                <ListComponent
                  render_points={invitee_user}
                  btn_fucntion={follow_unfollow_driver}
                  type={"follow"}
                  need_badge={false}
                  div_border={false}
                />

                {invitee_email?.map((item) => (
                  <p key={item} className="mb-3 mt-2">
                    {item}
                  </p>
                ))}

                {invitee_phone?.map((item) => (
                  <p key={item} className="mb-3 mt-2">
                    {item}
                  </p>
                ))}
              </div>
              <div>
                {invitee_user?.length == 0 &&
                  invitee_email?.length == 0 &&
                  invitee_phone?.length == 0 && (
                    <Nothing msg={allWords.misc.livert.nothingToShow} />
                  )}{" "}
              </div>
            </div>

            {invitee.length > 10 && !inviteesError.val && (
              <Typography
                sx={{
                  textAlign: "center",
                }}
              >
                {allWords.misc.nomoreinvitee}
              </Typography>
            )}

            {inviteesError && (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "red",
                }}
              >
                {inviteesError.message}
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
      </DialogIL>
    </>
  );
};

export default InviteeList;
