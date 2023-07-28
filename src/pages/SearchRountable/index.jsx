import React, { useEffect, useState } from "react";
import SearchInput from "../../components/common/SearchInput";
import { CenterDiv, MainDiv, RightDiv, Title } from "../Search/style";
import { allWords } from "../../App";
import { useDebounce } from "use-debounce";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../../constants/env";
import axios from "axios";
import { mocresponse } from "./mock";
import RTSearchContent from "../../components/RTSearchContent";

const SearchRountable = () => {
  const url_search_params = new URL(window.location.href);
  let search_for = url_search_params.searchParams.get("term") || "";
  const [searchQuery, setSearchQuery] = useState(search_for);
  const [search_loading, setsearch_loading] = useState(false);
  const [rtData, setRTData] = useState([]);
  const [search_debounce] = useDebounce(searchQuery, 1000);

  function searchRT(search_debounce) {
    let access = null;

    const anonymous_user = localStorage.anonymous_user;

    access = localStorage.access || JSON.parse(anonymous_user).token;

    let data = {
      type: "roundtable",
      rt_name: search_debounce.trim(),
    };

    setsearch_loading(true);

    let config = {
      method: "post",
      url: `${
        anonymous_user
          ? REACT_APP_BASE_URL_FOR_ROUNDTABLE
          : REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1
      }${
        !localStorage.current_user && localStorage.anonymous_user
          ? "/anonymous/search-roundtable/"
          : "/search-roundtable/"
      }`,
      headers: {
        Authorization: `Bearer ${
          localStorage.current_user && !localStorage.anonymous_user
            ? access
            : JSON.parse(localStorage.getItem("anonymous_user"))["token"]
        }`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };

    axios(config)
      .then(async (res) => {
        setsearch_loading(false);
        if (res.status === 200) {
          setRTData(res.data);
        } else {
          setRTData([]);
        }
      })
      .catch(async (err) => {
        const res = err.response;
        setsearch_loading(false);
        if (!res) {
          return;
        }
      });
  }

  useEffect(() => {
    searchRT(search_debounce);
  }, [search_debounce]);
  return (
    <MainDiv>
      <CenterDiv>
        <Title>{allWords.th.searPlaceholder}</Title>
        <SearchInput
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.keyCode === 13) {
              searchRT(search_debounce);
            }
          }}
        />
        <RTSearchContent rtData={rtData} search_loading={search_loading} />
      </CenterDiv>
      <RightDiv style={{ width: "fit-content" }}></RightDiv>
    </MainDiv>
  );
};

export default SearchRountable;
