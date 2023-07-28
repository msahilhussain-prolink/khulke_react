import backgroungImg from "./back02.svg";

export const chatListStyle = (context) => {
  return {
    // backgroundColor: `${context.theme.backgroundColor.white}`,
    background: ` url(${backgroungImg}) 0% 0% no-repeat padding-box`,
    zIndex: "1",
    width: "100%",
    flex: "1 1 0",
    order: "2",
    position: "relative",
  };
};

export const listWrapperStyle = () => {
  return {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowX: "hidden",
    overflowY: "scroll",
    position: "absolute",
    top: "0",
    transition: "background .3s ease-out .1s",
    width: "100%",
    zIndex: "100",
    padding: "16px",
  };
};

export const messageDateContainerStyle = () => {
  return {
    marginBottom: "35px",
    width: "85%",
    marginRight: "auto",
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "20px",
    // borderBottom: "2px solid #95A0AB",
    opacity: "0.5",
  };
};

export const messageDateStyle = (context) => {
  return {
    padding: "2px 16px",
    // backgroundColor: `${context.theme.backgroundColor.secondary}`,
    // color: `${context.theme.color.primary}`,
    backgroundColor: "#FFF",
    // color: `${context.theme.color.grouptime}`,
    color: "#000",
    boxShadow: "1px 1px 1px #00000029",
    borderRadius: "14px",
    position: "relative",
    top: "1rem",
    fontSize: "14px",
    marginTop: "-11px",
  };
};

export const decoratorMessageStyle = () => {
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

export const decoratorMessageTxtStyle = (context) => {
  return {
    margin: "0",
    height: "36px",
    color: `${context.theme.color.secondary}`,
    fontSize: "20px!important",
    fontWeight: "600",
    lineHeight: "30px",
  };
};
