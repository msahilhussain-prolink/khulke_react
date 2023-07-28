export const messageContainerStyle = () => {
  return {
    alignSelf: "flex-end",
    marginBottom: "6px",
    maxWidth: "65%",
    clear: "both",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flexShrink: "0",
    background: "#F8EFE9 0% 0% no-repeat padding-box",
    borderRadius: "15px 0px 15px 15px",
    padding: "8px 7px 5px 8px",
    boxShadow: "1px 1px 1px #00000029",
    "&::after": {
      borderWidth: "0px 10px 10px 0",
      borderColor: "transparent #fff transparent transparent",
      top: 0,
      left: "-10px",
    },
  };
};

export const messageWrapperStyle = () => {
  return {
    width: "auto",
    alignSelf: "flex-end",
    display: "flex",
    flex: "1 1",
    textAlign: "left",
    alignSelf: "flex-start",
  };
};

export const messageTxtWrapperStyle = (context) => {
  return {
    display: "inline-block",
    borderRadius: "10px",
    // backgroundColor: `${context.theme.primaryColor}`,
    color: `#000`,
    width: "auto",
    boxShadow: `0px 1px 5px #0000000D`,
    borderRadius: "10px 10px 0px 10px",
  };
};

export const messageTxtStyle = (props, showVariation, count) => {
  let emojiAlignmentProp = {
    " > img": {
      width: "24px",
      height: "24px",
      display: "inline-block",
      verticalAlign: "top",
      zoom: "1",
      margin: "0 2px",
    },
  };

  let emojiProp = {};
  let heightProp = {};

  if (count === 1) {
    emojiProp = {
      "> img": {
        width: "48px",
        height: "48px",
      },
    };
    heightProp = {
      height: "48px",
    };
  } else if (count === 2) {
    emojiProp = {
      "> img": {
        width: "36px",
        height: "36px",
      },
    };
    heightProp = {
      height: "36px",
    };
  } else if (count > 2) {
    emojiProp = {
      "> img": {
        width: "24px",
        height: "24px",
      },
    };
  }

  if (showVariation === false) {
    emojiProp = {
      "> img": {
        width: "24px",
        height: "24px",
      },
    };
  }

  return {
    margin: "0",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    textAlign: "left",
    width: "auto",
    ...heightProp,
    " a": {
      color: "#0432FF",
      "&:hover": {
        color: "#04009D",
      },
    },
    " a[href^='mailto:']": {
      color: "#F38C00",
      "&:hover": {
        color: "#F36800",
      },
    },
    " a[href^='tel:']": {
      color: "#3802DA",
      "&:hover": {
        color: "#2D038F",
      },
    },
    ...emojiAlignmentProp,
    ...emojiProp,
  };
};

export const messageInfoWrapperStyle = () => {
  return {
    alignSelf: "flex-end",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "end",
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
