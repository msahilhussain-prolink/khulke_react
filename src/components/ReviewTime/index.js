import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";

// Material UI
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Box, Button, ClickAwayListener } from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  DatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Assets
import { allWords } from "../../App";
import Pencil from "../../assets/icons/pencil.svg";
import { MOBILE_VIEW } from "../../constants/env";
import { durationHours, durationMins, getDurationHoursOption, getDurationMinsOption } from "../RTDuration/sx";
import { customStyles1, customStyles2, TimeAmPmSx, TimePopperSx } from "./sx";

// Style
import "./style.css";
import { filterDateTrans } from "../../utils/utils";

export default function ReviewTime(props) {
  const {
    sendData,
    parsed_data,
    status,
    progress_name,
    durationHr,
    durationMin,
    handleDurHr,
    handleDurMin,
    startError,
    timeValue,
    setTimeValue,
    ownerName,
    dateValue,
    setDateValue,
    disableRecord,
  } = props;

  //   Local State
  const [dateHide, setDateHide] = useState(false);
  const [timeHide, setTimeHide] = useState(false);
  const [durationHide, setDurationHide] = useState(false);
  const [hrValue, setHrValue] = useState(null);
  const [minValue, setMinValue] = useState(null);

  const datePicker = useRef(null);

  let current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );
  useEffect(() => {
    if (sendData?.["date"] === undefined) {
      setDateValue(
        moment(parsed_data?.start?.split("+")?.[0]).format("YYYY-MM-DD")
      );
    }
    if (sendData?.["start_time"] !== undefined) {
      setTimeValue(moment(new Date(sendData?.["start_time"])).local());
    } else {
      setTimeValue(
        moment(
          parsed_data?.time?.["start"] !== undefined
            ? parsed_data?.time?.["start"]?.split("+")?.[0]
            : parsed_data?.["start"]?.split("+")?.[0]
        ).local()
      );
    }

    if (sendData?.["durationHr"] === undefined) {
      let timeout = new Date(
        parsed_data?.time?.["end"] !== undefined
          ? parsed_data?.time?.["end"]?.split("+")?.[0]
          : parsed_data?.["end"]?.split("+")?.[0]
      ).getTime();
      let now = new Date(
        parsed_data?.time?.["start"] !== undefined
          ? parsed_data?.time?.["start"]?.split("+")?.[0]
          : parsed_data?.["start"]?.split("+")?.[0]
      ).getTime();
      const total = timeout - now;
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));
      setHrValue(days === 1 ? 24 : hours);
      setMinValue(minutes);
    }
  }, [sendData, parsed_data]);
  return (
    <>
      <div
        className="reviewTimeDiv"
        style={{
          flexDirection: MOBILE_VIEW
            ? window.location.pathname.includes("review")
              ? ""
              : "row"
            : "row",
        }}
      >
        <div
          className="timebtn"
          style={{
            padding: MOBILE_VIEW
              ? "1rem"
              : status === "upcoming" &&
                sendData?.["schedule"] === true &&
                progress_name !== "" &&
                ((parsed_data?.moderator?.m_type === "co-owner" &&
                  parsed_data?.moderator?.user_id === current_user?.["_id"]) ||
                  parsed_data?.["owner"]?.["username"] ===
                    current_user?.["username"] ||
                  ownerName === current_user?.["username"])
              ? "1rem 0rem 1rem 1rem"
              : "1rem 4.7rem 1rem 1rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
            }}
          >
            {allWords.misc.review.date}
          </span>
          <div className="d-flex ">
            <h6
              style={{
                fontSize: "1rem",
                color: "black",
                fontWeight: "bold",
                marginTop: "0.3rem",
              }}
            >
              {sendData?.["schedule"] !== undefined
                ? filterDateTrans(moment(new Date(dateValue)).local().format("DD MMM YY"))
                : filterDateTrans(moment(
                    new Date(
                      parsed_data?.time?.["start"] !== undefined
                        ? parsed_data?.time?.["start"]
                        : parsed_data?.["start"]
                    )
                  ) 
                    .local()
                    .format("DD MMM YY"))}
            </h6>
            {status === "upcoming" &&
              sendData?.["schedule"] === true &&
              progress_name !== "" &&
              ((parsed_data?.moderator.m_type === "co-owner" &&
                parsed_data?.moderator?.user_id === current_user?.["_id"]) ||
                parsed_data?.["owner"]?.["username"] ===
                  current_user?.["username"] ||
                ownerName === current_user?.["username"]) && (
                <>
                  &emsp; &emsp; &nbsp;
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack>
                      <DatePicker
                        open={dateHide}
                        onClose={() => setDateHide(false)}
                        value={dateValue}
                        ref={datePicker}
                        minDate={new Date()}
                        onChange={(newValue) => {
                          setDateValue(newValue);
                        }}
                        inputFormat="dd/MM/yyyy"
                        components={{
                          OpenPickerIcon: KeyboardArrowDownIcon,
                        }}
                        PopperProps={{
                          sx: TimePopperSx,
                        }}
                        renderInput={({
                          ref,
                          inputProps,
                          disabled,
                          onChange,
                          value,
                          ...other
                        }) => (
                          <div ref={ref} {...other}>
                            <input
                              style={{ display: "none" }}
                              value={value}
                              onChange={onChange}
                              disabled={disabled}
                              {...inputProps}
                            />
                            <Button
                              color="primary"
                              onClick={() => setDateHide((isOpen) => !isOpen)}
                              startIcon={<img src={Pencil} alt="" />}
                            ></Button>
                          </div>
                        )}
                      />
                    </Stack>
                  </LocalizationProvider>
                </>
              )}
          </div>
        </div>

        <div
          className="timebtn"
          style={{
            padding: MOBILE_VIEW
              ? "1rem"
              : (status === "upcoming" &&
                  sendData?.["schedule"] === true &&
                  progress_name !== "" &&
                  ((parsed_data?.moderator.m_type === "co-owner" &&
                    parsed_data?.moderator?.user_id ===
                      current_user?.["_id"]) ||
                    parsed_data?.["owner"]?.["username"] ===
                      current_user?.["username"] ||
                    ownerName === current_user?.["username"])) ||
                startError
              ? "1rem 0rem 1rem 1rem"
              : "1rem 4.7rem 1rem 1rem",

            border: startError === true ? "1px solid red" : "transparent",
          }}
        >
          <span style={{ fontSize: "0.75rem" }}>
            {allWords.misc.review.Starttm}
          </span>
          <div className="d-flex">
            <small
              style={{
                fontSize: "1rem",
                color: "black",
                fontWeight: "bold",
                marginTop: "0.3rem",
              }}
            >
              {sendData?.["schedule"] !== undefined ? (
                sendData?.["schedule"] === false ? (
                  <span>{allWords.misc.now}</span>
                ) : moment(new Date(timeValue)).format("hh:mm A") !==
                  "Invalid date" ? (
                  moment(new Date(timeValue)).format("hh:mm A")
                ) : timeValue["_i"] === "Invalid Date" ? (
                  allWords.misc.review.invalid
                ) : (
                  moment(
                    new Date(
                      parsed_data?.time?.["start"] !== undefined
                        ? parsed_data?.time?.["start"]
                        : parsed_data?.["start"]
                    )
                  )
                    .local()
                    .format("hh:mm A")
                )
              ) : (
                moment(
                  new Date(
                    parsed_data?.time?.["start"] !== undefined
                      ? parsed_data?.time?.["start"]
                      : parsed_data?.["start"]
                  )
                )
                  .local()
                  .format("hh:mm A")
              )}
            </small>
            {(status === "upcoming" &&
              sendData?.["schedule"] === true &&
              progress_name !== "" &&
              ((parsed_data?.moderator.m_type === "co-owner" &&
                parsed_data?.moderator?.user_id === current_user?.["_id"]) ||
                parsed_data?.["owner"]?.["username"] ===
                  current_user?.["username"] ||
                ownerName === current_user?.["username"])) ||
            startError === true ? (
              <>
                &emsp; &emsp; &nbsp;
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    label={allWords.misc.timer.selectTime}
                    open={timeHide}
                    onClose={() => setTimeHide(false)}
                    value={timeValue}
                    onChange={(newValue) => {
                      setTimeValue(newValue);
                    }}
                    closeOnSelect={true}
                    componentsProps={{
                      leftArrowButton: KeyboardArrowLeftIcon,
                      rightArrowButton: ChevronRightIcon,
                    }}
                    DialogProps={{
                      sx: TimeAmPmSx,
                    }}
                    renderInput={({
                      ref,
                      inputProps,
                      disabled,
                      onChange,
                      value,
                      ...other
                    }) => (
                      <div ref={ref} {...other}>
                        <input
                          style={{ display: "none" }}
                          value={value}
                          onChange={onChange}
                          disabled={disabled}
                          {...inputProps}
                        />
                        <Button
                          color="primary"
                          onClick={() => setTimeHide((isOpen) => !isOpen)}
                          startIcon={<img src={Pencil} alt="" />}
                        ></Button>
                      </div>
                    )}
                  />
                </LocalizationProvider>
              </>
            ) : null}
          </div>
        </div>

        <ClickAwayListener
          onClickAway={() => {
            setDurationHide(false);
          }}
        >
          <Box
            className="timebtn"
            // sx={{}}
            style={{
              position: "relative",
              padding: MOBILE_VIEW
                ? "1rem"
                : disableRecord === true
                ? "1rem 5rem 1rem 1rem"
                : status === "upcoming" &&
                  // disableRecord === false &&
                  progress_name !== "" &&
                  ((parsed_data?.moderator.m_type === "co-owner" &&
                    parsed_data?.moderator?.user_id ===
                      current_user?.["_id"]) ||
                    parsed_data?.["owner"]?.["username"] ===
                      current_user?.["username"] ||
                    ownerName === current_user?.["username"])
                ? "1rem 1rem 1rem 1rem"
                : "1rem 4.7rem 1rem 1rem",
            }}
          >
            <span
              style={{
                color: "var(--success-color)",
                fontSize: "0.75rem",
              }}
            >
              {allWords.misc.review.Duration}
            </span>
            <div className="d-flex">
              <small
                style={{
                  fontSize: "1rem",
                  color: "black",
                  fontWeight: "bold",
                  marginTop: "0.3rem",
                }}
              >
                {disableRecord !== true ? (
                  <>
                    {sendData?.["durationHr"] !== undefined
                      ? parseInt(durationHr?.["hr_value"]?.["label"]) +
                        allWords.misc.livert.h +
                        " " +
                        parseInt(durationMin?.["min_value"]?.["label"]) +
                        allWords.misc.livert.m
                      : hrValue + allWords.misc.livert.h + " " + minValue + allWords.misc.livert.m}
                  </>
                ) : (
                  <>
                    {parseInt(durationHr?.["hr_value"]?.["label"]) +
                      allWords.misc.livert.h +
                      " : " +
                      parseInt(durationMin?.["min_value"]?.["label"]) +
                      allWords.misc.livert.m}
                  </>
                )}
              </small>
              {status === "upcoming" &&
                disableRecord === false &&
                progress_name !== "" &&
                ((parsed_data?.moderator.m_type === "co-owner" &&
                  parsed_data?.moderator?.user_id === current_user?.["_id"]) ||
                  parsed_data?.["owner"]?.["username"] ===
                    current_user?.["username"] ||
                  ownerName === current_user?.["username"]) && (
                  <>
                    &emsp; &emsp; &nbsp;
                    <img
                      src={Pencil}
                      alt=""
                      onClick={(e) => setDurationHide((prev) => !prev)}
                    />
                  </>
                )}
            </div>

            {durationHide ? (
              <Box className="d-flex mt-3 durDiv">
                <br />
                <Select
                  closeMenuOnSelect={true}
                  value={durationHr["hr_value"]}
                  onChange={handleDurHr}
                  options={getDurationHoursOption(allWords)}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  styles={customStyles2}
                  isDisabled={disableRecord}
                />
                &emsp;
                <Select
                  closeMenuOnSelect={true}
                  value={
                    parseInt(durationHr?.["hr_value"]?.["label"]) === 24
                      ? { label: "0 Minutes", value: "0" }
                      : durationMin["min_value"]
                  }
                  onChange={handleDurMin}
                  options={getDurationMinsOption(allWords)}
                  isDisabled={
                    disableRecord === false
                      ? parseInt(durationHr?.["hr_value"]?.["label"]) === 24
                        ? true
                        : false
                      : disableRecord
                  }
                  isOptionDisabled={(option) =>
                    parseInt(durationHr?.["hr_value"]?.["label"]) === 0
                      ? option.value === "0" || option.value === "15"
                      : ""
                  }
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  styles={customStyles1}
                  defaultValue={{ label: `30 ${allWords.misc.livert.m}`, value: "30 Minutes" }}
                />
              </Box>
            ) : null}
          </Box>
        </ClickAwayListener>
      </div>
    </>
  );
}
