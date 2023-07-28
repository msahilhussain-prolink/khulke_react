import styled from "styled-components";

export const MainDiv = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  @media (max-width: 968px) {
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0 0rem 0 0rem;
  }
`;

export const unifiedStyle = (props) => {
  const mq = [...props.theme.breakPoints];

  return {
    display: "flex",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: `${props.theme.fontFamily}`,
    border: `1px solid ${props.theme.borderColor.primary}`,
    borderBottom: "none",
    position: "relative",
    "*": {
      boxSizing: "border-box",
      fontFamily: `${props.theme.fontFamily}`,
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
    [`@media ${mq[0]}`]: {
      height: "92%",
    },
  };
};

export const unifiedSubSidebarStyle = (state, props) => {
  const sidebarView = state.sidebarview
    ? {
        left: "0",
        boxShadow: "rgba(0, 0, 0, .4) -30px 0 30px 30px",
      }
    : {};

  const mq = [...props.theme.breakPoints];

  return {
    width: "280px",
    borderRight: `1px solid ${props.theme.borderColor.primary}`,
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    "> .contacts, .chats, .groups, .userinfo": {
      height: "calc(100% - 64px)",
    },
    [`@media ${mq[0]}`]: {
      position: "absolute!important",
      left: "-100%",
      top: "0",
      bottom: "0",
      width: "100%!important",
      zIndex: "2",
      backgroundColor: `${props.theme.backgroundColor.white}`,
      transition: "all .3s ease-out",
      ...sidebarView,
    },
  };
};

export const unifiedSidebarStyle = (state, props) => {
  const sidebarView = state.sidebarview
    ? {
        left: "0",
        boxShadow: "rgba(0, 0, 0, .4) -30px 0 30px 30px",
      }
    : {};

  const mq = [...props.theme.breakPoints];

  return {
    width: "300px",
    borderRight: `1px solid ${props.theme.borderColor.primary}`,
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    // padding: "0 1rem",
    "> .contacts, .chats, .groups, .userinfo": {
      height: "calc(100% - 64px)",
    },
    [`@media ${mq[0]}`]: {
      position: "absolute!important",
      left: "-100%",
      top: "0",
      bottom: "0",
      width: "100%!important",
      zIndex: "2",
      backgroundColor: `${props.theme.backgroundColor.white}`,
      transition: "all .3s ease-out",
      ...sidebarView,
      boxShadow: "none",
    },
  };
};

export const unifiedMainStyle = (state, props) => {
  const mq = [...props.theme.breakPoints];

  return {
    width: "calc(100% - 280px)",
    height: "100%",
    order: "2",
    display: "flex",
    flexDirection: "row",
    [`@media ${mq[1]}, ${mq[2]}`]: {
      width: "100%",
    },
  };
};

export const yappImageStyleDiv = () => {
  return {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
};

export const yappImageStyle = () => {
  return {
    width: "100%",
    maxWidth: "200px",
  };
};
