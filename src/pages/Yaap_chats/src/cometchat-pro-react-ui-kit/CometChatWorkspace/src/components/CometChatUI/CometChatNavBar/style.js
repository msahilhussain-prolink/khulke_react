export const footerStyle = () => {
  return {
    width: "100%",
    zIndex: "1",
    height: "64px",
    display: "none",
  };
};

export const navbarStyle = () => {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "100%",
  };
};

export const itemStyle = (props) => {
  return {
    padding: "8px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    color: `${props.theme.color.helpText}`,
    width: "100%",
  };
};

export const itemLinkStyle = (icon, isActive, context) => {
  let activeStateBg = isActive
    ? {
        backgroundColor: `${context.theme.primaryColor}`,
      }
    : {
        backgroundColor: `${context.theme.secondaryTextColor}`,
      };

  return {
    height: "24px",
    width: "24px",
    display: "inline-block",
    mask: `url(${icon}) no-repeat center center`,
    ...activeStateBg,
  };
};

export const itemLinkTextStyle = (isActive, context) => {
  const colorProp = isActive
    ? {
        color: `${context.theme.primaryColor}`,
      }
    : {
        color: `${context.theme.secondaryTextColor}`,
      };

  return {
    ...colorProp,
    paddingTop: "2px",
  };
};

export const parentMainDiv = () => {
  return {
    height: "calc(100% - 75px)",
  };
};

export const createKlubDiv = () => {
  return {
    padding: "2rem 2rem 0 2rem",
    transition: "all 1s ease",
  };
};

export const createKlubImage = () => {
  return {
    width: "12rem",
    height: "12rem",
    borderRadius: "50%",
    display: "block",
    margin: "0 auto 2rem auto",
  };
};

export const addGroupName = () => {
  return {
    border: "none",
    borderBottom: "2px solid #54B798",
    width: "100%",
    outline: "none",
  };
};
