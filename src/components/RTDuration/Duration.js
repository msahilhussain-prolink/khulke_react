import React from "react";
import Select from "react-select";

import {
  customStyles1,
  customStyles2,
  durationHours,
  durationMins,
  getDurationHoursOption,
  getDurationMinsOption,
} from "./sx";
import { allWords } from "../../App"

export default function Duration(props) {
  const { durationHr, durationMin, handleDurHr, handleDurMin } = props;

  return (
    <div>
      <div className="mb-3" style={{ marginTop: "15px" }}>
        <small className="rt-strong-labels-gray">{allWords.misc.duration}</small>
      </div>

      <div className="d-flex">
        <Select
          closeMenuOnSelect={true}
          value={durationHr["hr_value"]}
          onChange={handleDurHr}
          options={getDurationHoursOption(allWords)}
          components={{
            IndicatorSeparator: () => null,
          }}
          styles={customStyles2}
          defaultValue={{ label: `0 ${allWords.misc.livert.h}`, value: "0 Hour" }}
        />
        &emsp;
        <Select
          closeMenuOnSelect={true}
          value={
            parseInt(durationHr?.["hr_value"]?.["label"]) === 24
              ? { label: `0 ${allWords.misc.livert.m}`, value: "0" }
              : durationMin["min_value"]
          }
          onChange={handleDurMin}
          options={getDurationMinsOption(allWords)}
          isDisabled={
            parseInt(durationHr?.["hr_value"]?.["label"]) === 24 ? true : false
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
      </div>
    </div>
  );
}
