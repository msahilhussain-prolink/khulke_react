export const messageContainerStyle = () => {
  return {
    alignSelf: "flex-start",
    // marginBottom: "16px",
    maxWidth: "65%",
    clear: "both",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flexShrink: "0",
    // paddingLeft: "16px",
    // paddingRight: "16px",
    padding: "8px 7px 8px 8px",
  };
};

export const messageWrapperStyle = () => {
  return {
    width: "auto",
    flex: "1 1",
    alignSelf: "flex-start",
    display: "flex",
  };
};

export const messageThumbnailStyle = () => {
  return {
    width: "36px",
    height: "36px",
    margin: "10px 5px",
    float: "left",
    flexShrink: "0",
  };
};

export const messageDetailStyle = () => {
  return {
    flex: "1 1",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderRadius: "0 10px 10px 10px",
    padding: "8px 7px 8px 8px",
  };
};

export const nameWrapperStyle = (avatar) => {
  const paddingValue = avatar
    ? {
        padding: "3px 5px",
      }
    : {};

  return {
    alignSelf: "flex-start",
    ...paddingValue,
  };
};

export const nameStyle = (context) => {
  return {
    fontSize: "13px",
    color: "#000",
    fontWeight: "600",
    // color: `${context.theme.color.search}`,
  };
};

export const messageFileContainerStyle = () => {
  return {
    width: "auto",
    flex: "1 1",
    alignSelf: "flex-start",
    display: "flex",
  };
};

export const messageFileWrapperStyle = (context) => {
  return {
    display: "inline-block",
    borderRadius: "12px",
    color: `${context.theme.color.secondary}`,
    // backgroundColor: `${context.theme.backgroundColor.secondary}`,
    alignSelf: "flex-start",
    width: "auto",
    "> a": {
      background: "0 0",
      textDecoration: "none",
      backgroundColor: "transparent",
      color: `${context.theme.color.primary}`,
      width: "auto",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:visited, &:active, &:hover": {
        color: `${context.theme.color.primary}`,
        textDecoration: "none",
      },
      label: {
        cursor: "pointer",
      },
    },
  };
};

export const messageInfoWrapperStyle = () => {
  return {
    alignSelf: "flex-end",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "auto",
    marginTop: "8px",
    marginRight: "-15px",
  };
};

export const messageReactionsWrapperStyle = () => {
  return {
    display: "flex",
    alignSelf: "flex-start",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    minHeight: "36px",
  };
};

export const iconStyle = (img, context) => {
  return {
    width: "24px",
    height: "24px",
    display: "inline-block",
    mask: `url(${img}) center center no-repeat`,
    // backgroundColor: `${context.theme.secondaryTextColor}`,
    backgroundColor: `#000`,
    marginRight: "8px",
  };
};
