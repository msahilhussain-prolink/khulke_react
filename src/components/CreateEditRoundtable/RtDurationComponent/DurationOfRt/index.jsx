import React from "react";
import Select from "react-select";

import {
  customStyles1,
  customStyles2,
  getDurationHoursOption,
  getDurationMinsOption,
} from "../sx";
import { allWords } from "../../../../App";
import { useDispatch, useSelector } from "react-redux";
import { createEditRoundtableInitialize } from "../../../../redux/actions/createEditRoundtable";

export default function DurationOfRt() {
  const dispatch = useDispatch();
  const durationHr = useSelector(
    (state) => state.createEditRoundtable.durationHr
  );
  const durationMin = useSelector(
    (state) => state.createEditRoundtable.durationMin
  );

  const handleDurHr = (hr_value) => {
    dispatch(createEditRoundtableInitialize({ durationHr: hr_value }));

    if (parseInt(hr_value?.label) === 24) {
      handleDurMin({
        label: `0 ${allWords.misc.livert.m}`,
        value: "0",
      });
    } else if (parseInt(hr_value?.label) === 0) {
      handleDurMin({
        label: `30 ${allWords.misc.livert.m}`,
        value: "30",
      });
    }
  };

  const handleDurMin = (min_value) => {
    dispatch(createEditRoundtableInitialize({ durationMin: min_value }));
  };

  return (
    <div>
      <div className="mb-3">
        <small className="rt-strong-labels-gray">
          {allWords.misc.duration}
        </small>
      </div>

      <div className="d-flex">
        <Select
          closeMenuOnSelect={true}
          value={durationHr["hr_value"] || durationHr}
          onChange={handleDurHr}
          options={getDurationHoursOption(allWords)}
          components={{
            IndicatorSeparator: () => null,
          }}
          styles={customStyles2}
          defaultValue={{
            label: `0 ${allWords.misc.livert.h}`,
            value: "0 Hour",
          }}
        />
        &emsp;
        <Select
          closeMenuOnSelect={true}
          value={
            parseInt(durationHr?.["hr_value"]?.["label"]) === 24
              ? { label: `0 ${allWords.misc.livert.m}`, value: "0" }
              : durationMin["min_value"] || durationMin
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
          defaultValue={{
            label: `30 ${allWords.misc.livert.m}`,
            value: "30 Minutes",
          }}
        />
      </div>
    </div>
  );
}
