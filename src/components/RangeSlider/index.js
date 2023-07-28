import { Slider } from "@mui/material";
import React from "react";
import { rangeSliderSx } from "../../data";

const RangeSlider = ({ duration, time }) => {
  return (
    <Slider
      aria-labelledby="input-slider"
      size="small"
      value={time}
      min={0}
      max={duration}
      sx={rangeSliderSx}
    />
  );
};

export default RangeSlider;
