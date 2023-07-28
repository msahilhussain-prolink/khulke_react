import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import icon from "../../../assets/icons/back.svg";
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";
import StaticButtonComponent from "../StaticButtonComponent";
import "./styles.css";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { allWords } from "../../../App";
import { keyPressHandler } from "../functions";
import { ChangeIcon, DoneStyles } from "../styles";

const TextComponent = ({ rightBtnText = allWords.createRT.descTitle }) => {
  const rtTopic = useSelector((state) => state.createEditRoundtable.rtTopic);
  const rtType = useSelector((state) => state.createEditRoundtable.rtType);
  const rtDescription = useSelector(
    (state) => state.createEditRoundtable.rtDescription
  );
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [changeIcon, setChangeIcon] = useState(false);
  const [desWordsLeft, setDesWordsLeft] = useState(0);

  const rtTopicRef = useRef("");

  const changeHandler = (e, changeType) => {
    const { value } = e.target;

    if (changeType == "rtDescription") {
      let text = e.target.value.split(" ").slice(0, 250).join(" ");

      let trimmeddesc = text.trim();

      dispatch(createEditRoundtableInitialize({ [changeType]: value }));

      if (trimmeddesc.includes("\n")) {
        trimmeddesc = trimmeddesc.replace(/\s*\n+/g, "");
      }

      setDesWordsLeft(trimmeddesc.split(" ").length);
    } else {
      dispatch(createEditRoundtableInitialize({ [changeType]: value }));
    }
  };

  const rightBtnHandler = () => {
    setShow(!show);
    if (rtDescription.length > 0) {
      setChangeIcon(true);
    }
  };

  useEffect(() => {
    if (rtDescription.length > 0) {
      setChangeIcon(true);
    }
  }, []);

  useEffect(() => {
    setDesWordsLeft(0);
  }, [rtType]);

  return (
    <div className="rt-topic-div">
      <div className="row mx-0 align-items-center rt-topic-textbox">
        <div className="form-group p-0 col-9">
          <span className="rt-placeholder">
            <input
              type="text"
              ref={rtTopicRef}
              placeholder={allWords.misc.topic}
              className="form-control text-box-create-rt"
              id="exampleFormControlInput1"
              onChange={(e) => changeHandler(e, "rtTopic")}
              value={rtTopic}
              maxLength="150"
              autoComplete={false}
            />
          </span>
        </div>
        <div
          className="right-btn-text d-flex align-items-center col-3"
          onClick={rightBtnHandler}
        >
          <div className="d-flex">
            {changeIcon && rtDescription.length > 0 ? (
              <CheckIcon style={ChangeIcon} fontSize="25" />
            ) : (
              <AddIcon style={ChangeIcon} fontSize="25" />
            )}
            {rightBtnText}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <p className="create-rt-details">{allWords.misc.example_text}</p>
        <p className="create-rt-details">
          {rtTopic?.length ?? 0}/150 {allWords.misc.char}
        </p>
      </div>
      {show ? (
        <>
          <div className="row mx-0 align-items-center parent-text-box">
            <div className="form-group p-0 col-10 p-0">
              <input
                type="text"
                className="form-control text-box-create-rt"
                id="exampleFormControlInput1"
                placeholder={
                  allWords.createRT.descTitle +
                  ": " +
                  allWords.misc.description_placeholder
                }
                onChange={(e) => changeHandler(e, "rtDescription")}
                onKeyPress={(e) => keyPressHandler(e, 250)}
                value={rtDescription}
                maxLength="2000"
              />
            </div>
            <div
              className="right-btn-text-done col-2  d-flex"
              onClick={rightBtnHandler}
            >
              <StaticButtonComponent
                styles={DoneStyles}
                title={allWords.misc.done}
              />
            </div>
          </div>
          <p
            className="create-rt-details align-desc"
            // style={{ marginTop: "-2rem" }}
          >
            {desWordsLeft}/250 {allWords.misc.words}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default TextComponent;
