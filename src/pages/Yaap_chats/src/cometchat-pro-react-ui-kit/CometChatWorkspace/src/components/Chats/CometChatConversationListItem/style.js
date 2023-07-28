export const listItem = (props) => {
  const selectedState =
    props.selectedConversation &&
    props.selectedConversation.conversationId ===
      props.conversation.conversationId
      ? {
          // backgroundColor: `${props.theme.backgroundColor.primary}`,
          backgroundColor: `${props.theme.backgroundColor.custome}`,
        }
      : {};

  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
    alignItems: "center",
    cursor: "pointer",
    width: "100%",
    padding: "8px 0",
    // margin: "0 0.5rem",
    overflowX: "hidden",
    position: "relative",
    height: "5rem",
    ...selectedState,
    "&:hover": {
      // backgroundColor: `${props.theme.backgroundColor.primary}`,
      backgroundColor: `#85C79D`,
      color: "#fff",
    },
  };
};

export const itemThumbnailStyle = () => {
  return {
    display: "inline-block",
    width: "45px",
    height: "45px",
    flexShrink: "0",
    marginLeft: "0.5rem",
  };
};

export const itemDetailStyle = () => {
  return {
    width: "calc(100% - 45px)",
    flexGrow: "1",
    paddingLeft: "0.5rem",
    "&[dir=rtl]": {
      paddingRight: "16px",
      paddingLeft: "0",
    },
  };
};

export const itemRowStyle = () => {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "calc(100% - 1.8rem)",
  };
};

export const itemNameStyle = (props) => {
  const {conversation} = props;
  const fontWeight = conversation.unreadMessageCount ? "bold" : "normal";
  const color = conversation.unreadMessageCount ? props.theme.color.primary : "#000000";

  return {
    fontWeight,
    fontSize: "16px",
    lineHeight: "19px",
    display: "block",
    width: "60%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color,
    textAlign: "left",
    letterSpacing: "0",
    opacity: "1",
  };
};

export const itemLastMsgStyle = (props) => {
    const {conversation} = props;
    const fontWeight = conversation.unreadMessageCount ? "bold" : "400";
    const color = conversation.unreadMessageCount ? "#000000" : props.theme.color.helpTextNew;
    return {
      margin: "0",
      fontSize: "14px",
      fontWeight,
      width: "calc(100% - 50px)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      lineHeight: "20px",
      color,
      letterSpacing: "0px",
      "&:hover": {
        color: "#fff",
      },
      textAlign: "left",
    };

}

export const itemLastMsgTimeStyle = (props) => {
  const {conversation} = props;
  const color = conversation.unreadMessageCount
    ? props.theme.color.customOrange
    : props.theme.color.helpTextNew;

  return {
    position: "relative",
    fontSize: "11px",
    width: "30%",
    textAlign: "right",
    marginRight: "-12px",
    color,
    top: "-14px",
  };
};

