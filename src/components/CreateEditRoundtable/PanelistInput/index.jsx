import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";
import FormInput from "../../FormInput";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { allWords } from "../../../App";
import StaticButtonComponent from "../StaticButtonComponent";
import { keyPressHandler } from "../functions";

const PanelistInput = () => {
  let userData = useSelector(
    (state) => state.createEditRoundtable["moderator"]
  );

  let panelistData = useSelector(
    (state) => state.createEditRoundtable["panelists"]
  );

  const dispatch = useDispatch();

  const [changeIcon, setChangeIcon] = useState(false);
  const [introduction, setIntroduction] = useState("");
  const [show, setShow] = useState(false);
  const [wordsLeft, setWordsLeft] = useState(0);

  const panelistAdd = (e) => {
    if (e.target.value === userData?.["label"]) {
      return ToastHandler("warn", allWords.misc.livert.userAlreadyAdded);
    } else {
      dispatch(
        createEditRoundtableInitialize({
          panelists: [
            {
              name: {
                label: e.target.value,
                value: e.target.value,
              },
            },
          ],
        })
      );
    }
  };

  const rightBtnHandler = () => {
    setShow(!show);
    if (panelistData?.introduction?.length > 0) {
      setChangeIcon(true);
    }
  };

  const handleIntroduction = (e) => {
    if (e?.target?.value?.match(/[\w\d\’\'-]+/gi)?.length > 100) {
      return;
    }

    let text = e.target.value.split(" ").slice(0, 100).join(" ");

    let trimmeddesc = text.trim();
    setIntroduction(text);

    if (trimmeddesc.includes("\n")) {
      trimmeddesc = trimmeddesc.replace(/\s*\n+/g, "");
    }

    setWordsLeft(trimmeddesc.split(" ").length);
  };

  const introHandler = () => {
    dispatch(
      createEditRoundtableInitialize({
        panelists: [
          {
            ...panelistData[0],
            introduction,
          },
        ],
      })
    );

    setShow(!show);

    if (introduction.length > 0) {
      setChangeIcon(true);
    }
  };

  return (
    <>
      <FormInput custom_class="panelistFormI">
        <input
          // placeholder="Add panelist"
          type="text"
          style={{
            border: "none",
            width: "100%",
            height: "1.5rem",
            outline: "none",
            fontWeight: "bold",
          }}
          value={panelistData?.username}
          maxLength={30}
          onChange={panelistAdd}
        />
        <div
          className="right-btn-text-pan border-0 d-flex align-items-center"
          onClick={rightBtnHandler}
        >
          {changeIcon ? (
            <CheckIcon
              style={{ color: "#7AB788", marginRight: "0.2rem" }}
              fontSize="25"
            />
          ) : (
            <AddIcon
              style={{ color: "#7AB788", marginRight: "0.2rem" }}
              fontSize="25"
            />
          )}
          {allWords.misc.livert.intro}
        </div>
      </FormInput>{" "}
      {show ? (
        <>
          <div className="row mx-0 px-0 pt-3 align-items-center">
            <div className="form-group p-0 col-9 px-0">
              <input
                type="text"
                className="form-control text-box-create-rt"
                id="exampleFormControlInput1"
                placeholder={allWords.misc.add_introduction_for_panelist}
                onChange={(e) => handleIntroduction(e)}
                onKeyPress={(e) => keyPressHandler(e, 100)}
                value={introduction}
              />
            </div>
            <div
              className="right-btn-text-done d-flex col-3"
              onClick={introHandler}
            >
              <StaticButtonComponent
                styles={{
                  backgroundColor: "var(--success-color)",
                  color: "var(--white)",
                  padding: "0.5rem 1rem",
                }}
                title={allWords.misc.done}
              />
            </div>
          </div>
          <p className="create-rt-details align-desc">{wordsLeft}/100 Words</p>
        </>
      ) : null}
    </>
  );
};

export default PanelistInput;
