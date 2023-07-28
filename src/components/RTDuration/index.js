import React from "react";

// Components
import Duration from "./Duration";
import Time from "./Time";

import "./style.css";
import InfoIcon from "../InfoIcon";
import moment from "moment";
import { allWords } from "../../App";

export default function RTDuration(props) {
  const {
    dateValue,
    setDateValue,
    timeValue,
    setTimeValue,
    datePicker,
    durationHr,
    setDurationHr,
    durationMin,
    setDurationMin,
    handleDurHr,
    handleDurMin,
    url_rt_id,
    wip_rt_id,
    schedule,
    setSchedule,
    location,
  } = props;

  return (
    <>
      <div className="d-flex justify-space-between">
        <div className="mb-3" style={{ marginTop: "20px" }}>
          <small className="rt-strong-labels-gray">
            {allWords.misc.selectSche}
            <span>
              <InfoIcon
                infoTitle2={allWords.misc.sche1}
                infoTitle3={allWords.misc.sche2}
                infoTitle4={allWords.misc.sche3}
              />
            </span>
          </small>
        </div>
        &emsp;&emsp;&emsp;&emsp;&emsp;
        <div
          className="laterSoon"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="btn-container">
            <label className="switch btn-schedule-switch">
              <input
                type="checkbox"
                name="schedule_type"
                id="schedule_type"
                value={schedule}
                checked={schedule}
                onChange={(e) => {
                  setSchedule(e.target.checked);
                }}
                onClick={() => {
                  if (schedule === false)
                    return setTimeValue(moment(new Date()).add(30, "minutes"));
                }}
              />
              <label
                for="schedule_type"
                data-on={allWords.misc.later}
                data-off={allWords.misc.now}
                className="btn-schedule-switch-inner"
              ></label>
            </label>
          </div>
        </div>
      </div>

      <div className="justify-space-between rt-duration-div">
        {(schedule === true || schedule === undefined) && (
          <>
            <Time
              dateValue={dateValue}
              setDateValue={setDateValue}
              timeValue={timeValue}
              setTimeValue={setTimeValue}
              datePicker={datePicker}
              url_rt_id={url_rt_id}
              wip_rt_id={wip_rt_id}
            />{" "}
            &emsp;&emsp;
          </>
        )}
        {location?.state?.rt_page !== "record" && (
          <Duration
            durationHr={durationHr}
            setDurationHr={setDurationHr}
            durationMin={durationMin}
            setDurationMin={setDurationMin}
            handleDurHr={handleDurHr}
            handleDurMin={handleDurMin}
          />
        )}
      </div>
    </>
  );
}
