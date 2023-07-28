import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { allWords } from "../../../App";
import crossIcon from "../../../assets/icons/crossIcon.svg";
import search_icon from "../../../assets/icons/search.svg";
import FormInput from "../../../components/FormInput";
import InfoIcon from "../../../components/InfoIcon";
import ModeratorPanelist from "../../../components/ModeratorPanelist";
import "./style.css";

export default function CreateModPan(props) {
  const {
    moderator,
    setModerator,
    moderator_bio,
    setModeratorBio,
    selected,
    setSelected,
    panelist,
    setPanelist,
    panelist_bio,
    setPanelistBio,
    pan_selected,
    setPanSelected,
    setIsValid,
    setSelectedId,
    url_rt_id,
    mod_bio_words,
    setModBioWords,
    pan_bio_words,
    setPanBioWords,
    current_user,
  } = props;

  const visitorSearchData = useSelector((state) => state.visitorSearch.data);

  // Local states
  const [mod_words_left, setModWordsLeft] = useState(0);
  const [moderator_error, setModeratorError] = useState("");
  const [mod_initial, setModInitial] = useState(true);
  const [moderator_debounce] = useDebounce(moderator, 300);
  const [pan_words_left, setPanWordsLeft] = useState(0);
  const [panelist_error, setPanelistError] = useState("");

  // useRef
  const modIntro = useRef("");
  const panIntro = useRef("");
  const panelist_div_ref = useRef("");

  useEffect(() => {
    setSelected({
      label: current_user?.["username"],
      value: current_user?.["name"],
    });
  }, []);

  useEffect(() => {
    if (selected) {
      if (selected["label"] !== "" && selected["label"] !== undefined) {
        if (selected?.["label"] === panelist) {
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
  }, [selected]);

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
        const des = panelist_bio?.split(" ");
        setPanBioWords(des?.length);
      }
    }
  }, [panelist_bio]);

  const handleSelectChange = (values) => {
    if (!mod_initial) {
      setModInitial(false);
    }
    setSelected(values);
    visitorSearchData?.data?.map((item) =>
      item?.username || values?.["label"] ? setSelectedId(item?._id) : ""
    );
  };

  const handleWordLimit = (e) => {
    if (e?.target?.value?.match(/[\w\d\’\'-]+/gi)?.length > 250) {
      return;
    }

    let text = panelist_div_ref.current.value
      .split(" ")
      .slice(0, 100)
      .join(" ");

    let trimmeddesc = text.trim();
    setPanelistBio(text);

    if (trimmeddesc.includes("\n")) {
      trimmeddesc = trimmeddesc.replace(/\s*\n+/g, "");
    }

    setPanWordsLeft(trimmeddesc.split(" ").length);

    let trimmedRealValue = e.target.value.trim().split(" ");
    if (trimmedRealValue.length > 100) {
      return setPanelistError(allWords.misc.textError.more_than_100);
    } else if (trimmedRealValue.length < 100) {
      setPanelistError("");
    }

    const des = panelist_bio?.split(" ");
    setPanBioWords(des?.length);
  };

  return (
    <>
      <div
        className="d-flex justify-content-between"
        style={{
          marginTop: "1.5rem",
          marginBottom: "0.5rem",
          width: "25rem",
        }}
      >
        <small className="label_txt">
          {allWords.moderatorLabel}
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
        custom_auto_focus={false}
        visitorSearchData={visitorSearchData}
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
      <FormInput custom_class="panelistFormI">
        <input
          type="text"
          style={{
            border: "none",
            width: "100%",
            height: "1.5rem",
            outline: "none",
            fontWeight: "bold",
          }}
          value={panelist}
          maxLength={30}
          onChange={(e) => {
            if (e.target.value === selected?.["label"]) {
              return setPanelistError(allWords.misc.livert.userAlreadyAdded);
            } else {
              setPanelist(e.target.value);
              setPanelistError("");
              return;
            }
          }}
        />
        <img
          src={panelist !== "" ? crossIcon : search_icon}
          alt=""
          style={{ width: 25, height: 25 }}
          onClick={() => {
            if (panelist !== "") {
              setPanelist("");
            }
          }}
        />
      </FormInput>{" "}
      <div className="introCount">
        <textarea
          ref={panelist_div_ref}
          rows="7"
          style={{
            resize: "none",
            border: "none",
            width: "100%",
            outline: "none",
            backgroundColor: "#fffcee",
          }}
          value={panelist_bio}
          onChange={(e) => {
            if (e.target.value.split(" ").length < 101) {
              setPanelistBio(e.target.value);
            }

            handleWordLimit(e);
          }}
          onKeyPress={(e) => {
            if (
              e.target.value.split(" ").length >= 100 &&
              (e.key === " " || e.key === "Enter")
            ) {
              e.preventDefault();
            }
          }}
          placeholder={allWords.misc.livert.intro}
        />
        <p style={{ textAlign: "right", marginBottom: "0rem" }}>
          {panelist_div_ref?.current?.value === "" && pan_words_left === 1
            ? 0
            : pan_words_left || pan_bio_words}
          /100
        </p>
      </div>
      <div>
        <small className="warn-text">{panelist_error}</small>
      </div>
    </>
  );
}
