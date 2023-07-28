import React, { useEffect, useRef, useState } from "react";

// Material UI
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  DatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import { amPmSx, DatePickerBox, popperSx } from "../sx.js";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../../../App.js";
import { createEditRoundtableInitialize } from "../../../../redux/actions/createEditRoundtable/index.js";
import "../style.css";

export default function Timer() {
  const dispatch = useDispatch();
  const datePicker = useRef();
  const [timeClick, setTimeClick] = useState(false);

  const dateValue = useSelector(
    (state) => state.createEditRoundtable.dateValue
  );
  const timeValue = useSelector(
    (state) => state.createEditRoundtable.timeValue
  );
  const urlRtId = useSelector((state) => state.createEditRoundtable.urlRtId);
  const wipRtId = useSelector((state) => state.createEditRoundtable.wipRtId);

  const dateHandler = (type, val) => {
    // type takes in the key name where the value needs to be changed => dateValue, timeValue
    dispatch(createEditRoundtableInitialize({ [type]: val }));
  };

  // Update Every Minute
  useEffect(() => {
    let interval = "";
    let timeout = "";
    if (!urlRtId && !wipRtId) {
      if (!timeClick) {
        const setDefault = () => {
          const start_time = moment(new Date()).add(30, "minutes");

          dateHandler("timeValue", start_time);
        };

        let date_obj1 = 60 - new Date().getSeconds();

        timeout = setTimeout(() => {
          setDefault();

          interval = setInterval(() => {
            setDefault();
          }, 60000);
        }, date_obj1 * 1000);

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    } else {
      clearInterval(interval);
      clearTimeout(timeout);
    }
  }, [timeClick]);

  return (
    <div>
      <div className="mb-3">
        <small className="rt-strong-labels-gray">
          {allWords.misc.dateTime}
        </small>
      </div>

      <div className="d-flex">
        <div className="timer-class">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack>
              <DatePicker
                value={dateValue}
                ref={datePicker}
                minDate={new Date()}
                onChange={(newValue) => {
                  dateHandler("dateValue", newValue);
                }}
                inputFormat="dd/MM/yyyy"
                components={{
                  OpenPickerIcon: KeyboardArrowDownIcon,
                }}
                PopperProps={{
                  sx: popperSx,
                }}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <Box sx={DatePickerBox}>
                    <input
                      className="date-picker-input"
                      ref={inputRef}
                      {...inputProps}
                    />
                    {InputProps?.endAdornment}
                  </Box>
                )}
              />
            </Stack>
          </LocalizationProvider>
        </div>{" "}
        <div className="mobile-time-picker-div">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              label={allWords.misc.timer.selectTime}
              value={timeValue}
              onChange={(newValue) => {
                dateHandler("timeValue", newValue);
                setTimeClick(true);
              }}
              closeOnSelect={true}
              componentsProps={{
                leftArrowButton: KeyboardArrowLeftIcon,
                rightArrowButton: ChevronRightIcon,
              }}
              DialogProps={{
                sx: amPmSx,
              }}
              renderInput={({ inputRef, inputProps, InputProps }) => (
                <Box sx={DatePickerBox}>
                  <input
                    className="date-picker-input"
                    ref={inputRef}
                    {...inputProps}
                  />
                  <KeyboardArrowDownIcon ref={inputRef} {...inputProps} />
                  {InputProps?.endAdornment}
                </Box>
              )}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
}
