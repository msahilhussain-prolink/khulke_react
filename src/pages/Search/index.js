import React, { useState, useEffect } from "react";
import "react-placeholder/lib/reactPlaceholder.css";

// **Components
import LeftSideBar from "../../components/LeftSideBar";
import SearchContent from "../../components/SearchContent";
import SearchInput from "../../components/common/SearchInput";
import { useDispatch, useSelector } from "react-redux";
import { getSearchData } from "../../redux/actions/searchAction";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { MainDiv, LeftDiv, CenterDiv, RightDiv, Title } from "./style";
import {
  REACT_APP_BASE_URL_FOR_USER,
  REACT_APP_BASE_URL_CLOUDFRONT,
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../../constants/env";
import { useNavigate } from "react-router-dom";
import { allWords } from "../../App";

const Search = () => {
  const tab_hash = {
    0: "posts",
    1: "people",
    2: "roundtable",
  };
  const [page_active_tab, setActiveTab] = useState(1);

  //URL Parsing
  const url_search_params = new URL(window.location.href);
  let search_for = url_search_params.searchParams.get("search_term") || "";
  let active_tab =
    url_search_params.searchParams.get("active_tab") ||
    tab_hash[page_active_tab];
  let limit = url_search_params.searchParams.get("limit") || "50";
  let skip = url_search_params.searchParams.get("skip") || 0;
  let type = url_search_params.searchParams.get("type") || null;
  //let excluded_usernames; //!Activate when API ready
  let user_interests;

  //State Parsing
  const [current_user, setCurrentUser] = useState([]);
  let dispatch = useDispatch();

  //Search State Vars
  const search_results = useSelector((state) => state.search.data);
  const search_loading = useSelector((state) => state.search.loading);
  const search_error = useSelector((state) => state.search.error);
  const postData = useSelector((state) => state.post);

  const [search_term, setSearchTerm] = useState(search_for);
  const [search_debounce] = useDebounce(search_term, 1000);
  const [curated, setCurated] = useState([]);
  const [rtData, setRTData] = useState([]);
  const [searchPostData, setSearchPostData] = useState([]);
  const [rtLoading, setRTLoading] = useState(false);
  const [rtError, setRTError] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [sPostLoading, setSPostLoading] = useState(false);
  const [sPostError, setSPostError] = useState(false);
  const [sPosthasError, setSPostHasError] = useState(false);
  const navigate = useNavigate();
  const handleSearch = (term) => {
    setSearchTerm(term);

    navigate(`/search?search_term=${term.trim()}`);
  };

  function searchRT(search_debounce) {
    let access = null;

    const anonymous_user = localStorage.anonymous_user;

    access = localStorage.access || JSON.parse(anonymous_user).token;

    let data = {
      type: "roundtable",
      rt_name: search_debounce.trim(),
    };

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
        setRTLoading(false);
        if (res.status === 200) {
          setRTData(res.data);
        } else {
          setRTData([]);
          setHasError(true);
          setRTError(res.message);
        }
      })
      .catch(async (err) => {
        const res = err.response;

        if (!res) {
          setRTLoading(false);
          setHasError(true);
          setRTError("Something went wrong! Try again later!");
          return;
        }
      });
  }

  function searchPosts(search_debounce) {
    if (!search_debounce) {
      // Do nothing if search_debounce is empty
      return;
    }
    var data = new FormData();
    data.append("limit", limit);
    data.append("skip", skip || 0);
    data.append("path", `/trends/top/${search_debounce}`);
    if (!localStorage?.current_user && localStorage?.anonymous_user) {
      data.append("anonymous", true);
    }

    return axios
      .post(`${POST_API_BASE_URL}/post-paginate`, data, {
        headers: {
          "device-type": "android",
          "user-id": JSON.parse(
            localStorage.getItem("current_user") || localStorage.anonymous_user
          )["_id"],
        },
      })
      .then(async (res) => {
        setSPostLoading(false);
        if (res.status === 200) {
          setSearchPostData(res.data);
        } else {
          setSPostHasError(true);
          setSPostError(res.message);
        }
      })
      .catch(async (err) => {
        const res = err.response;

        if (!res) {
          setSPostLoading(false);
          setSPostHasError(true);
          setSPostError("Something went wrong! Try again later!");
          return;
        }
      });
  }

  useEffect(() => {
    if (localStorage.getItem("current_user")) {
      setCurrentUser(
        JSON.parse(localStorage.current_user || localStorage.anonymous_user)
      );
      //excluded_usernames = current_user["muted_accounts"] //!Activate when API ready
      user_interests = current_user["interest"];
    }
  }, []);

  const trigger_search = (from_tab = "", activeTab) => {
    //*IF TAB IS USER, URL CHANGES FROM SEARCH TO USER-SEARCH AND ONLY INTEREST IS APPENDED IN FORM DATA

    let url = `${from_tab}search`;
    let search_data = {
      search_for: search_debounce.trim(),
      active_tab: activeTab || active_tab,
      limit: limit,
      skip: skip,
      type: type,
    };
    if (from_tab === "user-") {
      search_data["user_interests"] = user_interests;
    }
    let data = { url: url, search_data: search_data };
    dispatch(getSearchData(data)); //url and search_data
  };

  useEffect(() => {
    trigger_search();
    searchRT(search_debounce);
    searchPosts(search_debounce);
  }, [search_debounce]);

  useEffect(() => {
    if (postData) {
      searchPosts(search_debounce);
    }
  }, [postData, search_debounce]);

  useEffect(() => {
    if (search_results) {
      let filter_block = [];
      search_results["data"].forEach((item) => {
        if (!item["blocked"]) {
          filter_block.push({
            username: item["username"],
            name: item["name"],
            is_following: item["you_follow"],
            user_type: item["user_type"],
          });
        }
      });
      setCurated(filter_block);
    }
  }, [search_results, search_error, search_loading]);

  return (
    <MainDiv>
      {/* <LeftDiv>
          <LeftSideBar />
        </LeftDiv> */}
      <CenterDiv>
        <Title>{allWords.th.searPlaceholder}</Title>
        <SearchInput
          value={search_term}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <SearchContent
          callback={setActiveTab}
          render_list={curated}
          search_error={search_error}
          search_loading={search_loading}
          setCurated={setCurated}
          rtData={rtData}
          searchPostData={searchPostData}
          searchRT={searchRT}
          searchPosts={searchPosts}
          trigger_search={trigger_search}
          search_debounce={search_debounce}
        />
      </CenterDiv>
      <RightDiv style={{ width: "fit-content" }}></RightDiv>
    </MainDiv>
  );
};

export default Search;
