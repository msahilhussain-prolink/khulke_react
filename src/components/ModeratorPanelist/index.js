import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { components } from "react-select";

// Components
import SelectedOptions from "./SelectedOptions";
import Spinner from "../../components/Spinner";

// Redux
import { getVisitorSearch } from "../../redux/actions/visitorSearchAction";

// Assets
import search_icon from "../../assets/icons/search.svg";
import crossIcon from "../../assets/icons/crossIcon.svg";

// Constants
import UserProfile from "../UserProfile";
import { allWords } from "../../App";

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img
        alt=""
        src={search_icon}
        hidden={props.hasValue === true ? true : false}
      />
    </components.DropdownIndicator>
  );
};

const FormatOptionLabel = (props) => {
  return (
    <components.Option {...props}>
      <div className="d-flex my-1 pb-2">
        <div>
          <UserProfile username={props.data.label} className="avatar" />
        </div>
        <div className="px-3" style={{ width: "80%" }}>
          <h6>{props.data.value}</h6>
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
  <components.SingleValue {...props}>{children}</components.SingleValue>
);

export default function ModeratorPanelist(props) {
  const {
    custom_input_value,
    custom_ref,
    custom_bio,
    set_custom_bio,
    custom_left,
    set_custom_left,
    set_custom_error,
    custom_bio_words,
    set_custom_bio_words,
    custom_select_change,
    custom_selected,
    set_custom_selected,
    custom_debounce,
    custom_auto_focus,
    visitorSearchData,
    setTransferRightFlag,
    label,
    setPanelistError,
    setIsValid,
  } = props;

  const dispatch = useDispatch();

  // useState
  const [userTags, setUserTags] = useState([]);

  useEffect(() => {
    if (custom_debounce) {
      getUserTags(custom_debounce);
    }
  }, [custom_debounce]);

  useEffect(() => {
    if (visitorSearchData) {
      let temp_usertags = [
        // { label: current_user["username"], value: current_user["name"] },
      ];
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
    custom_input_value(newValue);
    setUserTags([]);
  };

  const handleWordLimit = (e) => {
    let text = custom_ref.current.value.split(" ").slice(0, 100).join(" ");

    let trimmeddesc = text.trim();
    set_custom_bio(text);

    if (trimmeddesc.includes("\n")) {
      trimmeddesc = trimmeddesc.replace(/\s*\n+/g, "");
    }

    set_custom_left(trimmeddesc.split(" ").length);

    let trimmedRealValue = e.target.value.trim().split(" ");
    if (trimmedRealValue.length > 100) {
      return set_custom_error(allWords.misc.textError.more_than_100);
    } else if (trimmedRealValue.length < 100) {
      set_custom_error("");
    }

    const des = custom_bio?.split(" ");
    set_custom_bio_words(des?.length);
  };

  return (
    <>
      <div style={{ height: "50px" }}>
        <SelectedOptions
          closeMenuOnSelect={false}
          options={userTags}
          placeholder={allWords.misc.pg3.catergoryplace}
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator,
            LoadingIndicator,
            ClearIndicator: () => (
              <>
                <img
                  alt=""
                  src={
                    custom_selected?.label === undefined ||
                    custom_selected?.label === ""
                      ? search_icon
                      : crossIcon
                  }
                  onClick={() => {
                    set_custom_selected(null);
                    setIsValid(true);
                    if (label === "moderator")
                      return setTransferRightFlag(false);

                    if (label === "panelist") return setPanelistError("");
                  }}
                />
              </>
            ),
            Option: FormatOptionLabel,
            SingleValue,
          }}
          isClearable
          autoFocus={custom_auto_focus}
          styles={{
            control: () => ({
              border: "1px solid #d3d6db",
              borderRadius: "10px",
              display: "flex",
              padding: "0.1rem",
              width: window.screen.width <= 768 ? "100%" : "25rem",
              justifyContent: "space-between",
            }),
            option: (styles, { isFocused }) => {
              return {
                ...styles,
                backgroundColor: isFocused ? "#999999" : null,
                color: "#333333",
              };
            },
            menu: (base) => ({
              ...base,
              width: window.screen.width <= 768 ? "21.5rem" : "25rem",
              marginLeft: "3px",
              backgroundColor: "white",
            }),
            menuList: (base) => ({
              ...base,
              width: window.screen.width <= 768 ? "21.5rem" : "24rem",
              marginLeft: "3px",
              backgroundColor: "white",
            }),
            singleValue: (base) => ({
              ...base,
              backgroundColor:
                custom_selected?.label !== undefined ||
                custom_selected?.label === ""
                  ? "#66B984"
                  : "transparent",
              maxWidth: "max-content",
              borderRadius: "10px",
              marginLeft: "5px",
              color:
                custom_selected?.label !== undefined ||
                custom_selected?.label === ""
                  ? "#FFF"
                  : "#000",
              padding: "5px",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#63779C",
              fontFamily: "WorkSans-Regular",
            }),
          }}
          onInputChange={handleModInputChange}
          onChange={custom_select_change}
          value={custom_selected}
        />
      </div>

      <div className="introCount">
        <textarea
          ref={custom_ref}
          rows="7"
          style={{
            resize: "none",
            border: "none",
            width: "100%",
            outline: "none",
            backgroundColor: "#fffcee",
          }}
          value={custom_bio}
          onChange={(e) => {
            if (e.target.value.split(" ").length < 101) {
              set_custom_bio(e.target.value);
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
          {custom_ref?.current?.value === "" && custom_left === 1
            ? 0
            : custom_left || custom_bio_words}
          /100
        </p>
      </div>
    </>
  );
}
