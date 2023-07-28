import { React, useState, useEffect, useRef } from "react";
import { POST_API_BASE_URL, REACT_APP_DEVICE_TYPE } from "../../constants/env";
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import mute_words from "../../assets/icons/Group 21133.svg";
import MuteDialog from "../../components/common/MuteDialog.js";
import MuteWordDialog from "../../components/MuteWordDialog";
import Header from "../../components/Header";

import {
  MainDiv,
  LeftDiv,
  CenterDiv,
  RightDiv,
  MuteBtn,
  Unmute,
  WordList,
} from "./style";
import axios from "axios";
import SettingsHeader from "../../components/SettingsHeader";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { metaData } from "../../constants/StaticPagesMetaTags";
import { moengageEvent } from "../../utils/utils";
import { allWords } from "../../App";

const Muted_Words = () => {
  const [word, setWord] = useState([]);
  const fetchData = (data) => {
    mutedWord(data);
  };

  const mutedWord = (created_muted) => {
    if (
      !created_muted["word"] ||
      !created_muted["time_radio"] ||
      !created_muted["operation"]
    ) {
      return;
    }
    var FormData = require("form-data");
    var data = new FormData();
    data.append("word", created_muted["word"]);
    data.append("time_radio", created_muted["time_radio"]);
    data.append("operation", created_muted["operation"]);

    var config = {
      method: "post",
      url: `${POST_API_BASE_URL}/settings/mute-word`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        getMutedword();
        moengageEvent("Mute Word", "User", { Word: created_muted["word"] });
      })
      .catch();
  };

  const getMutedword = () => {
    var FormData = require("form-data");
    var data = new FormData();

    var config = {
      method: "get",
      url: `${POST_API_BASE_URL}/settings/muted-words`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        setWord(response.data.data.details.muted_words);
        moengageEvent("View Page", "ALL", {
          URL: `${window.location.origin}/${window.location.pathname}`,
        });
      })
      .catch();
  };

  const unmuteWord = (word_id, word) => {
    var FormData = require("form-data");
    var data = new FormData();
    data.append("id", word_id);
    data.append("operation", "delete");

    var config = {
      method: "post",
      url: `${POST_API_BASE_URL}/settings/mute-word`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        getMutedword();
        moengageEvent("UnMuted Word", "User", { Word: word });
      })
      .catch();
  };

  useEffect(() => {
    getMutedword();
  }, []);

  const mutebtn = useRef("");

  const [MutedWord, setMuteWord] = useState(false);

  return (
    <>
      <MetaTagsGenerator metaTags={metaData["muted-words"]} />
      <Header />
      <MainDiv>
        <LeftDiv>
          <AccountLeftSideBar />
        </LeftDiv>
        <CenterDiv>
          <div
            style={{
              marginLeft: window.screen.width <= 768 ? "0.5rem" : "",
            }}
          >
            <SettingsHeader page_header="Muted Words" />
            <MuteBtn
              onClick={() => {
                setMuteWord(true);
              }}
              style={{ cursor: "pointer" }}
              ref={mutebtn}
            >
              <img src={mute_words} alt="" />
              <small style={{ visibility: "hidden" }}>aa</small>
              <small style={{ userSelect: "none" }}>Add Muted Words</small>
            </MuteBtn>
          </div>
          <MuteDialog
            title={"Add Muted Words"}
            open={MutedWord}
            setOpen={setMuteWord}
          >
            <MuteWordDialog
              closebtn={mutebtn}
              setMuteWord={setMuteWord}
              sendData={fetchData}
            />
          </MuteDialog>
          <>
            {word.length < 1 && (
              <div className="container text-center mt-5">
                <h6 className="text-success">No words muted!</h6>
              </div>
            )}
            {word.map((item) => (
              <WordList>
                <img src={mute_words} alt="" />
                <p style={{ paddingTop: "2px" }}>{item.word}</p>
                <p style={{ visibility: "hidden" }}>Hello World</p>
                <p style={{ paddingTop: "2px" }}>{item.expires}</p>
                <p style={{ visibility: "hidden" }}>Hello World</p>
                <Unmute
                  onClick={() => {
                    unmuteWord(item._id, item?.word);
                  }}
                >
                  {allWords.misc.pages.unmute}
                </Unmute>
              </WordList>
            ))}
          </>
        </CenterDiv>
        <RightDiv></RightDiv>
      </MainDiv>
    </>
  );
};

export default Muted_Words;
