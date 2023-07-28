import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { components } from "react-select";

// Constants
import { allWords } from "../../../App";

// Components
import SelectedOptions from "./SelectedOptions";
import Spinner from "../../../components/Spinner";

// Assests
import search_icon from "../../../assets/icons/search.svg";

// Redux
import { getVisitorSearch } from "../../../redux/actions/visitorSearchAction";
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";

// Style
import { FormatOptionLabel, SearchCustomStyle } from "./style";

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

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={search_icon} alt="" />
    </components.DropdownIndicator>
  );
};

export default function SearchUser({ setAudience, audience_debounce }) {
  const dispatch = useDispatch();

  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  // Global State
  const visitorSearchData = useSelector((state) => state.visitorSearch.data);
  const moderator = useSelector(
    (state) => state.createEditRoundtable.moderator
  );
  const panelists = useSelector(
    (state) => state.createEditRoundtable.panelists
  );
  const selector = useSelector((state) => state.createEditRoundtable);

  const { urlRtId, wipRtId, user_data } = selector;
  //   useState
  const [userTags, setUserTags] = useState();
  const [temp_select_value, setTempSelectValue] = useState(user_data);
  const [error_message, setErrorMessage] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (audience_debounce) {
      getUserTags(audience_debounce);
    }
  }, [audience_debounce]);

  useEffect(() => {
    if (visitorSearchData) {
      let temp_usertags = [];
      visitorSearchData.data.map((item) => {
        let temp_dict = {};
        if (
          item.username !== current_user["username"] &&
          item.username !== moderator?.value
        ) {
          temp_dict["_id"] = item._id;
          temp_dict["value"] = item.name;
          temp_dict["label"] = item.username;
          temp_usertags.push(temp_dict);
        }
      });
      setUserTags(temp_usertags);
    }
  }, [visitorSearchData]);

  useEffect(() => {
    let tempid = [];
    let temp_data = [];
    selected.map((item) => (tempid.push(item._id), temp_data.push(item)));

    if (selected?.length > 0)
      dispatch(
        createEditRoundtableInitialize({
          user_data: temp_data,
          user_id: tempid,
        })
      );
  }, [selected]);

  const getUserTags = (values) => {
    let data = {
      search_term: values,
      rt_id: wipRtId ?? urlRtId,
    };
    dispatch(getVisitorSearch(data));
  };

  const handleAudInputChange = (newValue) => {
    setAudience(newValue);
  };

  const handleSelectChange = (values, { action }) => {
    if (action === "remove-value") {
      let valueId = [];
      values.map((i) => valueId.push(i._id));
      dispatch(
        createEditRoundtableInitialize({
          user_data: values,
          user_id: valueId,
        })
      );
    }
    let temp = [];

    values.map((item) => {
      setErrorMessage("");
      temp.push({
        _id: item._id,
        label: item.label,
        value: item.value,
      });
    });

    if (temp?.find((i) => i.label === moderator.label)) {
      setErrorMessage(allWords.misc.invite.notModPanInvite);
      temp.pop(i);
      return;
    }

    temp.forEach((i) => {
      panelists.forEach((speaker) => {
        if (i.label === speaker?.name.label || i.label === speaker.name.value) {
          setErrorMessage(allWords.misc.invite.notModPanInvite);
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
      />

      <small className="warn-text">{error_message}</small>
    </>
  );
}
