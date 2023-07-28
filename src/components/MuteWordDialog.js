import React, { useState, useRef } from "react";
import FormInput from "./FormInput";
import styled from "styled-components";
import { allWords } from ".././App"

const MuteWordDialog = ({ closebtn, setMuteWord, sendData }) => {
  const MainDiv = styled.div`
    width: 20rem;

    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  `;

  const RadioDiv = styled.div`
    margin-top: 1rem;
  `;

  const operation = "create";
  const [error_message, setErrorMessage] = useState("");
  const word = useRef("");
  const forever = useRef("");
  const day = useRef("");
  const week = useRef("");
  const month = useRef("");

  function handleMute() {
    let temp_time = [
      "forever|" + forever.current.checked,
      "24hours|" + day.current.checked,
      "7days|" + week.current.checked,
      "30days|" + month.current.checked,
    ];
    temp_time = temp_time.filter((each) => each.split("|")[1] === "true");
    temp_time = temp_time[0].split("|")[0];
    let temp_word = word.current.value;
    if (temp_word === "") {
      setErrorMessage("You have not selected / added any words to mute.");
    } else {
      sendData({ word: temp_word, time_radio: temp_time, operation });
      closebtn.current.click();
      setMuteWord(false);
    }
  }

  return (
    <MainDiv>
      <div>
        <small style={{ color: "#63779C" }}>Word </small>
        <FormInput>
          <input type="text" ref={word} placeholder="Enter a word.." />
        </FormInput>
      </div>
      <small className="warn-text">{error_message}</small>
      <br />
      <div>
        <p style={{ color: "#161F3A", fontWeight: "bold" }}>For how long?</p>
        <RadioDiv>
          <input
            defaultChecked={true}
            ref={forever}
            type="radio"
            name="my-radio"
            id="radio-option-1"
          />
          <label for="radio-option-1">
            {" "}
            <span style={{ visibility: "hidden" }}>a</span> Forever{" "}
          </label>
        </RadioDiv>
        <RadioDiv>
          <input ref={day} type="radio" name="my-radio" id="radio-option-2" />
          <label for="radio-option-2">
            {" "}
            <span style={{ visibility: "hidden" }}>a</span> 24 hours{" "}
          </label>
        </RadioDiv>
        <RadioDiv>
          <input ref={week} type="radio" name="my-radio" id="radio-option-3" />
          <label for="radio-option-3">
            {" "}
            <span style={{ visibility: "hidden" }}>a</span> {allWords.misc.sevenday}{" "}
          </label>
        </RadioDiv>
        <RadioDiv>
          <input ref={month} type="radio" name="my-radio" id="radio-option-4" />
          <label for="radio-option-4">
            {" "}
            <span style={{ visibility: "hidden" }}>a</span>  {allWords.misc.thirtyday}{" "}
          </label>
        </RadioDiv>
      </div>
      <div style={{ textAlignLast: "center" }}>
        <button
          className="btn primary-btn-blk"
          style={{ width: "100%" }}
          onClick={() => {
            handleMute();
          }}
        >
          {allWords.misc.save}
        </button>
      </div>
    </MainDiv>
  );
};
export default MuteWordDialog;
