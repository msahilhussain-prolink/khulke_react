import React, { useEffect, useState } from "react";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../../constants/env";
// **Components
import { useDispatch } from "react-redux";
import { allWords } from "../../App";
import Header from "../../components/Header";
import MaidanContent from "../../components/MaidanContent";
import { metaData } from "../../constants/StaticPagesMetaTags";
import { CenterDiv, MainDiv } from "../../global_styles/global_style";
import MaidanContentPaginateRt from "../../redux/thunk/MaidanContentPaginateRT";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { moengageEvent } from "../../utils/utils";
import InvitationPopUp from "../../components/InvitationPopUp";

const Maidan = ({ selectedTab }) => {
  const [rtData, setRTData] = useState({[selectedTab] : []});
  const [loading, setLoading] = useState(true);
  const [has_error, setHasError] = useState(false);
  const [error_message, setErrorMessage] = useState("");
  const limit = 16;
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [callingApi, setCallingApi] = useState(false);

  function paginateRT() {
    if (callingApi) return;
    let access = null;

    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));

    access = localStorage.access || anonymous_user.token;

    let tab_hash = {
      0: "my",
      1: "active",
      2: "upcoming",
      3: "all",
    };
    let config= {};
    let data = {
      type: tab_hash[selectedTab],
      limit: limit,
      skip: skip,
    };
    if(selectedTab === 0) {
      config = {
        method: "post",
        url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/get-role-based-rt-details`,
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      };
    }
    config = {
      method: "post",
      url: `${
        anonymous_user
          ? REACT_APP_BASE_URL_FOR_ROUNDTABLE
          : REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1
      }${anonymous_user ? "/anonymous" : ""}/paginate/`,
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
        "X-API-Version": "1.1",
      },
      data: JSON.stringify(data),
    };
    let apidata = {
      config,
      onSuccess: (data, tabSelected) => {
        setLoading(false);
        const rtTempData = rtData[tabSelected] || [];
        let temp_rt_data = rtTempData.concat(data.data);

        if (data.data && data.data.length < 10) {
          setHasMore(false);
        }
        setRTData((prevState) => ({
            ...prevState,
           [tabSelected]: temp_rt_data,
          }));
        setCallingApi(false);

        moengageEvent("View Page", "ALL", {
          URL: `${window.location.origin}/${window.location.pathname}`,
        });
      },
      onFailed: (data) => {
        setLoading(false);
        setHasError(true);
        setErrorMessage(allWords.misc.pages.facingDiffi);
        setCallingApi(false);
      },
    };

    setCallingApi(true);
    dispatch(MaidanContentPaginateRt(apidata, selectedTab));
  }

  useEffect(() => {
    if (!hasMore) return;
    paginateRT();
  }, [selectedTab, skip, hasMore]);

  const dispatch = useDispatch();

  const UrlToIndex = {
    0: "mine",
    1: "live",
    2: "upcoming",
    3: "all",
  };

  return (
    <>
      <MetaTagsGenerator
        metaTags={metaData[`roundtable/${UrlToIndex[selectedTab]}`]}
      />

      <Header isRoundTable={true} />
      <MainDiv
        style={{
          height: "100vh",
          paddingLeft: "8px",
          marginLeft:"8px"
        }}
      >
        <InvitationPopUp />
        <CenterDiv
          label="maidan"
          style={{
            overflowY: "hidden",
          }}
        >
          <MaidanContent
            selectedTab={selectedTab}
            rtData={rtData[selectedTab]}
            setRTData={setRTData}
            loading={loading}
            setLoading={setLoading}
            error_message={error_message}
            setHasError={setHasError}
            has_error={has_error}
            setErrorMessage={setErrorMessage}
            limit={limit}
            skip={skip}
            setSkip={setSkip}
            hasMore={hasMore}
            setHasMore={setHasMore}
            setCallingApi={setCallingApi}
            callingApi={callingApi}
          />
        </CenterDiv>
      </MainDiv>
    </>
  );
};

export default Maidan;
