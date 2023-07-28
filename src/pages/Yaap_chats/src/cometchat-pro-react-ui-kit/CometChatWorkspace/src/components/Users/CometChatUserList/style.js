import { height } from "@mui/system";

const displayFlex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const displayFlexFunc = () => displayFlex;

export const contactWrapperStyle = (props, theme) => {
  const borderStyle =
    props._parent === ""
      ? {
          border: `1px solid ${theme.borderColor.primary}`,
        }
      : {};

  return {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    ...borderStyle,
    "*": {
      boxSizing: "border-box",
      "::-webkit-scrollbar": {
        width: "8px",
        height: "4px",
      },
      "::-webkit-scrollbar-track": {
        background: "#ffffff00",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#ccc",
        "&:hover": {
          background: "#aaa",
        },
      },
    },
  };
};

export const contactHeaderStyle = (theme) => {
  return {
    padding: "3rem 0 2.5rem",
    margin: "0 1rem",
    position: "relative",
    display: "flex",
    alignItems: "center",
    borderBottom: `1px solid ${theme.borderColor.primary}`,
    height: "70px",
  };
};

export const contactHeaderCloseStyle = (img, theme) => {
  const mq = [...theme.breakPoints];

  return {
    cursor: "pointer",
    display: "none",
    mask: `url(${img}) left center no-repeat`,
    backgroundColor: `${theme.secondaryTextColor}`,
    height: "24px",
    width: "33%",
    [`@media ${mq[1]}, ${mq[2]}`]: {
      display: "block!important",
    },
  };
};

export const contactHeaderTitleStyle = (props) => {
  const alignment =
    props.hasOwnProperty("enableCloseMenu") && props.enableCloseMenu.length > 0
      ? {
          width: "33%",
          textAlign: "center",
        }
      : {};

  return {
    margin: "0",
    fontWeight: "700",
    display: "inline-block",
    width: "100%",
    textAlign: "left",
    fontSize: "32px",
    lineHeight: "26px",
    ...alignment,
    "&[dir=rtl]": {
      textAlign: "right",
    },
    cursor: "pointer",
  };
};

export const contactSearchStyle = () => {
  return {
    margin: "16px",
    position: "relative",
    borderRadius: "8px",
    boxShadow: "rgba(20, 20, 20, 0.04) 0 0 0 1px inset",
    backgroundColor: "rgba(20, 20, 20, 0.04)",
    height: "35px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
};

export const contactSearchButtonStyle = (img, theme) => {
  return {
    width: "30px",
    height: "100%",
    padding: "8px 0 8px 8px",
    cursor: "default",
    mask: `url(${img}) 10px center no-repeat`,
    backgroundColor: `${theme.secondaryTextColor}!important`,
  };
};

export const contactSearchInputStyle = (props) => {
  return {
    width: "calc(100% - 30px)",
    padding: "8px",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "20px",
    outline: "none",
    border: "none",
    height: "100%",
    color: props.theme.color.search,
    backgroundColor: "transparent",
  };
};

export const contactMsgStyle = () => {
  return {
    overflow: "hidden",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%",
  };
};

export const contactMsgTxtStyle = (theme) => {
  return {
    margin: "0",
    minHeight: "36px",
    color: `${theme.color.secondary}`,
    fontSize: "20px!important",
    fontWeight: "600",
    lineHeight: "30px",
    wordWrap: "break-word",
    padding: "0 16px",
  };
};

export const contactListStyle = () => {
  return {
    // height: "calc(100% - 125px)",
    // overflowY: "auto",
    height: "600px",
    overflowY: "scroll",
    margin: "0",
    padding: "0",
  };
};

export const contactAlphabetStyle = (props) => {
  return {
    padding: "0 16px",
    margin: "5px 0",
    width: "100%",
    fontSize: "12px",
    fontWeight: "500",
    lineHeight: "20px",
    color: `${props.theme.color.tertiary}`,
  };
};

export const selectMembersMainDiv = () => {
  return {
    display: "flex",
    justifyContent: "space-between",
    minHeight: "3rem",
    height: "auto",
    padding: "0 0.8rem",
  };
};

export const selectMembersDiv = () => {
  return {
    ...displayFlex,
    cursor: "pointer",
  };
};
export const selectMembersImg = () => {
  return {
    width: "1.8rem",
  };
};
export const selectMembersPara = () => {
  return {
    marginBottom: 0,
    marginLeft: "0.5rem",
    color: "#54B798",
  };
};

export const listOfUsers = () => {
  return {
    padding: "0.1rem 0.3rem",
    border: "0.5px solid #DBE5ED",
    borderRadius: "20px",
    ...displayFlex,
    justifyContent: "space-between",
    margin: "5px",
    minWidth: "7rem",
    width: "auto",
  };
};

export const userDetails = () => {
  return {
    ...displayFlex,
    justifyContent: "space-between",
    width: "75%",
  };
};
export const userImage = () => {
  return {
    width: "2rem",
    display: "inline-block",
  };
};

export const listOfUsersPara = () => {
  return {
    marginBottom: 0,
    overflow: "hidden",
    textOverflow: "elipsis",
  };
};
