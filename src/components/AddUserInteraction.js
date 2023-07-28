import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";

//Local imports here
import { addVisitorCommentData } from "../redux/actions/visitorCommentAction";
import Dialog from "./common/Dialog";
import Comment from "./ViewerChat/Comment";
import UserListInput from "./UserListInput/userListInput";
import ToastHandler from "../utils/ToastHandler";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PreloginComp from "./PreLoginComp";
import { AddCircleOutline } from "@material-ui/icons";
import SendIcon from "../assets/icons/sendLiveRt.svg";
import { allWords } from "../App";
const AddUserInteraction = ({
  rt_id,
  mute_id,
  current_user,
  setDayDuration,
  setHourDuration,
  interactionData,
  single_rt_data,
  rttime,
  heightFromTop,
}) => {
  const [comment, setComment] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const inputRef = useRef();

  const dispatch = useDispatch();

  const [interactionAddText, setInteractionAddText] = useState("");

  const onInputChange = (e) => {
    setInteractionAddText(e.target.value.replace(/(?:\r\n|\r|\n)/g, " <br> "));
  };
  const handleSubmit = () => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      return setModalOpen(true);
    }

    let formData = new FormData();
    if (interactionAddText.length <= 0) {
      ToastHandler("warn", allWords.misc.entersomeval);
    } else if (interactionAddText.length >= 1) {
      if (interactionAddText.includes('"')) {
        const str = interactionAddText.replace(/"/g, '\\"');
        formData.append(
          "message",
          `{"room":"${rt_id}","text":"${str}","sent_by":"${
            JSON.parse(localStorage.getItem("current_user"))["username"]
          }","sent_by_name":"${
            JSON.parse(localStorage.getItem("current_user"))["username"]
          }","message_sender_type":"audience","actor_flag":"audience"}`
        );
      } else {
        formData.append(
          "message",
          `{"room":"${rt_id}","text":"${interactionAddText}","sent_by":"${
            JSON.parse(localStorage.getItem("current_user"))["username"]
          }","sent_by_name":"${
            JSON.parse(localStorage.getItem("current_user"))["username"]
          }","message_sender_type":"audience","actor_flag":"audience"}`
        );
      }

      dispatch(addVisitorCommentData(formData));
      inputRef.current.value = "";
      setInteractionAddText("");
    }
  };

  return (
    <>
      <div className="add-user-interaction-main-div">
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "initial",
            top: "initial", // 78px => height of the text box
            background: "initial",
            boxShadow: "0px -4px 11px #0000000D",
          }}
          className="add-user-interaction-div"
        >
          <IconButton
            onClick={() => {
              setComment(true);
            }}
            disabled={mute_id?.includes(current_user?.username) ? true : false}
          >
            <AddCircleOutline />
          </IconButton>
          <UserListInput
            style={{
              padding: "0.8rem 0",
            }}
            textInputStyle={{
              textWrap: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            maxLength={300}
            onChange={onInputChange}
            placeholder={allWords.misc.livert.msgplace}
            className="post-area-UI"
            refs={inputRef}
            disabled={mute_id?.includes(current_user?.username) ? true : false}
          />
          <button
            className="addSendBtn"
            onClick={handleSubmit}
            disabled={mute_id?.includes(current_user?.username) ? true : false}
          >
            {allWords.misc.livert.send}
          </button>

          <img
            src={SendIcon}
            alt="send"
            className="addSendImg"
            onClick={handleSubmit}
          />
        </div>
      </div>

      {/* dialog */}
      <Dialog
        title={allWords.misc.livert.comment}
        open={comment}
        setOpen={setComment}
        onCloseBtnClick={() => {
          setComment(false);
        }}
      >
        <Comment
          rt_id={rt_id}
          setModalOpen={setModalOpen}
          setComment={setComment}
          setDayDuration={setDayDuration}
          setHourDuration={setHourDuration}
          interactionData={interactionData}
          single_rt_data={single_rt_data}
          rttime={rttime}
        />
      </Dialog>

      {/* <CustomDialog
        open={true}
        topSection={<p>TOp Section</p>}
        middleSection={<p>Middle Section</p>}
        bottomSection={<p>Middle Section</p>}
      /> */}
      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <AddCircleIcon
            color={"success"}
            style={{
              width: "40px",
              height: "40px",
            }}
          />
        }
        title={"To Add Post , Login or sign up to Khul Ke"}
        description={""}
      />
    </>
  );
};

export default AddUserInteraction;
