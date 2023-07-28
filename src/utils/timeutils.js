import moment from "moment";

//seconds to time conversion with minimum two digits
export const returnMinString = (val) => {
  return moment.duration(val * 1000).minutes();
};

export const returnSecondString = (val) => {
  return moment.duration(val * 1000).seconds();
};

export const returnHourString = (val) => {
  return moment.duration(val * 1000).hours();
};

export const returnTimeString = (val) => {
  if (val < 60) {
    return `${returnSecondString(val)} sec`;
  }
  return `${returnMinString(val)}:${returnSecondString(val)} min`;
};

export const returnFullTimeString = (val) => {
  let hour = `${returnHourString(val)}`;
  let mins = `${returnMinString(val)}`;
  let sec = `${returnSecondString(val)}`;

  if (!hour) hour = "00";
  if (!mins) mins = "00";
  if (!sec) sec = "00";

  if (hour.length < 2) hour = `0${hour}`;
  if (mins.length < 2) mins = `0${mins}`;
  if (sec.length < 2) sec = `0${sec}`;

  return hour === "00" ? `${mins}:${sec}` : `${hour}:${mins}:${sec}`;
};
