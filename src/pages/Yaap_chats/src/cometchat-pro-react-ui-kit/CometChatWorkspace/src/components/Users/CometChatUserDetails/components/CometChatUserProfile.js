import React, { useContext, useState } from "react";
import { Fragment } from "react";
import * as enums from "../../../../util/enums.js";
import { CometChatContext } from "../../../../util/CometChatContext";
import { CometChatAvatar } from "../../../Shared";
import style from "./CometChatUserDetails.module.css";
import AudioIcon from "../resources/AudioIcon";
import VideoIcon from "../resources/VideoIcon";
import MuteOnIcon from "../resources/MuteOnIcon";
import PinnedIcon from "../resources/Pinned";
import { Avatar } from "@mui/material";
import BlockIcon from "../resources/BlockIcon";
import DislikeIcon from "../resources/DislikeIcon";
import TrashIcon from "../resources/TrashIcon";
import EncryptLockIcon from "../resources/EncryptLockIcon";
import SnowFillingIcon from "../resources/SnowFillingIcon";
import { CometChat } from "@cometchat-pro/chat";
import {CometChatSharedMediaView} from '../../../Shared/CometChatSharedMediaView'
const CometChatUserProfileComponent = ({
  toastRef,
  actionGenerated
}) => {
  const cometChatContext = useContext(CometChatContext);
  const [isFollowing, setIsFollowing] = useState(false);

  const initiateAudioCall = () => {
    actionGenerated(enums.ACTIONS["INITIATE_AUDIO_CALL"]);
  };

  const initiateVideoCall = () => {
    actionGenerated(enums.ACTIONS["INITIATE_VIDEO_CALL"]);
  };

  const blockUser = () => {
    let uid = cometChatContext.item.uid;
    let usersList = [uid];
    CometChat.blockUsers(usersList)
      .then((response) => {
        if (
          response &&
          response.hasOwnProperty(uid) &&
          response[uid].hasOwnProperty("success") &&
          response[uid]["success"] === true
        ) {
          const newType = CometChat.ACTION_TYPE.TYPE_USER;
          const newItem = Object.assign({}, cometChatContext.item, {
            blockedByMe: true,
          });
          cometChatContext.setTypeAndItem(newType, newItem);
        } else {
          toastRef.setError("SOMETHING_WRONG");
        }
      })
      .catch((error) => {
        toastRef.setError("SOMETHING_WRONG");
      });
  };

  return (
    <Fragment>
      <div className={style.user_chat_profile_container}>
        <div className={`user__thumbnail-2 ${style.user_chat_profile_dp}`}>
          <CometChatAvatar user={cometChatContext.item} />
        </div>
        <div className={style.user_chat_profile_username}>
          <span>{cometChatContext.item.name}</span>
        </div>
        {/* <div className={style.user_chat_profile_name}>
          <span>@{cometChatContext.item.name}</span>
        </div> */}
        <div style={{display: "flex", direction: "row"}}>
          <div className={style.user_chat_profile_aud_video_container}>
            <span onClick={initiateAudioCall}>
              <AudioIcon />
            </span>
            <div style={{fontSize: "14px"}}>Audio</div>
          </div>
          <div className={style.user_chat_profile_aud_video_container}>
            <span onClick={initiateVideoCall}>
              <VideoIcon />
            </span>
            <div style={{fontSize: "14px"}}>Video</div>
          </div>
        </div>
      </div>
      {/* TODO*/}
      {/* <div className={style.user_chat_follow_btn}>
        <button className={`${isFollowing ? style.user_chat_profile_following : style.user_chat_profile_follow}`} onClick={() => setIsFollowing(!isFollowing)} >{isFollowing ? "Following" :"Follow back"}</button>
      </div> */}
      {/* <GreyFullWidthDiv>
        <p className={style.user_chat_subcontainer_heading}>About</p>
        <p className={style.user_chat_about_desc}>Live, Love, Laugh</p>
      </GreyFullWidthDiv> */}

      <GreyFullWidthDiv>
        {/* TODO*/}
        {/* <p className={style.user_chat_subcontainer_heading}>
          Media, links and doc <span className={style.user_chat_see_all}>{`29 >`}</span>
        </p>
        <div>
          <div className={style.user_chat_images_box}></div>
          <div className={style.user_chat_images_box}></div>
          <div className={style.user_chat_images_box}></div>
        </div> */}
        <CometChatSharedMediaView />
      </GreyFullWidthDiv>
      {/* <GreyFullWidthDiv>
        <TextIconDesc Icon={MuteOnIcon} label="Mute Notification" />
        <TextIconDesc Icon={PinnedIcon} label="Pinned messages" />
      </GreyFullWidthDiv> */}
      {/* TODO*/}
      {/* <GreyFullWidthDiv>
        <TextIconDesc
          Icon={SnowFillingIcon}
          label="Disappearing messages"
          helper="off"
        />
        <TextIconDesc
          Icon={EncryptLockIcon}
          label="Encryption"
          helper="Messages and calls are end-to-end encrypted. Tap to verify."
        />
      </GreyFullWidthDiv> */}
      {/* <GreyFullWidthDiv>
        <p className={style.user_chat_subcontainer_heading}>Klubs in common</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <TextIconDesc
            Icon={() => (
              <Avatar
                sx={{ width: 30, height: 30 }}
                alt="Remy Sharp"
                src="https://mui.com/static/images/avatar/1.jpg"
              />
            )}
            iconWidth={40}
            label="Graphics Mindset"
            helper={
              <div className={style.user_chat_kulb_label}>
                User1, User2, User3, User4, User5 
              </div>
            }
          />
          <TextIconDesc
            Icon={() => (
              <Avatar
                sx={{ width: 30, height: 30 }}
                alt="Remy Sharp"
                src="https://mui.com/static/images/avatar/1.jpg"
              />
            )}
            iconWidth={40}
            label="Graphics Mindset"
            helper={
              <div className={style.user_chat_kulb_label}>
                User1, User2, User3, User4, User5   
              </div>
            }
          />
          <TextIconDesc
            Icon={() => (
              <Avatar sx={{ width: 30, height: 30 }} alt="Remy Sharp" src="" />
            )}
            iconWidth={40}
            label="Graphics Mindset"
            helper={
              <div className={style.user_chat_kulb_label}>
                User1, User2, User3, User4, User5 
              </div>
            }
          />
        </div>
      </GreyFullWidthDiv> */}
      <GreyFullWidthDiv>
        <TextIconDesc
          labelClickHandler={blockUser}
          Icon={BlockIcon}
          label={
            <span className={style.user_chat_restrict_labels}>
              Block {cometChatContext.item.name}
            </span>
          }
        />
        <TextIconDesc
          Icon={DislikeIcon}
          label={
            <span className={style.user_chat_restrict_labels}>
              Report {cometChatContext.item.name}
            </span>
          }
        />
        <TextIconDesc
          Icon={TrashIcon}
          label={<span className={style.user_chat_restrict_labels}>Delete</span>}
        />
      </GreyFullWidthDiv>
    </Fragment>
  );
};

const GreyFullWidthDiv = ({ children }) => {
  return (
    <div
      className={style.user_chat_gray_div_container}
    >
      <div className={style.user_chat_gray_div_container_padding}>{children}</div>
    </div>
  );
};

const TextIconDesc = ({
  Icon = () => {},
  iconWidth = 40,
  label = "",
  helper = "",
  labelClickHandler = () => {},
}) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ minWidth: `${iconWidth}px`, textAlign: "center" }}>
        <Icon />
      </div>
      <div
        className={style.user_chat_grey_label_container}
      >
        <div style={{ fontSize: "16px" }} onClick={labelClickHandler}>{label}</div>
        {helper && <div style={{ fontSize: "10px" }}>{helper}</div>}
      </div>
    </div>
  );
};

export { CometChatUserProfileComponent };
