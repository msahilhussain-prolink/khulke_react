import React, { useEffect, useState } from "react";

// Material UI
import {
  DatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { amPmSx, popperSx } from "./sx";
import moment from "moment";
import InfoIcon from "../InfoIcon";
import { allWords } from "../../App"

export default function Time(props) {
  const {
    dateValue,
    setDateValue,
    timeValue,
    setTimeValue,
    datePicker,
    url_rt_id,
    wip_rt_id,
  } = props;

  // Local state
  const [timeClick, setTimeClick] = useState(false);

  // Update Every Minute
  useEffect(() => {
    let interval = "";
    let timeout = "";
    if (!url_rt_id && !wip_rt_id) {
      if (timeClick === false) {
        const setDefault = () => {
          const start_time = moment(new Date()).add(30, "minutes");

          setTimeValue(start_time);
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
      <div className="mb-3" style={{ marginTop: "15px" }}>
        <small className="rt-strong-labels-gray">{allWords.misc.dateTime}</small>
      </div>

      <div className="d-flex">
        <div style={{ width: "9rem", height: "40px" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack>
              <DatePicker
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
                  sx: popperSx,
                }}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid rgba(211, 214, 219, 1)",
                      borderRadius: "0.5rem",
                      marginTop: "-0.4rem",
                      padding: "0.7rem 0.6rem",
                      height: "40px",
                    }}
                  >
                    <input
                      style={{
                        border: "transparent",
                        width: "5rem",
                        fontSize: "14px",
                      }}
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
        &emsp;
        <div style={{ height: "40px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              label={allWords.misc.timer.selectTime}
              value={timeValue}
              onChange={(newValue) => {
                setTimeValue(newValue);
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid rgba(211, 214, 219, 1)",
                    borderRadius: "0.5rem",
                    marginTop: "-0.4rem",
                    padding: "0.7rem 0.6rem",
                    height: "40px",
                  }}
                >
                  <input
                    style={{
                      border: "transparent",
                      width: "5rem",
                      fontSize: "14px",
                    }}
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
