export const messageContainerStyle = () => {
  return {
    alignSelf: "flex-end",
    marginBottom: "16px",
    paddingLeft: "16px",
    paddingRight: "16px",
    maxWidth: "65%",
    clear: "both",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flexShrink: "0",
    background: "#DEFFE6",
    borderRadius: "10px 10px 0 10px",
    padding: "8px 8px 7px 8px",
    boxShadow: "2px 2px 6px #0000001A",
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

export const messageVideoWrapperStyle = () => {
  return {
    display: "inline-block",
    alignSelf: "flex-end",
    " > video": {
      maxWidth: "250px",
      borderRadius: "12px",
      display: "inherit",
    },
    padding: "4px",
    background: "#DEFFE6",
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
