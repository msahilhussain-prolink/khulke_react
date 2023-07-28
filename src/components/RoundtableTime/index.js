import React, { useEffect, useState } from "react";
import moment from "moment";
import Select from "react-select";

// Assets
import Schedule from "../../assets/icons/schedule.svg";
import { allWords } from "../../App";
// Data
import { Hours, Minutes, dateHashMap } from "../../data";

const customCodeStyles = {
  control: (base) => ({
    ...base,
    borderColor: "#F5F7F8",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#63779c", // Custom colour
  }),

  valueContainer: (base) => ({
    ...base,
    justifyContent: "space-between",
    width: "60px",
    padding: "10px",
    fontSize: "1.25rem",
    height: "100%",
    fontWeight: "bolder",
    backgroundColor: "#F5F7F8",
    border: "none !important",
    outline: "none !important",
  }),
  indicatorContainer: (base) => ({
    ...base,
    padding: "0px",
    border: "none",
    marginRight: "20px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#63779c",
    border: "none",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
  }),

  menuList: (base) => ({
    "::-webkit-scrollbar": {
      width: "6px",
      height: "0px",
    },
    ...base,
    fontWeight: "bold",
    height: "180px",
    backgroundColor: "white",
    width: "70px !important",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#999999" : null,
      color: "#333333",
      border: "none",
      textAlign: "center",
    };
  },
};

export default function RoundtableTime(props) {
  const {
    start_hr,
    start_min,
    end_hr,
    setEndHr,
    end_min,
    setEndMin,
    updateStartMin,
    startAm,
    setStartAm,
    startPm,
    setStartPm,
    endAm,
    setEndAm,
    endPm,
    setEndPm,
    url_rt_id,
    wip_rt_id,
    value,
    setValue,
    setCurrentMonth,
    sendData,
    hr_has_changed,
    setHrHasChanged,
    hr_default_hit,
    setHrDefaultHit,
    handleStartHr,
    handleStartMin,
    parsed_data,
  } = props;

  let date_obj = new Date();
  const [start_time_default, setStartTimeDefault] = useState(
    moment(new Date()).add(30, "minutes").format("hh:mm")
  );
  const [end_time_default, setEndTimeDefault] = useState(
    moment(new Date()).add(1, "hour").format("hh:mm")
  );

  useEffect(() => {
    if (!url_rt_id) {
      let date_mon_number = date_obj.getMonth();
      setCurrentMonth(dateHashMap[1 + date_mon_number]);

      //Setting default hours and minutes for  start and end time
      handleStartHr({
        label: start_time_default.split(":")[0],
        value: start_time_default.split(":")[0],
      });
      handleStartMin({
        label: start_time_default.split(":")[1],
        value: start_time_default.split(":")[1],
      });
      handleEndHr({
        label: end_time_default.split(":")[0],
        value: end_time_default.split(":")[0],
      });
      handleEndMin({
        label: end_time_default.split(":")[1],
        value: end_time_default.split(":")[1],
      });

      if (moment(date_obj).add(30, "minutes").format("A") === "AM") {
        setStartAm(true);
        setStartPm(false);
      } else if (moment(date_obj).add(30, "minutes").format("A") === "PM") {
        setStartAm(false);
        setStartPm(true);
      }
      if (moment(date_obj).add(1, "hour").format("A") === "AM") {
        setEndAm(true);
        setEndPm(false);
      } else if (moment(date_obj).add(1, "hour").format("A") === "PM") {
        setEndAm(false);
        setEndPm(true);
      }
    }
  }, []);

  useEffect(() => {
    if (url_rt_id || wip_rt_id) {
      if (sendData?.length !== 0) {
        const start_time = sendData?.["start_time"];
        const end_time = sendData?.["end_time"];
        let end_time_data = end_time.split(":");
        let endTimeMin = end_time_data[1].split(" ");
        let s_value = start_time.split(":");
        let s_min = s_value[1].split(" ");
        handleStartHr({
          label: s_value[0],
          value: s_value[0],
        });
        handleStartMin({
          label: s_min[0],
          value: s_min[0],
        });
        handleEndHr({
          label: end_time_data[0],
          value: end_time_data[0],
        });
        handleEndMin({
          label: endTimeMin[0],
          value: endTimeMin[0],
        });
        if (s_min[1] === "PM") {
          setStartPm(true);
          setStartAm(false);
        } else if (s_min[1] === "AM") {
          setStartPm(false);
          setStartAm(true);
        }
        if (endTimeMin[1] === "PM") {
          setEndAm(false);
          setEndPm(true);
        } else if (endTimeMin[1] === "AM") {
          setEndAm(true);
          setEndPm(false);
        }
      } else {
        if (parsed_data) {
          if (moment(parsed_data?.start?.split("+")[0]).format("A") === "AM") {
            setStartAm(true);
            setStartPm(false);
          } else if (
            moment(parsed_data?.start?.split("+")[0]).format("A") === "PM"
          ) {
            setStartAm(false);
            setStartPm(true);
          }
          if (moment(parsed_data?.end?.split("+")[0]).format("A") === "AM") {
            setEndAm(true);
            setEndPm(false);
          } else if (
            moment(parsed_data?.end?.split("+")[0]).format("A") === "PM"
          ) {
            setEndAm(false);
            setEndPm(true);
          }

          setCurrentMonth(
            moment(parsed_data?.start?.split("+")[0]).format("MMM")
          );
          handleStartHr({
            label: moment(parsed_data?.start?.split("+")[0]).format("hh"),
            value: moment(parsed_data?.start?.split("+")[0]).format("hh"),
          });
          handleStartMin({
            label: moment(parsed_data?.start?.split("+")[0]).format("mm"),
            value: moment(parsed_data?.start?.split("+")[0]).format("mm"),
          });
          handleEndHr({
            label: moment(parsed_data?.end?.split("+")[0]).format("hh"),
            value: moment(parsed_data?.end?.split("+")[0]).format("hh"),
          });
          handleEndMin({
            label: moment(parsed_data?.end?.split("+")[0]).format("mm"),
            value: moment(parsed_data?.end?.split("+")[0]).format("mm"),
          });
        }
      }
    }
  }, []);
  const auto_adjust = () => {
    //Automatically increment ET by 30 mins

    try {
      let start_hr_format = parseInt(start_hr.start_hr.value); //02 pm
      let start_min_format = parseInt(start_min.start_min.value); //32
      let start_date = value;
      if (!value) {
        start_date = Date();
      }
      if (start_hr_format < 12 && startPm) {
        start_hr_format += 12;
      }
      if (start_hr_format === 12 && startAm) {
        start_hr_format = 0;
      }

      const rt_selected_date = new Date(start_date);
      rt_selected_date.setHours(start_hr_format, start_min_format);
      const rt_end_time = moment(rt_selected_date)
        .add(30, "minutes")
        .format("hh:mm:A")
        .split(":");
      if (hr_has_changed) {
        handleEndHr({
          label: rt_end_time[0],
          value: rt_end_time[0],
        });
        handleEndMin({
          label: rt_end_time[1],
          value: rt_end_time[1],
        });
      }
      if (rt_end_time[2] === "AM") {
        setEndAm(true);
        setEndPm(false);
      } else {
        setEndAm(false);
        setEndPm(true);
      }

      if (hr_has_changed) {
        setValue(start_date);
      }
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    try {
      let start_hr_format = parseInt(start_hr.start_hr.value); //02 pm
      let start_min_format = parseInt(start_min.start_min.value); //32
      let start_date = value;
      if (!value) {
        start_date = Date();
      }
      if (start_hr_format < 12 && startPm) {
        start_hr_format += 12;
      }
      if (start_hr_format === 12 && startAm) {
        start_hr_format = 0;
      }

      const rt_start_date = new Date(start_date);
      rt_start_date.setHours(start_hr_format, start_min_format);

      let end_hr_format = parseInt(end_hr.end_hr.value); //02 pm
      let end_min_format = parseInt(end_min.end_min.value); //32
      let end_date = value;
      if (!value) {
        end_date = Date();
      }
      if (end_hr_format < 12 && startPm) {
        end_hr_format += 12;
      }
      if (end_hr_format === 12 && startAm) {
        end_hr_format = 0;
      }

      const rt_end_date = new Date(end_date);
      rt_end_date.setHours(end_hr_format, end_min_format);

      if (Math.abs(moment(rt_start_date).diff(rt_end_date, "minutes")) < 29) {
        auto_adjust();
      }
    } catch (err) {
      return;
    }
  }, [start_hr, start_min, end_hr, end_min]);

  // Update time every minute
  useEffect(() => {
    let interval = "";
    let timeout = "";
    if (!url_rt_id && !wip_rt_id) {
      if (!hr_has_changed) {
        const setDefault = () => {
          const start_time = moment(new Date())
            .add(30, "minutes")
            .format("hh:mm");
          const end_time = moment(new Date()).add(1, "hour").format("hh:mm");

          setStartTimeDefault(start_time);
          setEndTimeDefault(end_time);

          handleStartHr({
            label: start_time.split(":")[0],
            value: start_time.split(":")[0],
          });
          handleStartMin({
            label: start_time.split(":")[1],
            value: start_time.split(":")[1],
          });
          handleEndHr({
            label: end_time.split(":")[0],
            value: end_time.split(":")[0],
          });
          handleEndMin({
            label: end_time.split(":")[1],
            value: end_time.split(":")[1],
          });
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
  }, [hr_has_changed]);

  const handleEndHr = (end_hr) => {
    if (!hr_default_hit) {
      setHrHasChanged(true);
    }
    if (hr_default_hit) {
      setHrDefaultHit(false);
    }

    setEndHr({ end_hr });
  };

  const handleEndMin = (end_min) => {
    if (!hr_default_hit) {
      setHrHasChanged(true);
    }
    if (hr_default_hit) {
      setHrDefaultHit(false);
    }

    setEndMin({ end_min });
  };

  const onStartAm = () => {
    setStartAm(!startAm);
    setStartPm(false);
  };

  const onStartPm = () => {
    setStartAm(false);
    setStartPm(!startPm);
  };

  const onEndAm = () => {
    setEndAm(!endAm);
    setEndPm(false);
  };

  const onEndPm = () => {
    setEndAm(false);
    setEndPm(!endPm);
  };

  return (
    <>
      <div
        className="d-flex justify-content-between"
        style={{
          marginTop: "1rem",
        }}
      >
        {/* Start Time Div */}
        <div className="timediv">
          {/* Upper Subdiv  */}
          <div className="setime">
            <img src={Schedule} alt="" />
            <div
              style={{
                fontSize: "14px",
                color: "var(--muted-dark-color)",
                marginLeft: "0.3rem",
              }}
            >
              {allWords.misc.review.Starttm}
            </div>
          </div>

          {/* Lower Subdiv  */}
          <div className="d-flex justify-content-center">
            <div className="start_hour_cont">
              <Select
                closeMenuOnSelect={true}
                value={start_hr["start_hr"]}
                onChange={handleStartHr}
                options={Hours}
                components={{
                  IndicatorSeparastor: () => null,
                  IndicatorsContainer: () => null,
                }}
                styles={customCodeStyles}
                defaultValue={{
                  label: "12",
                  value: "12",
                }}
              />

              <small className="abso_m_h abso_h_only">h</small>
            </div>
            &nbsp;
            <small
              style={{
                fontWeight: "bolder",
                fontSize: "18px",
                marginTop: "25px",
                textShadow: "0px 0px 1px black",
              }}
            >
              :
            </small>
            &nbsp;
            <div className="d-flex justify-content-between start_hour_cont">
              <Select
                closeMenuOnSelect={true}
                value={start_min["start_min"]}
                onChange={handleStartMin}
                options={Minutes}
                components={{
                  IndicatorSeparastor: () => null,
                  IndicatorsContainer: () => null,
                }}
                placeholder=""
                styles={customCodeStyles}
                defaultValue={{
                  label: updateStartMin ? updateStartMin : "12",
                  value: updateStartMin ? updateStartMin : "12",
                }}
              />
              <small className="abso_m_h">m</small>
            </div>
            &nbsp;
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "5rem",
                width: "4rem",
                borderRadius: "8px",
                backgroundColor: "#F5F7F8",
                marginLeft: "6px",
              }}
            >
              <h6
                className={startAm ? "AmPm AmPm_toggle" : "AmPm"}
                onClick={onStartAm}
              >
                AM
              </h6>
              <h6
                className={startPm ? "AmPm AmPm_toggle" : "AmPm"}
                onClick={onStartPm}
              >
                PM
              </h6>
            </div>
          </div>
        </div>

        {/* End Time Div  */}
        <div className="timediv">
          {/* Upper Subdiv  */}
          <div className="setime">
            <img src={Schedule} alt="" />
            <div
              style={{
                fontSize: "14px",
                color: "var(--muted-dark-color)",
                marginLeft: "0.3rem",
              }}
            >
              End Time
            </div>
          </div>

          {/* Lower Subdiv  */}
          <div className="d-flex justify-content-center">
            <div className="d-flex justify-content-center">
              <div className="start_hour_cont">
                <Select
                  value={end_hr["end_hr"]}
                  onChange={handleEndHr}
                  options={Hours}
                  closeMenuOnSelect={true}
                  components={{
                    IndicatorSeparastor: () => null,
                    IndicatorsContainer: () => null,
                  }}
                  placeholder=""
                  styles={customCodeStyles}
                  defaultValue={{ label: "01", value: "01" }}
                />
                <small className="abso_m_h abso_h_only">h</small>
              </div>
              &nbsp;
              <small
                style={{
                  fontWeight: "bolder",
                  fontSize: "18px",
                  marginTop: "25px",
                  textShadow: "0px 0px 1px black",
                }}
              >
                :
              </small>
              &nbsp;
              <div className="start_hour_cont">
                <Select
                  value={end_min["end_min"]}
                  onChange={handleEndMin}
                  options={Minutes}
                  closeMenuOnSelect={true}
                  components={{
                    IndicatorSeparastor: () => null,
                    IndicatorsContainer: () => null,
                  }}
                  placeholder=""
                  styles={customCodeStyles}
                  defaultValue={{ label: "00", value: "00" }}
                />
                <small className="abso_m_h">m</small>
              </div>
              &nbsp;
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "5rem",
                  width: "4rem",
                  marginLeft: "6px",
                  borderRadius: "8px",
                  backgroundColor: "#F5F7F8",
                }}
              >
                <h6
                  className={endAm ? "AmPm AmPm_toggle" : "AmPm"}
                  onClick={onEndAm}
                >
                  AM
                </h6>
                <h6
                  className={endPm ? "AmPm AmPm_toggle" : "AmPm"}
                  onClick={onEndPm}
                >
                  PM
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
