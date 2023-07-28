import { withStyles } from "@material-ui/core/styles";
import { Checkbox } from "@mui/material";

export const CustomColorCheckbox = withStyles({
  root: {
    color: "#66B984 !important",
    "&$checked": {
      color: "#66B984 !important",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export const AddMore = { borderRadius: "10px", margin: "0 0 0 auto" };

export const RadioStyles = {
  "&.Mui-checked": {
    color: "var(--success-color)",
  },
  "&.MuiFormControlLabel-root": {
    marginLeft: "5px",
  },
  "& .MuiSvgIcon-root": {
    height: 20,
    width: 20,
  },
};

export const ChangeIcon = { color: "#7AB788", marginRight: "0.2rem" };

export const DoneStyles = {
  backgroundColor: "var(--success-color)",
  color: "var(--white)",
  padding: "0.5rem 2rem",
  height: "2.5rem",
};

export const ExpandMoreStyle = { color: "#7AB788" };

export const CancelPreview = {
  border: "1px solid #F15B29",
  textDecoration: "none",
  height: "2.5rem",
  padding: "0.8rem 4rem",
};

export const CancelForEdit = {
  border: "1px solid #F15B29",
  textDecoration: "none",
  height: "2.5rem",
  padding: "0.8rem 2rem",
};

export const CreateStyle = {
  background: "var(--secondary-heading-color)",
  color: "var(--white)",
  height: "2.5rem",
  padding: "0.8rem 4rem",
};
export const CreateStyleForEdit = {
  background: "var(--secondary-heading-color)",
  color: "var(--white)",
  height: "2.5rem",
  padding: "0.8rem 2rem",
};

export const LiveLottie = { width: "48px", height: "16px" };

export const ReadMorePropsStyle = {
  background: "var(--muted-gray-color)",
  padding: window.innerWidth === 1200 ? "0.5rem" : "1rem",
  borderRadius: "16px",
  maxHeight: "5rem",
  wordBreak: "break-word",
};

export const ReadMoreStyle = {
  color: "#000",
  fontWeight: "600",
  textDecoration: "none",
};
export const textSpanStyles = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: "1",
  WebkitBoxOrient: "vertical",
  width: "70%",
};

export const SelectedOptionsStyle = {
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px 0 0 10px",
    borderRight: "1px solid transparent",
    maxHeight: "2.54rem",
    display: "flex",
    padding: "0.1rem",
    width: "100%",
    justifyContent: "space-between",
  }),
  option: (styles, { isFocused }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#fff" : "#fff",
      color: "#333333",
    };
  },
  menu: (base) => ({
    ...base,
    width: window.screen.width <= 768 ? "21.5rem" : "96%",
    marginLeft: "3px",
    backgroundColor: "white",
  }),
  menuList: (base) => ({
    ...base,
    width: window.screen.width <= 768 ? "21.5rem" : "100%",
    marginLeft: "3px",
    backgroundColor: "white",
  }),
  singleValue: (base) => ({
    ...base,
    maxWidth: "max-content",
    border: "1px solid #D3D6DB",
    borderRadius: "10px",
    marginLeft: "5px",
    padding: "5px 10px",
    backgroundColor: "#E3E3E3",
    color: "#000",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#63779C",
    fontFamily: "WorkSans-Regular",
  }),
};

export const manageInvitationStyle = {
  border: "1px solid #66B984",
  color: "#66B984",
  background: "#fff",
  padding: "0.8rem 3rem",
};

export const done_for_now = {
  background: "#000",
  color: "#fff",
  padding: "0.8rem 4.2rem",
};

export const backdropStyle = {
  color: "#fff",
  zIndex: (theme) => theme.zIndex.drawer + 1,
};

export const stylesForAddBtn = { borderRadius: "10px", margin: "0 0 0 auto" };
export const stylesForAddBtnDisabled = {
  borderRadius: "10px",
  margin: "0 0 0 auto",
  opacity: "0.5",
};

export const stylesForRemoveBtn = {
  borderRadius: "10px",
  margin: "0 0 0 auto",
  color: "var(--alert-color)",
  border: "1px solid var(--alert-color)",
  backgroundColor: "transparent",
  padding: "0.5rem 2.2rem",
};

export const rtBackdrop = {
  color: "#fff",
  zIndex: (theme) => theme.zIndex.drawer + 1,
};
