export const messageContainerStyle = () => {
  return {
    alignSelf: "flex-end",
    marginBottom: "16px",
    maxWidth: "65%",
    clear: "both",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flexShrink: "0",
    background: "#DEFFE6",
    borderRadius: "4",
    padding: "8px 7px 8px 8px",
    boxShadow: "2px 2px 6px #0000001A",
  };
};

export const messageWrapperStyle = () => {
  return {
    width: "auto",
    flex: "1 1",
    alignSelf: "flex-end",
    display: "flex",
    marginBottom: "10px",
  };
};

export const messageFileWrapper = (context) => {
  return {
    display: "inline-block",
    borderRadius: "12px",
    // backgroundColor: `${context.theme.primaryColor}`,
    backgroundColor: `#DEFFE6`,
    color: `${context.theme.color.white}`,
    alignSelf: "flex-end",
    maxWidth: "100%",
    ".message__file": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "0 0",
      textDecoration: "none",
      color: `${context.theme.color.white}`,
      maxWidth: "100%",
      fontSize: "14px",
      "&:visited, &:active, &:hover": {
        color: `${context.theme.color.white}`,
        textDecoration: "none",
      },
      "> p": {
        margin: "0",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        textAlign: "left",
        width: "100%",
        fontSize: "14px",
        marginLeft: "8px",
        color: `#000`,
      },
    },
  };
};

export const messageInfoWrapperStyle = () => {
  return {
    alignSelf: "flex-end",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",

    height: "auto",
  };
};

export const messageReactionsWrapperStyle = () => {
  return {
    display: "flex",
    alignSelf: "flex-end",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    minHeight: "36px",
  };
};

export const iconStyle = (img, context) => {
  return {
    width: "24px",
    height: "24px",
    display: "inline-block",
    mask: `url(${img}) center center no-repeat`,
    // backgroundColor: `${context.theme.color.white}`,
    backgroundColor: `#000`,
    flexShrink: "0",
  };
};
