export const messageContainerStyle = () => {
  return {
    alignSelf: "flex-end",
    marginBottom: "16px",
    maxWidth: "100%",
    clear: "both",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flexShrink: "0",
    background: "#DEFFE6",
    borderRadius: "10px 10px 0 10px",
    padding: "8px 8px 7px 8px",
    boxShadow: "2px 2px 6px #0000001A",
    // paddingLeft: "16px",
    // paddingRight: "16px",
  };
};

export const messageWrapperStyle = () => {
  return {
    width: "auto",
    flex: "1 1",
    alignSelf: "flex-end",
    display: "flex",
  };
};

export const messageAudioWrapperStyle = () => {
  return {
    display: "inline-block",
    borderRadius: "12px",
    alignSelf: "flex-end",
    " > audio": {
      maxWidth: "250px",
      display: "inherit",
      outline: "none",
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
