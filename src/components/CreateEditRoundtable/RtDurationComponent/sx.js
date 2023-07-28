export const popperSx = {
  "& .MuiButtonBase-root": {
    fontWeight: "bold",
    fontSize: "14px",
    width: "40px",
  },
  "& .MuiButtonBase-root.Mui-disabled": {
    border: "transparent",
  },
  "& .MuiPaper-root": {
    borderRadius: "10px",
    marginLeft: "200px",
    marginTop: "15px",
  },
  "& .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd, .MuiIconButton-sizeSmall.MuiIconButton-edgeStart":
    {
      border: "1px solid #e4e9f0",
      width: "auto",
      paddingLeft: "0",
    },
  "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
    color: "#fff",
    backgroundColor: "#66b984",
    fontWeight: "bold",
    border: "1px solid var(--muted-gray-color)",
    borderRadius: "10px",
  },
  "& .MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected):not(.Mui-disabled)":
    {
      borderRadius: "10px",
    },
  "& .MuiTypography-root": {
    fontWeight: "bold",
    color: "#63779c",
    marginLeft: "3px",
  },
  "& .MuiIconButton-edgeEnd": {
    color: "#000000",
  },
};

export const amPmSx = {
  "& .MuiButtonBase-root": {
    fontWeight: "bold",
    fontSize: "14px",
    width: "40px",
  },
  "& .MuiButtonBase-root.Mui-disabled": {
    border: "transparent",
  },
  "& .MuiPaper-root": {
    borderRadius: "10px",
    marginLeft: "70px",
    marginTop: "-150px",
  },
  "& .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd, .MuiIconButton-sizeSmall.MuiIconButton-edgeStart":
    {
      border: "1px solid #e4e9f0",
      width: "auto",
    },
  "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
    color: "#fff",
    backgroundColor: "#66b984",
    fontWeight: "bold",
    border: "1px solid var(--muted-gray-color)",
    borderRadius: "10px",
  },
  "& .MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected):not(.Mui-disabled)":
    {
      borderRadius: "10px",
    },
  "& .MuiTimePickerToolbar-ampmLabel.Mui-selected": {
    color: "#fff",
    backgroundColor: "#66b984",
    fontWeight: "bold",
    border: "1px solid var(--muted-gray-color)",
    borderRadius: "18px",
    padding: "5px",
  },
  "& .MuiDialogActions-root": {
    display: "none",
  },
  "& .MuiClockPicker-root": {
    marginTop: "-16px",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "transparent",
  },
};

export const customStyles1 = {
  dropdownIndicator: (base) => ({
    ...base,
    color: "#000", // Custom colour
  }),
  valueContainer: (base) => ({
    ...base,
    justifyContent: "space-between",
    height: "40px",
    fontSize: "14px",
  }),
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "-5px",
    width: "8rem",
    height: "39px",
  }),
  indicatorContainer: (base) => ({
    ...base,
    padding: "0px",
    marginRight: "20px",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "1em",
    color: "#11141C",
    fontWeight: 400,
  }),
  menu: (base) => ({
    ...base,
    height: "150px",
    backgroundColor: "white",
  }),
  menuList: (base) => ({
    ...base,
    height: "150px",
    backgroundColor: "white",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled ? "#fff" : isFocused ? "#999999" : null,
      color: isDisabled ? "#999999" : "#333333",
    };
  },
};

export const customStyles2 = {
  dropdownIndicator: (base) => ({
    ...base,
    color: "#000", // Custom colour
  }),
  valueContainer: (base) => ({
    ...base,
    justifyContent: "space-between",
    height: "40px",
    fontSize: "14px",
  }),
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "-5px",
    width: "8rem",
    height: "38.5px",
  }),
  indicatorContainer: (base) => ({
    ...base,
    padding: "0px",
    marginRight: "20px",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "1em",
    color: "#11141C",
    fontWeight: 400,
  }),
  menu: (base) => ({
    ...base,
    height: "150px",
    backgroundColor: "white",
  }),
  menuList: (base) => ({
    ...base,
    height: "150px",
    backgroundColor: "white",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#999999" : null,
      color: "#333333",
    };
  },
};

export const getDurationHoursOption = (allW) => {
  return [
    { label: ` 0 ${allW.misc.livert.h}`, value: "0" },
    { label: ` 1 ${allW.misc.livert.h}`, value: "1" },
    { label: ` 2 ${allW.misc.livert.h}`, value: "2" },
    { label: ` 3 ${allW.misc.livert.h}`, value: "3" },
    { label: ` 4 ${allW.misc.livert.h}`, value: "4" },
    { label: ` 5 ${allW.misc.livert.h}`, value: "5" },
    { label: ` 6 ${allW.misc.livert.h}`, value: "6" },
    { label: ` 7 ${allW.misc.livert.h}`, value: "7" },
    { label: ` 8 ${allW.misc.livert.h}`, value: "8" },
    { label: ` 9 ${allW.misc.livert.h}`, value: "9" },
    { label: ` 10 ${allW.misc.livert.h}`, value: "10" },
    { label: ` 11 ${allW.misc.livert.h}`, value: "11" },
    { label: ` 12 ${allW.misc.livert.h}`, value: "12" },
    { label: ` 13 ${allW.misc.livert.h}`, value: "13" },
    { label: ` 14 ${allW.misc.livert.h}`, value: "14" },
    { label: ` 15 ${allW.misc.livert.h}`, value: "15" },
    { label: ` 16 ${allW.misc.livert.h}`, value: "16" },
    { label: ` 17 ${allW.misc.livert.h}`, value: "17" },
    { label: ` 18 ${allW.misc.livert.h}`, value: "18" },
    { label: ` 19 ${allW.misc.livert.h}`, value: "19" },
    { label: ` 20 ${allW.misc.livert.h}`, value: "20" },
    { label: ` 21 ${allW.misc.livert.h}`, value: "21" },
    { label: ` 22 ${allW.misc.livert.h}`, value: "22" },
    { label: ` 23 ${allW.misc.livert.h}`, value: "23" },
    { label: ` 24 ${allW.misc.livert.h}`, value: "24" },
  ];
};

export const getDurationMinsOption = (allW) => {
  return [
    { label: ` 0 ${allW.misc.livert.m}`, value: "0" },
    { label: ` 15 ${allW.misc.livert.m}`, value: "15" },
    { label: `30 ${allW.misc.livert.m}`, value: "30" },
    { label: ` 45 ${allW.misc.livert.m}`, value: "45" },
  ];
};

export const DatePickerBox = {
  display: "flex",
  alignItems: "center",
  border: "1px solid rgba(211, 214, 219, 1)",
  borderRadius: "0.5rem",
  marginTop: "-0.4rem",
  padding: "0.7rem 0.6rem",
  height: "40px",
};
