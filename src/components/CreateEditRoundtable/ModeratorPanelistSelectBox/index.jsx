import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { components } from "react-select";
import { useDebounce } from "use-debounce";

// Material UI
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

// Components
import SelectedOptionsNew from "./SelectedOptionsNew";

// Redux
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";
import { getVisitorSearch } from "../../../redux/actions/visitorSearchAction";

// Constants
import { allWords } from "../../../App";

// Components
import Spinner from "../../Spinner";
import UserProfile from "../../UserProfile";
import StaticButtonComponent from "../StaticButtonComponent";

import ButtonComponent from "../../ButtonComponent";
import {
  DoneStyles,
  SelectedOptionsStyle,
  stylesForAddBtn,
  stylesForRemoveBtn,
} from "../styles";
import "./style.css";

const FormatOptionLabel = (props) => {
  return (
    <components.Option {...props}>
      <div className="d-flex" style={{ cursor: "pointer" }}>
        <div>
          <UserProfile username={props.data.label} className="avatar" />
        </div>
        <div className="px-3" style={{ width: "80%" }}>
          <h6 style={{ color: "#000" }}>{props.data.value}</h6>
          <p style={{ color: "#475376", fontSize: "0.8rem" }}>
            @{props.data.label}
          </p>
        </div>
      </div>
    </components.Option>
  );
};

const LoadingIndicator = () => {
  return <Spinner />;
};

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>@{children}</components.SingleValue>
);

// THE NAMES BELOW ARE SAME KEY PAIRS USED IN THE REDUCER. IF ANY CHANGE IS MADE, MAKE SURE SAME NAME IS USED IN THE REDUCER TOO

// boxType = moderator => for moderator of rt
// boxType = panelists => for panelists of rt

function ModeratorPanelistSelectBox({
  boxType,
  index,
  numHandler,
  num,
  setNum,
  value,
  panelistIntro,
}) {
  const dispatch = useDispatch();

  const visitorSearchData = useSelector((state) => state.visitorSearch.data);

  const rtType = useSelector((state) => state.createEditRoundtable.rtType);
  const urlRtId = useSelector((state) => state.createEditRoundtable.urlRtId);
  const moderatorIntroduction = useSelector(
    (state) => state.createEditRoundtable.moderatorIntroduction
  );

  let userData = useSelector((state) => state.createEditRoundtable[boxType]);
  let panelistData = useSelector(
    (state) => state.createEditRoundtable.panelists
  );

  let moderatorData = useSelector(
    (state) => state.createEditRoundtable.moderator
  );

  // useState
  const [userTags, setUserTags] = useState([]);
  const [moderator, setModerator] = useState("");
  const [moderator_debounce] = useDebounce(moderator, 300);
  const [showIntroduction, setShowIntroduction] = useState(false); // for showing the introduction textbox
  const [introduction, setIntroduction] = useState(
    boxType === "moderator" ? moderatorIntroduction : panelistIntro
  ); // for the value of introduction text input
  const [error, setError] = useState("");
  const [modWordsLeft, setModWordsLeft] = useState(0);

  useEffect(() => {
    if (urlRtId) {
      if (boxType === "moderator") {
        setIntroduction(moderatorIntroduction);
      } else {
        setIntroduction(userData?.[index]?.introduction);
      }
    }
  }, [urlRtId, userData]);

  const handleSelectChange = (values) => {
    if (boxType === "moderator") {
      let tempArr = [];

      if (panelistData.length > 0) {
        panelistData.forEach((el) => {
          if (el?.name?.label === values.label) {
            tempArr.push(el);
            return setError("User already added !!!");
          } else {
            return el;
          }
        });
      }

      if (tempArr.length > 0) {
        return;
      }

      dispatch(createEditRoundtableInitialize({ moderator: values }));
    }

    const copyOfUserdata = [...userData];

    if (
      values?.label === moderatorData?.label ||
      copyOfUserdata?.find(
        (item) =>
          item?.name?.label === values?.label ||
          item?.name?.label === moderatorData?.label
      )
    ) {
      setError(`${allWords.misc.livert.userAlreadyAdded.toLowerCase()}`);
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else {
      setError("");
      if (boxType === "moderator") {
        dispatch(createEditRoundtableInitialize({ moderator: values }));
      } else if (boxType === "panelists") {
        if (!userData[0]?.name) {
          return dispatch(
            createEditRoundtableInitialize({
              panelists: [{ name: values }],
            })
          );
        }

        if (copyOfUserdata[index]?.name) {
          copyOfUserdata[index].name = values;
        } else {
          copyOfUserdata[index] = {
            name: values,
          };
        }

        dispatch(createEditRoundtableInitialize({ panelists: copyOfUserdata }));
      }
    }
  };

  useEffect(() => {
    if (urlRtId === null) {
      if (rtType === `${allWords.rt.opt3.toLowerCase()}`) {
        dispatch(
          createEditRoundtableInitialize({
            moderator: {
              label: JSON.parse(localStorage.current_user)?.["name"],
              value: JSON.parse(localStorage.current_user)?.["username"],
              _id: JSON.parse(localStorage.current_user)?.["_id"],
            },
          })
        );
      }
    }
  }, [rtType, urlRtId]);

  useEffect(() => {
    if (moderator_debounce) {
      getUserTags(moderator_debounce);
    }
  }, [moderator_debounce]);

  useEffect(() => {
    if (visitorSearchData) {
      let temp_usertags = [];
      visitorSearchData.data.map((item) => {
        let temp_dict = {};
        temp_dict["_id"] = item._id;
        temp_dict["value"] = item.name || item.username;
        temp_dict["label"] = item.username || item.name;
        temp_usertags.push(temp_dict);
      });
      setUserTags(temp_usertags);
    }
  }, [visitorSearchData]);

  const getUserTags = (values) => {
    let data = { search_term: values };
    dispatch(getVisitorSearch(data));
  };

  const handleModInputChange = (newValue) => {
    setModerator(newValue);
    setUserTags([]);
  };

  const handleModeratorIntroduction = (e) => {
    if (e?.target?.value?.match(/[\w\d\’\'-]+/gi)?.length > 100) {
      return;
    }

    let text = e.target.value.split(" ").slice(0, 100).join(" ");

    let trimmeddesc = text.trim();
    setIntroduction(text);

    if (trimmeddesc.length === 0) {
      return setModWordsLeft(0);
    }
    setModWordsLeft(trimmeddesc.split(" ").length);
  };

  const introHandler = () => {
    setShowIntroduction(!showIntroduction);
  };

  const introDispatchHandler = () => {
    setShowIntroduction(!showIntroduction);

    if (boxType === "panelists") {
      dispatch(
        createEditRoundtableInitialize({
          username: value.label,
          introduction,
        })
      );
    } else {
      dispatch(
        createEditRoundtableInitialize({ moderatorIntroduction: introduction })
      );
    }
  };

  const handlePanelistRemover = (user) => {
    setNum(num - 1);

    const newValues = userData.filter((el) => el?.name?.value !== user?.value);

    dispatch(createEditRoundtableInitialize({ panelists: newValues }));
  };

  const handlePanelistAdder = () => {
    if (num === 5) {
      return setError(allWords.misc.pages.l2.toLowerCase());
    }

    if (!userData[index]?.name.label) {
      return setError("Kindly add one panelist");
    }

    setNum(num + 1);
    numHandler();
  };

  return (
    <div>
      <div className="rt-moderator-panelist-parent row mx-0">
        <div className="p-0">
          <div className="row mx-0">
            <div className={`col-${boxType === "panelists" ? "9" : "12"} p-0 `}>
              <div className="row mx-0 options-parent-box">
                <div
                  className={`col-9 col-md-9 col-lg-${
                    boxType === "moderator" ? "10" : "9"
                  } px-0`}
                >
                  <SelectedOptionsNew
                    closeMenuOnSelect={false}
                    options={userTags}
                    placeholder={""}
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator: () => null,
                      LoadingIndicator,
                      Option: FormatOptionLabel,
                      SingleValue,
                    }}
                    styles={SelectedOptionsStyle}
                    onInputChange={handleModInputChange}
                    onChange={handleSelectChange}
                    value={value ? value : ""}
                    showIntroduction={showIntroduction}
                    setShowIntroduction={setShowIntroduction}
                  />
                </div>
                <div
                  className={`col-${
                    boxType === "panelists" ? "3" : "2"
                  } d-flex px-0 `}
                >
                  <div className="introduction-box">
                    <p
                      className={`rt-moderator-description-${boxType} ${
                        value ? null : "disabled-click-events "
                      }`}
                      onClick={introHandler}
                    >
                      {introduction && introduction.length > 0 ? (
                        <CheckIcon
                          style={{ color: "#7AB788", marginRight: "0.2rem" }}
                          fontSize="20"
                        />
                      ) : (
                        <AddIcon
                          style={{ color: "#7AB788", marginRight: "0.2rem" }}
                          fontSize="20"
                        />
                      )}
                      {allWords.misc.livert.intro}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${boxType === "panelists" ? "col-3" : "d-none"} p-0`}
            >
              <ButtonComponent
                disabled={
                  userData?.length > 0 ? !userData[index]?.name?.label : true
                }
                btnText={
                  num - 1 === index && num - 1 !== 4
                    ? allWords.misc.add_more
                    : allWords.misc.remove
                }
                btnFunction={
                  num - 1 === index
                    ? handlePanelistAdder
                    : () => handlePanelistRemover(value)
                }
                propStyles={
                  num - 1 === index && num - 1 !== 4
                    ? stylesForAddBtn
                    : stylesForRemoveBtn
                }
              />
            </div>
          </div>
        </div>
      </div>

      {showIntroduction ? (
        <div className="row mx-0 align-items-center introduction-parent-both">
          <div className="form-group p-0 col-10">
            <input
              type="text"
              className="form-control text-box-create-rt"
              id="exampleFormControlInput1"
              placeholder={
                boxType === "moderator"
                  ? allWords.misc.add_introduction_for_moderator
                  : allWords.misc.add_introduction_for_panelist
              }
              onChange={(e) => handleModeratorIntroduction(e)}
              value={introduction}
              style={{ paddingRight: "6rem" }}
            />
          </div>
          <div
            className="right-btn-text-done col-2 d-flex"
            onClick={introDispatchHandler}
          >
            <StaticButtonComponent
              styles={DoneStyles}
              title={allWords.misc.done}
            />
          </div>
          <p className="create-rt-details align-desc">
            {modWordsLeft}/100 {allWords.misc.words}
          </p>
        </div>
      ) : null}

      <div>
        <small className="warn-text">{error}</small>
      </div>
    </div>
  );
}

export default React.memo(ModeratorPanelistSelectBox);
