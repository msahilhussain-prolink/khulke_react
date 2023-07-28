import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { components } from "react-select";
import styled from "styled-components";
import { allWords } from "../../../App"
// Components
import SelectedOptions from "./SelectedOptions";
import Spinner from "../../../components/Spinner";

// Assests
import search_icon from "../../../assets/icons/search.svg";

// Constants
import { POST_API_BASE_URL } from "../../../constants/env";

// Redux
import { getVisitorSearch } from "../../../redux/actions/visitorSearchAction";
import UserProfile from "../../../components/UserProfile";

const SearchCustomStyle = {
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px",
    display: "flex",
    padding: "0.1rem",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#63779C",
    fontFamily: "WorkSans-Regular",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#999999" : null,
      color: "#333333",
    };
  },
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={search_icon} alt="" />
    </components.DropdownIndicator>
  );
};

const FormatOptionLabel = (props) => {
  return (
    <components.Option {...props}>
      <div
        className="d-flex my-1 pb-2"
        style={{ borderBottom: "1px solid lightgray" }}
      >
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

const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span>No Options</span>
    </components.NoOptionsMessage>
  );
};

const Value = styled.div`
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  margin: 0 0.55rem 0.55rem 0;
  // font-size: 0.75rem;
  color: black;
  // background-color: rgba(247, 173, 46, 0.6);
  user-select: none;
`;

const XButton = styled.button`
  all: unset;
  margin-left: 0.3rem;
  color: #63779c;
  transition: fill 0.15s ease-in-out;
  cursor: pointer;
  &:hover {
    color: #63779c;
  }
  &:focus {
    color: #63779c;
  }
`;

export default function SearchUser(props) {
  const {
    sendData,
    setAudience,
    setVisitorId,
    audience_debounce,
    rt_id,
    url_rt_id,
    visitor_data,
    setVisitorData,
  } = props;
  const dispatch = useDispatch();

  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  // Global State
  const visitorSearchData = useSelector((state) => state.visitorSearch.data);
  const visitorSearchError = useSelector((state) => state.visitorSearch.err);
  const visiotrSearchLoading = useSelector(
    (state) => state.visitorSearch.loading
  );

  //   useState
  const [userTags, setUserTags] = useState();
  const [temp_select_value, setTempSelectValue] = useState([]);
  const [error_message, setErrorMessage] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (audience_debounce) {
      getUserTags(audience_debounce);
    }
  }, [audience_debounce]);

  useEffect(() => {
    if (visitorSearchData) {
      let temp_usertags = [
        // { label: current_user["username"], value: current_user["name"] },
      ];
      visitorSearchData.data.map((item) => {
        let temp_dict = {};
        if (
          item.username !== current_user["username"] &&
          item.username !== sendData["host"]
        ) {
          temp_dict["_id"] = item._id;
          temp_dict["value"] = item.name;
          temp_dict["label"] = item.username;
          temp_usertags.push(temp_dict);
        }
      });
      setUserTags(temp_usertags);
    }
    if (visitorSearchError) {
      return;
    }
    if (visiotrSearchLoading) {
      return;
    }
  }, [visitorSearchData, visiotrSearchLoading, visitorSearchError]);

  // Visitor ID
  useEffect(() => {
    let tempid = [];
    let temp_data = [];
    let temp_visitor = [];
    selected.map((item) => (tempid.push(item._id), temp_data.push(item)));
    setVisitorId(tempid);

    setVisitorData(
      sendData?.["user_data"]?.length > 0
        ? sendData?.["user_data"].concat(temp_data)
        : temp_data
    );
  }, [selected]);

  const getUserTags = (values) => {
    let data = {
      search_term: values,
      rt_id: rt_id,
    };
    dispatch(getVisitorSearch(data));
  };

  const handleAudInputChange = (newValue) => {
    // const inputValue = newValue.replace(/\W/g, "");
    setAudience(newValue);
  };

  const handleSelectChange = (values) => {
    let temp = [];

    values.map((item) => {
      setErrorMessage("");
      temp.push({
        _id: item._id,
        label: item.label,
        value: item.value,
      });
    });

    temp.forEach((i) => {
      sendData.speakers.forEach((speaker) => {
        if (
          i.label === speaker.speaker_name ||
          i.label === speaker.username ||
          i.label === sendData["host_name"]
        ) {
          setErrorMessage(allWords.misc.invite.notModPanInvite);
          temp.pop(i);
        }
      });
    });

    temp?.forEach((i) => {
      sendData?.["user_data"]?.forEach((user) => {
        if (i.label === user.label) {
          setErrorMessage("User added already!!!");
          temp.pop(i);
        }
      });
    });
    setTempSelectValue(temp);
  };

  function uniqueValue(temp_select_value1, key) {
    return [
      ...new Map(temp_select_value1.map((item) => [key(item), item])).values(),
    ];
  }

  useEffect(() => {
    setSelected(uniqueValue(temp_select_value, (it) => it._id));
  }, [temp_select_value]);

  const handleRemoveValue = (i) => {
    const newMob = [...visitor_data];
    newMob.splice(i, 1);
    setVisitorData(newMob);
  };

  return (
    <>
      <SelectedOptions
        closeMenuOnSelect={false}
        options={userTags}
        isMulti
        placeholder={allWords.misc.pg4.searchuser}
        isClearable={true}
        components={{
          IndicatorSeparator: () => null,
          ClearIndicator: () => null,
          DropdownIndicator,
          LoadingIndicator,
          Option: FormatOptionLabel,
          NoOptionsMessage,
        }}
        styles={SearchCustomStyle}
        onInputChange={handleAudInputChange}
        onChange={handleSelectChange}
        value={selected}
        url_rt_id={url_rt_id}
        sendData={sendData}
      />

      <small className="warn-text">{error_message}</small>
    </>
  );
}
