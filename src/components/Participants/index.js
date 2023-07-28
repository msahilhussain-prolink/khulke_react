import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

// Material UI
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

// Utils
import ReadMoreReadLess from "../../utils/ReadMoreReadLess";
import { profileRedirect } from "../../utils/utils";
import ToastHandler from "../../utils/ToastHandler";
import { allWords } from "../../App";

// Assets
import MenuSVG from "../../assets/icons/menu.svg";

// Redux
import { ownerRightsData } from "../../redux/actions/roundtableAction/ownerRights";

// Components
import PreloginComp from "../PreLoginComp";
import UserProfile from "../UserProfile";
import PersonList from "./PersonList";
import Confirmation from "./ConfirmationDiv";

// Styles
import { HrLine, participantMenu, participateAvatar } from "./style";
import { createEditRoundtableInitialize } from "../../redux/actions/createEditRoundtable";
import moment from "moment";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";

export default function Participants(props) {
  const {
    status,
    parsed_data,
    progress_name,
    current_user,
    rt_id,
    sendData,
    url_rt_id,
    transferRights,
    setOwnerRights,
    transferRightFlag,
    setTransferRightFlag,
    owner_flag,
    setOwnerFlag,
    navigate,
    location,
    progress_two,
    wip_rt_id,
    dialog = false,
    disableRecord,
  } = props;

  const dispatch = useDispatch();

  // Global State
  const ownerRight = useSelector((state) => state.ownerRights.data);
  // useState
  const [speaker_owner, setSpeakerOwner] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [owner, setOwner] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [speaker_not_conf, setSpeakerNotConf] = useState([]);
  const [speaker_conf, setSpeakerconf] = useState([]);
  const [host, setHost] = useState("");
  const [host_name, setHostName] = useState("");
  const [bio, setBio] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [anonyFlag, setAnonyFlag] = useState(false);

  // * Menu Option
  const [anchorElParticipants, setAnchorElParticipants] = useState(null);
  const openParticipants = Boolean(anchorElParticipants);

  const handleClickParticipants = (event) => {
    setAnchorElParticipants(event.currentTarget);
  };
  const handleCloseParticipants = () => {
    setAnchorElParticipants(null);
  };

  //   useEffect
  useEffect(() => {
    if (
      sendData?.["speakers"] !== undefined ||
      sendData?.["host"] !== undefined ||
      sendData?.["host_name"] !== undefined ||
      sendData?.["bio"]
    ) {
      let temp_speakers = [];

      if (sendData?.["r_type"] !== "RECORDING_BASED") {
        sendData?.["speakers"]?.map((speaker) => {
          let structure = {
            name: speaker?.["speaker_fullname"] || speaker?.["name"],
            username: speaker?.["speaker_name"] || speaker?.["username"],
            index: speaker?.["index"],
            bio: speaker?.["bio"],
            has_confirmed: speaker?.["has_confirmed"],
            type: speaker?.["type"],
          };
          temp_speakers.push(structure);
        });
      } else {
        let structure = {
          name: sendData?.["external_speakers"]
            ?.split(" \n ")?.[0]
            ?.split("@")[1],
          username: sendData?.["external_speakers"]
            ?.split(" \n ")?.[0]
            ?.split("@")[1],
          index: 0,
          bio: sendData?.["external_speakers"]?.split(" \n ")?.[1],
          has_confirmed: 1,
          type: "NORMAL",
        };
        temp_speakers.push(
          sendData?.["external_speakers"] !== null ? structure : []
        );
      }
      setSpeakers(temp_speakers || sendData?.["speakers"]);

      setHost(sendData?.["host"] || sendData?.moderator?.username);
      setHostName(sendData?.["host_name"] || sendData?.moderator?.name);
      setBio(sendData?.["bio"] || sendData?.moderator?.bio);
    } else {
      let temp_speakers = [];
      if (parsed_data || location?.state?.rt_details) {
        let rtype = parsed_data?.["r_type"] || sendData?.["r_type"];
        if (rtype !== "RECORDING_BASED") {
          setSpeakers(parsed_data?.["speakers"] || sendData?.["speakers"]);
        } else {
          let external_speakers =
            parsed_data?.["external_speakers"] ||
            sendData?.["external_speakers"];
          let structure = {
            name: external_speakers?.split(" \n ")?.[0]?.split("@")[1],
            username: external_speakers?.split(" \n ")?.[0]?.split("@")[1],
            index: 0,
            bio: external_speakers?.split(" \n ")?.[1],
            has_confirmed: 1,
            type: "NORMAL",
          };
          temp_speakers.push(external_speakers !== undefined ? structure : []);

          setSpeakers(temp_speakers);
        }
        setHost(
          parsed_data?.moderator?.username || sendData?.moderator?.username
        );
        setHostName(parsed_data?.moderator?.name || sendData?.moderator?.name);
        setBio(parsed_data?.moderator?.bio || sendData?.moderator?.bio);
      }
    }
    setOwner(
      parsed_data?.owner?.name === undefined
        ? current_user["name"]
        : parsed_data?.owner?.name
    );

    setOwnerName(
      parsed_data?.owner?.username === undefined
        ? current_user["username"]
        : parsed_data?.owner?.username
    );

    setAnonyFlag(
      sendData?.["anonymous"] !== undefined
        ? sendData?.["anonymous"]
        : parsed_data?.owner?.anonymous !== undefined
        ? parsed_data?.owner?.anonymous
        : parsed_data?.owner?.anonymous_flag
    );
  }, [parsed_data, sendData]);

  useEffect(() => {
    if (sendData?.["m_type"] !== undefined) {
      if (sendData?.["m_type"] === "moderator") {
        setOwnerRights("moderator");
      } else {
        setOwnerRights("co-owner");
      }
    } else {
      if (parsed_data?.moderator?.m_type === "moderator") {
        setOwnerRights("moderator");
      } else {
        setOwnerRights("co-owner");
      }
    }
  }, [parsed_data]);

  useEffect(() => {
    let temp_speaker = [];
    let temp_speaker_not = [];
    let temp_speaker_reject = [];
    if (speakers?.length > 0) {
      speakers?.forEach((item) => {
        if (item.has_confirmed === 2) {
          temp_speaker_reject.push(item);
        }
        if (item.has_confirmed === 1 && item.type === "NORMAL") {
          temp_speaker.push(item);
          if (item.username === ownerName) {
            setSpeakerOwner(true);
          }
        }
        if (item.has_confirmed === 0) {
          temp_speaker_not.push(item);
          if (item.username === ownerName) {
            setSpeakerOwner(true);
          }
        }
      });
    }
    setSpeakerNotConf(temp_speaker_not);
    setSpeakerconf(temp_speaker);
  }, [speakers]);

  useEffect(() => {
    if (owner_flag?.["flag"] === true) {
      if (ownerRight && ownerRight?.status === 200) {
        ownerRight?.data?.data?.[0]?.m_type === "co-owner"
          ? setOwnerRights("co-owner")
          : setOwnerRights("moderator");
        ToastHandler("sus", "Owner rights updated successfully.");
      }
    }
  }, [ownerRight]);

  const clickEdit = () => {
    let moderator_data = {
      _id: parsed_data?.moderator?.user_id,
      label: parsed_data?.moderator?.username,
      value: parsed_data?.moderator?.name,
    };

    let durationHr = 0;

    if (
      Math.round(
        moment(new Date(parsed_data?.end)).diff(
          new Date(parsed_data?.start),
          "minutes"
        )
      ) === 30
    ) {
      durationHr = 0;
    } else {
      durationHr = Math.round(
        moment(new Date(parsed_data?.end)).diff(
          new Date(parsed_data?.start),
          "minutes"
        ) / 60
      );
    }

    dispatch(
      createEditRoundtableInitialize({
        rtType: parsed_data.r_type === "RECORDING_BASED" ? "recorded" : "live",
        rtPlayType:
          parsed_data.r_type === "VIDEO_STREAMING"
            ? "video"
            : parsed_data.r_type === "AUDIO_STREAMING"
            ? "audio"
            : "recorded",
        rtNature: parsed_data.open_to_all,
        rtTopic: parsed_data.name,
        rtDescription: parsed_data.description,
        dateValue: moment(new Date(parsed_data?.start))
          .local()
          .format("YYYY-MM-DD"),
        timeValue: moment(parsed_data?.start).local(),
        urlRtId: url_rt_id,
        wipRtId: null,
        durationHr: {
          label: ` ${durationHr} ${allWords.misc.livert.h}`,
          value: `${durationHr}`,
        },
        durationMin: {
          label: `${Math.round(
            moment(new Date(parsed_data?.end)).diff(
              new Date(parsed_data?.start),
              "minutes"
            ) % 60
          )} ${allWords.misc.livert.m}`,
          value: `${Math.round(
            moment(new Date(parsed_data?.end)).diff(
              new Date(parsed_data?.start),
              "minutes"
            ) % 60
          )}`,
        },
        durationSec: {
          label: `0 ${allWords.misc.livert.m}`,
          value: "0",
        },
        schedule: true,
        rtImage:
          parsed_data?.media?.length > 0
            ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${parsed_data?.["owner"]?.["user_id"]}/roundtable/${parsed_data?.["_id"]}/profile/${parsed_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
            : null,
        rtImageUrl:
          parsed_data?.media?.length > 0
            ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${parsed_data?.["owner"]?.["user_id"]}/roundtable/${parsed_data?.["_id"]}/profile/${parsed_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
            : null,
        logo1: parsed_data.org_logo_url,
        logo2: parsed_data.brand_logo_url,
        logo3: parsed_data.sub_brand_logo_url,
        intro: parsed_data.intro_url,
        outro: parsed_data.outro_url,
        recording: "",
        owner: parsed_data.owner,
        moderator: moderator_data,
        moderatorIntroduction: parsed_data.moderator.bio,
        m_type: parsed_data?.moderator?.m_type === "moderator" ? false : true,
        panelists: parsed_data.speakers.map((el) => {
          return {
            name: {
              _id: el?.user_id,
              label: el?.name,
              value: el?.username,
            },
            introduction: el.bio,
          };
        }),
        rtDoc: `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${parsed_data?.["owner"]?.["user_id"]}/roundtable/${parsed_data?.["_id"]}/document/${parsed_data?.["doc_media"]?.[0]?.["metadata"]?.["tempFilename"]}`,
        inviteFollower: parsed_data?.followers,
        inviteFollowing: parsed_data?.following,
        user_data: [],
        user_id: parsed_data?.userid_list,
        arrayId: parsed_data?.past_rtid,
        emails: parsed_data?.email_list,
        emailList: parsed_data?.email_list,
        phones: parsed_data?.phone_list,
        phoneList: parsed_data?.phone_list,
        anonymous: parsed_data?.owner?.anonymous,
      })
    );
    navigate(`/roundtable/edit/${rt_id}`);
  };

  return (
    <>
      <div
        className={clsx("participants-div d-flex justify-content-between", {
          ["mt-5"]: dialog === false,
          ["mt-3"]: dialog === true,
        })}
      >
        <h6 className="rt-strong-labels">
          &nbsp;{allWords.misc.livert.Participants}
        </h6>
        {disableRecord === false && (
          <>
            {status === "upcoming" && progress_name !== "review" && (
              <>
                {(parsed_data?.moderator?.m_type === "co-owner" &&
                  parsed_data?.moderator?.user_id === current_user["_id"]) ||
                parsed_data?.["owner"]?.["user_id"] === current_user["_id"] ||
                wip_rt_id ? (
                  <>
                    <div onClick={clickEdit} className="editbtn">
                      {allWords.editpanelist}
                    </div>
                  </>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
      {/* Owner name !== moderator name  */}
      {ownerName !== host && (
        <>
          {/* owner name === current user name */}
          {ownerName === current_user?.["username"] ||
          (parsed_data?.moderator?.m_type === "co-owner" &&
            parsed_data?.moderator?.user_id === current_user?.["_id"]) ? (
            <div
              className="py-2"
              style={{
                cursor: "pointer",
              }}
            >
              <div className="d-flex">
                <UserProfile username={host} className="avatar" />
                &emsp;
                <div className="custom-width-got">
                  <div className="d-flex participants-h6-bio-div">
                    <div className="d-flex participants-hr-label-2">
                      <h6
                        className="h6-style"
                        onClick={(e) => {
                          if (!e.target.id.includes("read")) {
                            profileRedirect(host);
                          }
                        }}
                      >
                        {host_name}
                      </h6>
                      &emsp; &nbsp;
                      <span className="text-muted modpan_label">
                        {allWords.misc.livert.mod}
                      </span>
                      {dialog === false ? (
                        <>
                          {transferRights !== "co-owner" ||
                          transferRightFlag !== true ? null : (
                            <>
                              &emsp;
                              {window.screen.width > 768 && <>&nbsp;</>}
                              <span className="text-muted modpan_label">
                                {allWords.misc.coowner}
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {transferRights !== "co-owner" ? null : (
                            <>
                              &emsp; &nbsp;
                              <span className="text-muted modpan_label">
                                {allWords.misc.coowner}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    {status === "upcoming" &&
                      progress_name !== "review" &&
                      ownerName === current_user["username"] && (
                        <IconButton
                          id="participant_menu"
                          style={participantMenu}
                          onClick={handleClickParticipants}
                          hidden={disableRecord}
                        >
                          <Avatar src={MenuSVG} style={participateAvatar} />
                        </IconButton>
                      )}
                  </div>
                  <h6 className="text-muted">@{host}</h6>
                  {bio !== "" ? (
                    <>
                      <ReadMoreReadLess
                        children={bio}
                        txtColorM={"#ed4d29"}
                        txtColor={"#11141c"}
                      />
                      <HrLine />
                    </>
                  ) : (
                    <HrLine />
                  )}
                </div>
              </div>
            </div>
          ) : (
            // owner name !== current user name
            <>
              {parsed_data?.moderator?.has_confirmed === 1 ? (
                <div
                  className="py-2"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    if (!e.target.id.includes("read")) {
                      profileRedirect(host);
                    }
                  }}
                >
                  <div className="d-flex">
                    <UserProfile username={host} className="avatar" />
                    &emsp;
                    <div className="full_width">
                      <div className="d-flex custom_full full-custom-div">
                        <h6 className="h6-style">{host_name}</h6>
                        &emsp; &nbsp;
                        <span className="text-muted modpan_label">
                          {allWords.misc.livert.mod}
                        </span>
                        {parsed_data?.moderator?.m_type === "co-owner" && (
                          <>
                            &emsp; &nbsp;
                            <span className="text-muted modpan_label">
                              {allWords.misc.coowner}
                            </span>
                          </>
                        )}
                      </div>
                      <h6 className="text-muted">@{host}</h6>
                      {parsed_data?.moderator?.bio !== "" ? (
                        <>
                          <ReadMoreReadLess
                            txtColorM={"#ed4d29"}
                            txtColor={"#11141c"}
                            children={parsed_data?.moderator?.bio}
                          />
                          <HrLine />
                        </>
                      ) : (
                        <HrLine />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Confirmation label={allWords.moderatorLabel} dialog={dialog} />
              )}
            </>
          )}
        </>
      )}
      {/* Panelist name !== owner name and parsed_data?.moderator.m_type === "co-owner" */}
      {speakers?.length > 0 &&
        speakers?.map((item) => (
          <>
            {item?.username !== ownerName &&
              item?.has_confirmed !== 2 &&
              item?.type === "NORMAL" && (
                <>
                  {ownerName === current_user["username"] ? (
                    <PersonList
                      key={item?.username}
                      dialog={dialog}
                      username={item?.username}
                      name={item?.name}
                      bio={item.bio}
                      label1={allWords.panelistLabel}
                      label2=""
                      item={item}
                      speakers={speakers}
                      setModalOpen={setModalOpen}
                      label3={disableRecord === true ? "record" : ""}
                    />
                  ) : null}
                </>
              )}
          </>
        ))}
      {/* Moderator m_type === coowner and moderator username === current username */}
      {speakers?.length > 0 &&
        speakers?.map((item) => (
          <>
            {item?.username !== ownerName &&
              item?.has_confirmed !== 2 &&
              item?.type === "NORMAL" && (
                <>
                  {parsed_data?.moderator?.m_type === "co-owner" &&
                    parsed_data?.moderator?.user_id === current_user["_id"] && (
                      <PersonList
                        key={item?.username}
                        dialog={dialog}
                        username={item?.username}
                        name={item?.name}
                        bio={item.bio}
                        label1={allWords.panelistLabel}
                        label2=""
                        item={item}
                        speakers={speakers}
                        setModalOpen={setModalOpen}
                        label3={disableRecord === true ? "record" : ""}
                      />
                    )}
                </>
              )}
          </>
        ))}
      {/* Moderator m_type === coowner and moderator username !== current username */}
      {ownerName !== current_user["username"] && (
        <>
          {parsed_data?.moderator?.username !== current_user["username"] &&
            parsed_data?.moderator?.m_type === "co-owner" && (
              <>
                {speakers?.length > 0 && !speaker_owner && (
                  <>
                    {speaker_conf?.length > 0 ? (
                      <>
                        {speaker_conf?.map((speaker_conf_item) => (
                          <PersonList
                            key={speaker_conf_item?.username}
                            dialog={dialog}
                            username={speaker_conf_item?.username}
                            name={speaker_conf_item?.name}
                            bio={speaker_conf_item.bio}
                            label1={allWords.panelistLabel}
                            label2=""
                            setModalOpen={setModalOpen}
                            label3={disableRecord === true ? "record" : ""}
                          />
                        ))}
                      </>
                    ) : (
                      <Confirmation
                        label={allWords.panelistLabel}
                        dialog={dialog}
                      />
                    )}
                  </>
                )}
              </>
            )}
        </>
      )}
      {/* Panelist name !== owner name and owner name !== current user name */}
      {ownerName !== current_user["username"] &&
        parsed_data?.moderator?.m_type !== "co-owner" && (
          <>
            {speakers?.length > 0 && !speaker_owner && (
              <>
                {speaker_conf?.length > 0 ? (
                  <>
                    {speaker_conf?.map((speaker_conf_item) => (
                      <>
                        {speaker_conf_item?.has_confirmed === 1 ? (
                          <PersonList
                            key={speaker_conf_item?.username}
                            dialog={dialog}
                            username={speaker_conf_item?.username}
                            name={speaker_conf_item?.name}
                            bio={speaker_conf_item.bio}
                            label1={allWords.panelistLabel}
                            label2=""
                            setModalOpen={setModalOpen}
                            label3={disableRecord === true ? "record" : ""}
                          />
                        ) : null}
                      </>
                    ))}
                  </>
                ) : null}
              </>
            )}
          </>
        )}
      {ownerName !== current_user["username"] &&
        parsed_data?.moderator?.m_type !== "co-owner" && (
          <>
            {speakers?.length > 0 && !speaker_owner && (
              <>
                {speaker_conf?.length === 0 && speaker_not_conf?.length > 0 ? (
                  <>
                    <Confirmation
                      label={allWords.panelistLabel}
                      dialog={dialog}
                    />
                  </>
                ) : null}
              </>
            )}
          </>
        )}

      {/* Panelist name === owner name */}
      {speakers?.length > 0 &&
        speakers?.map((item) => (
          <>
            {item?.username === ownerName && item?.type === "NORMAL" && (
              <>
                {anonyFlag == false ? (
                  <>
                    <PersonList
                      key={item?.username}
                      dialog={dialog}
                      username={item?.username}
                      name={item?.name}
                      bio={item.bio}
                      label1={allWords.panelistLabel}
                      label2={allWords.misc.owner}
                      setModalOpen={setModalOpen}
                      label3={disableRecord === true ? "record" : ""}
                    />
                  </>
                ) : (
                  <>
                    <PersonList
                      key={item?.username}
                      dialog={dialog}
                      username={item?.username}
                      name={item?.name}
                      bio={item.bio}
                      label1={allWords.panelistLabel}
                      label2=""
                      setModalOpen={setModalOpen}
                      label3={disableRecord === true ? "record" : ""}
                    />
                  </>
                )}
              </>
            )}
          </>
        ))}
      {/* Moderator name === owner name */}
      {ownerName === host && (
        <>
          {anonyFlag === false ? (
            <>
              <PersonList
                key={ownerName}
                dialog={dialog}
                username={ownerName}
                name={host_name}
                bio={bio}
                label1={allWords.moderatorLabel}
                label2={allWords.misc.owner}
                setModalOpen={setModalOpen}
              />
            </>
          ) : (
            <>
              <PersonList
                key={host}
                dialog={dialog}
                username={host}
                name={host_name}
                bio={bio}
                label1={allWords.moderatorLabel}
                label2=""
                setModalOpen={setModalOpen}
              />
            </>
          )}
        </>
      )}
      {/* Owner name */}
      {ownerName !== current_user["username"] ? (
        <>
          {anonyFlag === false && (
            <>
              {ownerName !== parsed_data?.moderator?.username &&
                !speaker_owner && (
                  <>
                    <div>
                      <>
                        <PersonList
                          key={ownerName}
                          dialog={dialog}
                          username={ownerName}
                          name={owner}
                          label1={allWords.misc.owner}
                          label2=""
                          setModalOpen={setModalOpen}
                        />
                      </>
                    </div>
                  </>
                )}
            </>
          )}
        </>
      ) : null}
      {ownerName === current_user["username"] ? (
        <>
          {ownerName !== host &&
            ownerName !== speakers?.[0]?.["username"] &&
            ownerName !== speakers?.[1]?.["username"] &&
            ownerName !== speakers?.[2]?.["username"] &&
            ownerName !== speakers?.[3]?.["username"] &&
            ownerName !== speakers?.[4]?.["username"] &&
            ownerName !== speakers?.[5]?.["username"] && (
              <>
                <PersonList
                  key={ownerName}
                  dialog={dialog}
                  username={ownerName}
                  name={owner}
                  label1={allWords.misc.owner}
                  label2=""
                  setModalOpen={setModalOpen}
                />
              </>
            )}
        </>
      ) : null}
      {/* Participants menu */}
      <Menu
        anchorEl={anchorElParticipants}
        open={openParticipants}
        onClose={handleCloseParticipants}
        onClick={handleCloseParticipants}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="participateMenuDiv">
          <MenuItem
            className="participateMenuItem"
            onClick={() => {
              if (progress_name === "") {
                dispatch(
                  ownerRightsData({
                    ownerRight: transferRights !== "co-owner" ? "1" : "0",
                    user_id: parsed_data.moderator.user_id,
                    rt_id: rt_id,
                  })
                );
                setOwnerFlag({
                  flag: true,
                  text:
                    transferRights !== "co-owner" ? "co-owner" : "moderator",
                });
              }
              setTransferRightFlag(!transferRightFlag);
            }}
          >
            {transferRights !== "co-owner" || transferRightFlag !== true
              ? "Transfer Owner Rights"
              : "Remove Owner Rights"}
          </MenuItem>
        </div>
      </Menu>

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <PersonIcon style={{ color: "#66B984" }} width={40} height={40} />
        }
        title={"To follow, Login or sign up to Khul Ke"}
        description={""}
      />
    </>
  );
}
