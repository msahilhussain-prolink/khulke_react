import moment from "moment";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";

// Redux
import { invitePanelistData } from "../../../redux/actions/roundtableAction/invitePanelist";

//Importing CSS
import "../Create/style.css";
import "./style.css";

// Components
import ConfirmButton from "../../../components/ConfirmButton";
import InfoIcon from "../../../components/InfoIcon";
import ModeratorPanelist from "../../../components/ModeratorPanelist";
import UserList from "../../../components/UserList";

// Material UI
import { withStyles } from "@material-ui/core/styles";
import { Checkbox, Typography } from "@mui/material";
import { allWords } from "../../../App";

const CustomColorCheckbox = withStyles({
  root: {
    color: "#66B984 !important",
    marginTop: "-12px !important",
    "&$checked": {
      color: "#66B984 !important",
      marginTop: "-12px !important",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default forwardRef(function ModPan(props, ref) {
  const {
    url_rt_id,
    setProgress,
    setSendData,
    sendData,
    wip_rt_id,
    setProgressTwo,
    parsed_data,
    setParsedData,
    transferRightFlag,
    setTransferRightFlag,
    owner_flag,
    setOwnerFlag,
    ownerName,
    current_user,
    getHoursMinutes,
    handleDurHr,
    handleDurMin,
    durationHr,
    durationMin,
    navigate,
    location,
    setDateValue,
    setTimeValue,
  } = props;

  // Global state
  const invite_panelist_data = useSelector(
    (state) => state?.inviteePanelist?.data
  );
  const visitorSearchData = useSelector((state) => state.visitorSearch.data);

  // Local State
  const [rt_id, setRTId] = useState();
  const [selectedId, setSelectedId] = useState([]);
  const [selected, setSelected] = useState([]);
  const [pan_selected, setPanSelected] = useState([]);
  const panelist_div_ref = useRef("");
  const [is_valid, setIsValid] = useState(false);
  const [edit_index, setEditID] = useState("");
  const [mod_initial, setModInitial] = useState(true);
  const [moderator, setModerator] = useState("");
  const [moderator_debounce] = useDebounce(moderator, 300);
  const [moderator_bio, setModeratorBio] = useState("");
  const [panelist, setPanelist] = useState("");
  const [panelist_debounce] = useDebounce(panelist, 300);
  const [panelist_bio, setPanelistBio] = useState("");
  const [moderator_error, setModeratorError] = useState("");
  const [panelist_error, setPanelistError] = useState("");
  const [added_panelists, setAddedPanelists] = useState([]);
  const [final_message, setFinalMessage] = useState("");
  const [mod_bio_words, setModBioWords] = useState(0);
  const [mod_words_left, setModWordsLeft] = useState(0);
  const [pan_bio_words, setPanBioWords] = useState(0);
  const [pan_words_left, setPanWordsLeft] = useState(0);
  const [progress_flag, setProgressFlag] = useState(false);

  // useDispatch
  const dispatch = useDispatch();

  // useRef
  const modIntro = useRef("");
  const panIntro = useRef("");

  useEffect(() => {
    if (!url_rt_id) {
      setRTId(wip_rt_id);
    } else {
      setRTId(url_rt_id);
    }
  }, []);

  useEffect(() => {
    if (location?.state?.rt_details !== undefined) {
      setSendData(location?.state?.rt_details);
    }
  }, [location]);

  useEffect(() => {
    if (selected) {
      if (selected["label"] !== "" && selected["label"] !== undefined) {
        if (
          added_panelists.find(
            (person) => person.speaker_name === selected["label"]
          )
        ) {
          setIsValid(false);
          setModeratorError(allWords.misc.livert.userAlreadyAdded);
          return;
        } else {
          setIsValid(true);
          setModeratorError("");
        }
      } else {
        if (!mod_initial) {
          setIsValid(false);
          setModeratorError(allWords.misc.livert.userAlreadyAdded);
        }
      }
    } else {
      setIsValid(false);
    }
  }, [selected, added_panelists]);

  useEffect(() => {
    if (sendData) {
      if (sendData?.length !== 0) {
        setSelected({
          label: sendData?.["host"] || sendData?.["moderator"]?.["username"],
          value: sendData?.["host_name"] || sendData?.["moderator"]?.["name"],
        });

        // host bio
        setModeratorBio(sendData?.["bio"] || sendData?.["moderator"]?.["bio"]);
        setSelectedId(
          sendData?.["host_id"] || sendData?.["moderator"]?.["user_id"]
        );
        setTransferRightFlag(
          transferRightFlag === true
            ? true
            : sendData?.["m_type"] === undefined ||
              sendData?.["m_type"] === false ||
              sendData?.["moderator"]?.["m_type"] === "moderator"
            ? false
            : true
        );

        let temp_speakers = [];

        sendData?.["speakers"]?.map((speaker, index) => {
          let structure = {
            speaker_fullname: speaker?.["speaker_fullname"] || speaker?.name,
            speaker_name: speaker?.["speaker_name"] || speaker?.username,
            index: index,
            bio: speaker?.["bio"],
            has_confirmed: speaker?.has_confirmed ? speaker?.has_confirmed : 0,
            type: "NORMAL",
            speaker_id: speaker?.["speaker_id"] || speaker?.user_id,
          };
          temp_speakers.push(structure);
        });

        setAddedPanelists(temp_speakers);
      } else {
        if (parsed_data) {
          setSelected({
            label: parsed_data?.["moderator"]?.["username"],
            value: parsed_data?.["moderator"]?.["name"],
          });

          setModeratorBio(parsed_data?.["moderator"]?.["bio"]);
          setSelectedId(parsed_data?.["moderator"]?.["user_id"]);
          setTransferRightFlag(
            parsed_data?.moderator?.m_type === "moderator" ? false : true
          );

          let temp_speakers = [];
          parsed_data?.["speakers"]?.map((speaker, index) => {
            let structure = {
              speaker_fullname: speaker?.name,
              speaker_name: speaker?.username,
              index: index,
              bio: speaker?.["bio"],
              has_confirmed: speaker?.has_confirmed,
              type: speaker?.type,
              speaker_id: speaker?.user_id,
            };
            temp_speakers.push(structure);
          });

          setAddedPanelists(temp_speakers);
        }
      }
      if (sendData?.["durationHr"] === undefined) {
        let { hours, minutes, days } = getHoursMinutes(
          parsed_data?.["end"]?.split("+")?.[0],
          parsed_data?.["start"]?.split("+")?.[0]
        );

        handleDurHr({
          label:
            days === 1 ? 24 : hours > 0 ? hours + " Hours" : hours + " Hour",
          value: days === 1 ? 24 : hours,
        });
        handleDurMin({
          label: minutes > 0 ? minutes + " Minutes" : minutes + " Minute",
          value: minutes,
        });

        setDateValue(
          moment(new Date(parsed_data?.start)).local().format("YYYY-MM-DD")
        );
        setTimeValue(moment(parsed_data?.start).local());
      }
      // if (sendData?.length !== 0) {
      //   setTransferRightFlag(transferRightFlag);
      // } else {
      //   setTransferRightFlag(
      //     // parsed_data?.moderator?.username !== selected?.["label"] &&
      //     parsed_data?.moderator?.m_type === "moderator" ? false : true
      //   );
      // }
    }
  }, [sendData, parsed_data]);

  useEffect(() => {
    if (url_rt_id) {
      if (moderator_bio) {
        const des = moderator_bio.split(" ");
        setModBioWords(des.length);
      }
    }
  }, [moderator_bio]);

  useEffect(() => {
    if (url_rt_id) {
      if (panelist_bio !== " ") {
        const des = panelist_bio.split(" ");
        setPanBioWords(des.length);
      }
    }
  }, [panelist_bio]);

  const handleSelectChange = (values) => {
    if (!mod_initial) {
      setModInitial(false);
    }
    setSelected(values);
    setTransferRightFlag(false);
    visitorSearchData?.data?.map((item) =>
      item?.username || values?.["label"] ? setSelectedId(item?._id) : ""
    );
  };
  const handlePanSelectChange = (values) => {
    setPanSelected(values);
  };

  const AddPanelist = () => {
    if (!pan_selected || pan_selected.length === 0) {
      return;
    }
    let temp_add = added_panelists;

    if (edit_index === "") {
      setEditID("");
      try {
        if (
          added_panelists.includes(pan_selected["label"]) ||
          selected["label"] === pan_selected["label"]
        ) {
          setIsValid(false);
          setPanelistError(allWords.misc.livert.userAlreadyAdded);
          return;
        } else {
          setIsValid(true);
        }
      } catch (err) {
        return;
      }

      try {
        if (
          temp_add?.find(
            (person) =>
              person?.username === pan_selected?.["label"] ||
              person?.speaker_name === pan_selected?.["label"]
          )
        ) {
          setIsValid(false);
          setPanelistError(allWords.misc.livert.userAlreadyAdded);
          return;
        } else {
          setIsValid(true);
        }
      } catch (err) {
        return;
      }

      if (added_panelists.length < 5) {
        let structure = null;
        try {
          structure = {
            speaker_id: pan_selected["_id"],
            speaker_fullname: pan_selected["value"],
            speaker_name: pan_selected["label"],
            index: String(added_panelists.length),
            bio: panelist_bio,
            has_confirmed: 0,
            type: "NORMAL",
          };
        } catch (err) {
          return;
        }

        let temp = [...added_panelists];
        temp.push(structure);
        setAddedPanelists(temp);
        setPanSelected([]);
        setPanelistBio("");
        setPanelistError("");
        setPanWordsLeft("0");
      } else {
        setPanelistError("You can add upto 5 panelists only!");
      }
    } else {
      let structure = null;
      try {
        structure = {
          speaker_id: pan_selected["_id"],
          speaker_fullname: pan_selected["value"],
          speaker_name: pan_selected["label"],
          index: edit_index,
          bio: panelist_bio,
          has_confirmed: 0,
          type: "NORMAL",
        };
      } catch (err) {
        return;
      }
      let temp = [...added_panelists];
      temp = temp.filter((item) => item["index"] !== edit_index);
      if (
        temp.includes(pan_selected["label"]) ||
        selected["label"] === pan_selected["label"]
      ) {
        setIsValid(false);
        setPanelistError(allWords.misc.livert.userAlreadyAdded);
        return;
      } else {
        setIsValid(true);
      }

      setEditID("");
      temp.push(structure);
      setAddedPanelists(temp);
      setPanSelected([]);
      setPanelistBio("");
      setPanelistError("");
      setPanWordsLeft("0");
    }
  };

  const AddModPan = () => {
    if (selected.length === 0) {
      setModeratorError("A moderator is required!");
      return;
    }
    setModeratorError("");
    setPanelistError("");

    let data = null;

    data = {
      name:
        sendData?.["name"] !== undefined
          ? sendData?.["name"]
          : parsed_data?.["name"],
      description:
        sendData?.["description"] !== undefined
          ? sendData?.["description"]
          : parsed_data?.["description"],
      visibility:
        sendData?.["open_to_all"] !== undefined
          ? sendData?.["open_to_all"]
          : parsed_data?.["open_to_all"],
      open_to_all:
        sendData?.["open_to_all"] !== undefined
          ? sendData?.["open_to_all"]
          : parsed_data?.["open_to_all"],
      date:
        sendData?.["date"] !== undefined
          ? moment(sendData?.["date"]).format("YYYY-MM-DD")
          : moment(new Date(parsed_data?.start)).local().format("YYYY-MM-DD"),
      end_time:
        sendData?.["end_time"] !== undefined
          ? sendData?.["end_time"]
          : moment(new Date(parsed_data?.["end"])).local(),
      start_time:
        sendData?.["start_time"] !== undefined
          ? sendData?.["start_time"]
          : moment(new Date(parsed_data?.["start"])).local(),
      durationHr: parseInt(durationHr?.["hr_value"]?.["label"]),
      durationMin: parseInt(durationMin?.["min_value"]?.["label"]),
      anonymous:
        sendData?.["anonymous"] !== undefined
          ? sendData?.["anonymous"]
          : parsed_data?.["owner"]?.["anonymous_flag"],
      r_type:
        sendData?.["r_type"] !== undefined
          ? sendData?.["r_type"]
          : parsed_data?.["r_type"],
      category:
        sendData?.["category"] !== undefined
          ? sendData?.["category"]
          : parsed_data?.["category"],
      tags:
        sendData?.["tags"] !== undefined
          ? sendData?.["tags"]
          : parsed_data?.["tags"],
      followers:
        sendData?.["followers"] !== undefined
          ? sendData?.["followers"]
          : parsed_data?.["followers"],
      following:
        sendData?.["following"] !== undefined
          ? sendData?.["following"]
          : parsed_data?.["following"],
      user_id:
        sendData?.["user_id"] !== undefined
          ? sendData?.["user_id"]
          : parsed_data?.["user_id"],
      past_rtid:
        sendData?.["past_rtid"] !== undefined
          ? sendData?.["past_rtid"]
          : parsed_data?.["past_rtid"],
      email_list:
        sendData?.["email_list"] !== undefined
          ? sendData?.["email_list"]
          : parsed_data?.["email_list"],
      phone_list:
        sendData?.["phone_list"] !== undefined
          ? sendData?.["phone_list"]
          : parsed_data?.["phone_list"],
      start_recording:
        sendData?.["start_recording"] !== undefined
          ? sendData?.["start_recording"]
          : parsed_data?.recording?.[0]?.owner_flag,

      image_filename: sendData?.["imageUrls"],
      image_upload_name: sendData?.["image_name"],
      doc_filename:
        sendData?.["doc_filename"] === undefined
          ? []
          : sendData?.["doc_filename"],
      document_upload_name:
        sendData?.["document_upload_name"] === undefined
          ? ""
          : sendData?.["document_upload_name"],
      previous_document: sendData?.["previous_document"],
      doc_target_files:
        sendData?.["doc_target_files"] === undefined
          ? null
          : sendData?.["doc_target_files"],
      user_data: sendData?.["user_data"],
      host_id: selectedId,
      schedule:
        sendData?.["schedule"] !== undefined ? sendData?.["schedule"] : true,
      m_type: transferRightFlag,
    };

    let data1 = {
      speakers: added_panelists,
      host: selected["label"],
      host_name: selected["value"],
      bio: moderator_bio,
    };

    if (!url_rt_id) {
      data1["roundtable_id"] = rt_id;
      dispatch(invitePanelistData({ data: data1 }));
      setProgressFlag(true);
    } else {
      if (wip_rt_id) {
        navigate("/roundtable/create/categories");
      } else {
        navigate(`/roundtable/edit/categories/${url_rt_id}`);
      }
    }

    setOwnerFlag({
      flag: false,
      text: "",
    });
    setProgressTwo(2);
    setSendData({ ...data, ...data1 });
  };

  useEffect(() => {
    if (progress_flag === true) {
      if (invite_panelist_data) {
        if (invite_panelist_data?.status === 200) {
          setParsedData(invite_panelist_data?.data?.data?.[0]);
          navigate("/roundtable/create/categories");
          setFinalMessage("");
        } else {
          setFinalMessage(invite_panelist_data?.data?.message);
        }
      }
    }
  }, [invite_panelist_data]);

  useImperativeHandle(ref, () => ({
    saveData() {
      let data = {
        name:
          sendData?.["name"] !== undefined
            ? sendData?.["name"]
            : parsed_data?.["name"],
        description:
          sendData?.["description"] !== undefined
            ? sendData?.["description"]
            : parsed_data?.["description"],
        open_to_all:
          sendData?.["open_to_all"] !== undefined
            ? sendData?.["open_to_all"]
            : parsed_data?.["open_to_all"],
        date:
          sendData?.["date"] !== undefined
            ? moment(sendData?.["date"]).format("YYYY-MM-DD")
            : moment(new Date(parsed_data?.start))
                ?.local()
                .format("YYYY-MM-DD"),
        end_time:
          sendData?.["end_time"] !== undefined
            ? sendData?.["end_time"]
            : moment(new Date(parsed_data?.["end"]))?.local().format("hh:mm A"),
        start_time:
          sendData?.["start_time"] !== undefined
            ? sendData?.["start_time"]
            : moment(new Date(parsed_data?.["start"]))?.local(),
        // .format("hh:mm A"),
        durationHr: parseInt(durationHr?.["hr_value"]?.["label"]),
        durationMin: parseInt(durationMin?.["min_value"]?.["label"]),
        anonymous:
          sendData?.["anonymous"] !== undefined
            ? sendData?.["anonymous"]
            : parsed_data?.["anonymous"],
        r_type:
          sendData?.["r_type"] !== undefined
            ? sendData?.["r_type"]
            : parsed_data?.["r_type"],
        category:
          sendData?.["category"] !== undefined
            ? sendData?.["category"]
            : parsed_data?.["category"],
        tags:
          sendData?.["tags"] !== undefined
            ? sendData?.["tags"]
            : parsed_data?.["tags"],
        followers:
          sendData?.["followers"] !== undefined
            ? sendData?.["followers"]
            : parsed_data?.["followers"],
        following:
          sendData?.["following"] !== undefined
            ? sendData?.["following"]
            : parsed_data?.["following"],
        user_id:
          sendData?.["user_id"] !== undefined
            ? sendData?.["user_id"]
            : parsed_data?.["user_id"],
        past_rtid:
          sendData?.["past_rtid"] !== undefined
            ? sendData?.["past_rtid"]
            : parsed_data?.["past_rtid"],
        email_list:
          sendData?.["email_list"] !== undefined
            ? sendData?.["email_list"]
            : parsed_data?.["email_list"],
        phone_list:
          sendData?.["phone_list"] !== undefined
            ? sendData?.["phone_list"]
            : parsed_data?.["phone_list"],
        start_recording:
          sendData?.["start_recording"] !== undefined
            ? sendData?.["start_recording"]
            : parsed_data?.recording?.[0]?.owner_flag,
        image_filename: sendData?.["imageUrls"],
        image_upload_name: sendData?.["image_name"],
        doc_filename:
          sendData?.["doc_filename"] === undefined
            ? []
            : sendData?.["doc_filename"],
        document_upload_name:
          sendData?.["document_upload_name"] === undefined
            ? ""
            : sendData?.["document_upload_name"],
        previous_document: sendData?.["previous_document"],
        doc_target_files:
          sendData?.["doc_target_files"] === undefined
            ? null
            : sendData?.["doc_target_files"],
        user_data: sendData?.["user_data"],
        speakers: added_panelists,
        host: selected["label"],
        host_id: selectedId,
        host_name: selected["value"],
        bio: moderator_bio,
        schedule:
          sendData?.["schedule"] !== undefined ? sendData?.["schedule"] : true,
        m_type: transferRightFlag,
      };

      if (!url_rt_id) {
        data["roundtable_id"] = rt_id;
      } else {
        data["roundtable_id"] = url_rt_id;
      }

      setSendData(data);
    },
  }));

  const handleChange = (event) => {
    setTransferRightFlag(event.target.checked);
  };

  return (
    <section>
      {/* Moderator  */}
      <div
        className="d-flex justify-content-between"
        style={{
          marginTop: "1.5rem",
          marginBottom: "0.5rem",
          width: "53%",
        }}
      >
        <small className="label_txt">
          {allWords.moderatorLabel}{" "}
          <InfoIcon
            infoTitle2={allWords.misc.minfo1}
            infoTitle6={allWords.misc.minfor2}
            infoTitle7={allWords.misc.minfor3}
            infoTitle8={allWords.misc.minfor4}
            infoTitle9={allWords.misc.minfor5}
            infoTitle10={allWords.misc.minfor6}
            infoTitle11={allWords.misc.minfor7}
          />{" "}
        </small>

        {selected?.label !== undefined ? (
          <>
            {(ownerName ===
              JSON.parse(
                localStorage.current_user || localStorage.anonymous_user
              )?.["username"] ||
              parsed_data?.owner?.username ===
                JSON.parse(
                  localStorage.current_user || localStorage.anonymous_user
                )?.["username"]) && (
              <>
                {selected?.["label"] !==
                  JSON.parse(
                    localStorage.current_user || localStorage.anonymous_user
                  )?.["username"] && (
                  <div className="d-flex">
                    <Typography
                      style={{
                        color: "#66B984",
                        fontSize: "15px",
                        opacity: "1",
                      }}
                    >
                      {allWords.misc.pages.makecoowner}
                    </Typography>{" "}
                    &emsp;
                    <CustomColorCheckbox
                      checked={transferRightFlag}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </>
            )}
          </>
        ) : null}
      </div>

      <ModeratorPanelist
        custom_input_value={setModerator}
        custom_ref={modIntro}
        custom_bio={moderator_bio}
        set_custom_bio={setModeratorBio}
        custom_bio_words={mod_bio_words}
        set_custom_bio_words={setModBioWords}
        custom_left={mod_words_left}
        set_custom_left={setModWordsLeft}
        set_custom_error={setModeratorError}
        custom_select_change={handleSelectChange}
        custom_selected={selected}
        set_custom_selected={setSelected}
        custom_debounce={moderator_debounce}
        custom_auto_focus
        visitorSearchData={visitorSearchData}
        setTransferRightFlag={setTransferRightFlag}
        label={"moderator"}
      />

      <div className="mb-4 mt-2">
        <small className="warn-text">{moderator_error}</small>
      </div>

      {/* Panelist  */}
      <div
        ref={panelist_div_ref}
        style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}
      >
        <small className="label_txt">
          {allWords.panelistLabel}{" "}
          <InfoIcon
            infoTitle2={allWords.misc.pages.l1}
            infoTitle3={allWords.misc.pages.l2}
            infoTitle4={allWords.misc.pages.l3}
          />{" "}
        </small>
      </div>

      <ModeratorPanelist
        custom_input_value={setPanelist}
        custom_ref={panIntro}
        custom_bio={panelist_bio}
        set_custom_bio={setPanelistBio}
        custom_bio_words={pan_bio_words}
        set_custom_bio_words={setPanBioWords}
        custom_left={pan_words_left}
        set_custom_left={setPanWordsLeft}
        set_custom_error={setPanelistError}
        custom_select_change={handlePanSelectChange}
        custom_selected={pan_selected}
        set_custom_selected={setPanSelected}
        custom_debounce={panelist_debounce}
        visitorSearchData={visitorSearchData}
        setPanelistError={setPanelistError}
        setIsValid={setIsValid}
        label={"panelist"}
      />
      <div>
        <small className="warn-text">{panelist_error}</small>
      </div>

      {/* Add Panelist Button */}
      <button onClick={AddPanelist} className="addpanelistbtn mt-3">
        {edit_index === "" ? allWords.addPanelistBtn : allWords.editPanelistBtn}
      </button>
      <div className="mt-2">
        {/* Panelist Div */}
        {added_panelists.length > 0 &&
          added_panelists.map((item, index) => (
            <UserList
              user={item}
              index={index}
              setPanSelected={setPanSelected}
              setPanelistBio={setPanelistBio}
              panelist_div_ref={panelist_div_ref}
              setEditID={setEditID}
              added_panelists={added_panelists}
              setAddedPanelists={setAddedPanelists}
            />
          ))}
        {/* {added_panelists.length === 0 && (
          <div className="container text-center my-3">
            <small className="text-muted" style={{ fontSize: "1rem" }}>
              No panelists added!
            </small>
          </div>
        )} */}
      </div>

      <div className="container-fluid mt-4">
        <small className="warn-text">{final_message}</small>
      </div>

      {/* Continue Button  */}
      <ConfirmButton is_valid={is_valid} onclick={AddModPan} />
    </section>
  );
});
