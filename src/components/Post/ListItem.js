import React from "react";
import styled from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import IconButton from "@mui/material/IconButton";

const Container = styled.div`
  display: flex;
  align-items: center;

  .icon_color {
    color: red;
  }
  .num {
    :hover {
      text-decoration: underline;
    }
  }
`;

const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          width: "auto",
        },
      },
    },
  },
});

const ListItem = ({Icon,num,onClick,iconColor,onNumClick,text,disabled,}) => {
  return (
    <Container>
      {Icon && (
        <>
          <ThemeProvider theme={theme}>
            <IconButton
              className="icon_wrapper"
              onClick={onClick}
              disabled={disabled}
              sx={{
                width: "auto",
              }}
            >
              {Icon && (
                <Icon className={` icon ${iconColor && "icon_color"}`} />
              )}
            </IconButton>
          </ThemeProvider>
        </>
      )}
      {text && (
        <p
          style={{
            fontWeight: "550",
            marginRight: "1rem",
            marginTop: "0.8rem",
            userSelect: "none",
          }}
        >
          {text}
        </p>
      )}
      {num && (
        <p
          className="num"
          style={{
            fontWeight: "550",
            marginRight: "1rem",
            marginTop: "0.8rem",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={onNumClick}
        >
          {num}
        </p>
      )}
    </Container>
  );
};

export default ListItem;
