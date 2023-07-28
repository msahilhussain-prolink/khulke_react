import { CometChat } from "@cometchat-pro/chat";

export const chatHeaderStyle = (context) => {
  return {
    padding: "16px",
    width: "100%",
    // backgroundColor: `${context.theme.backgroundColor.white}`,
    backgroundColor: "#F4F5F8",
    zIndex: "1",
    borderBottom: `1px solid ${context.theme.borderColor.primary}`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  };
};

export const chatDetailStyle = () => {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "calc(100% - 116px)",
  };
};

export const chatSideBarBtnStyle = (img, props, context) => {
  const displayValue =
    props.hasOwnProperty("sidebar") && props.sidebar === 0
      ? { display: "none!important" }
      : {};

  const mq = [...context.theme.breakPoints];

  return {
    cursor: "pointer",
    display: "none",
    mask: `url(${img}) center center no-repeat`,
    backgroundColor: `${context.theme.primaryColor}`,
    width: "24px",
    height: "24px",
    float: "left",
    [`@media ${mq[1]}, ${mq[2]}`]: {
      display: "block",
    },
    ...displayValue,
  };
};

export const chatThumbnailStyle = () => {
  return {
    display: "inline-block",
    width: "55px",
    height: "55px",
    flexShrink: "0",
    margin: "0 16px",
    marginRight: "10px",
  };
};

export const chatUserStyle = (context) => {
  const mq = [...context.theme.breakPoints];

  return {
    cursor: 'pointer',
    width: "calc(100% - 50px)",
    padding: "0",
    flexGrow: "1",
    display: "flex",
    flexDirection: "column",
    [`@media ${mq[1]}, ${mq[2]}`]: {
      width: "calc(100% - 80px)!important",
    },
  };
};

export const chatNameStyle = (context) => {
  return {
    margin: "0",
    fontSize: "18px",
    fontWeight: "600",
    lineHeight: "22px",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: `${context.theme.primary}`,
  };
};

export const chatStatusStyle = (state, context) => {
  let status = {};
  if (context.type === CometChat.ACTION_TYPE.TYPE_USER) {
    status = {
      color: `${context.theme.color.blue}`,
      textTransform: "capitalize",
    };

    if (state.presence === "offline") {
      status = {
        color: `${context.theme.color.helpText}`,
        textTransform: "capitalize",
      };
    }

    if (state.typing) {
      status = {
        color: `${context.theme.color.helpText}`,
        textTransform: "none",
        fontStyle: "italic",
      };
    }
  } else if (context.type === CometChat.ACTION_TYPE.TYPE_GROUP) {
    status = {
      color: `${context.theme.color.helpText}`,
    };

    if (state.typing) {
      status = {
        color: `${context.theme.color.helpText}`,
        fontStyle: "italic",
      };
    }
  }

  return {
    fontSize: "12px",
    width: "80%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...status,
    letterSpacing: "0.8px",
    marginTop: "5px",
    color: "#7B8793",
  };
};

export const chatOptionWrapStyle = () => {
  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "auto",
    marginRight: "5px",
  };
};

export const chatOptionStyle = (img, context, ongoingCall) => {
  const bgColor = ongoingCall
    ? {
        backgroundColor: `${context.theme.secondaryTextColor}`,
      }
    : {
        // backgroundColor: `${context.theme.primaryColor}`,
        backgroundColor: `#5D6973`,
      };

  return {
    width: "24px",
    height: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    i: {
      width: "24px",
      height: "24px",
      display: "inline-block",
      mask: `url(${img}) center center no-repeat`,
      ...bgColor,
    },
  };
};
