import { components } from "react-select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const TimePopperSx = {
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
    marginLeft: "34rem",
    marginTop: "15rem",
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
  "& .MuiTypography-root": {
    fontWeight: "bold",
    color: "#63779c",
    marginLeft: "3px",
  },
  "& .MuiIconButton-edgeEnd": {
    color: "#000000",
  },
};

export const TimeAmPmSx = {
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
    marginLeft: "6rem",
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

export const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img alt="" src={KeyboardArrowDownIcon} />
    </components.DropdownIndicator>
  );
};
