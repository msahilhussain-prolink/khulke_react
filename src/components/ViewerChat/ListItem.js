import React from "react";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import "./style.css";

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  /* border: 1px solid blue; */
  padding: 0;
  margin: 0;

  .icon_color {
    color: red;
  }
`;

const ListItem = ({
  Icon,
  num,
  onClick,
  iconColor,
  onNumClick,
  text,
  disabled,
  notSmall,
  iconName = "",
}) => {
  return (
    <Container
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {Icon && (
        <IconButton
          size={notSmall == true ? "medium" : "small"}
          className="icon_wrapper"
          onClick={onClick}
          disabled={disabled}
          style={{
            margin: "0px",
          }}
        >
          {Icon && (
            <Icon
              className={` icon ${iconColor && "icon_color"}`}
              style={{
                width: iconName === "" ? "100%" : "",
                height: iconName === "" ? "100%" : "",
                marginTop: "3px",
                padding: 0,
              }}
            />
          )}
        </IconButton>
      )}
      {text && (
        <p
          style={{
            fontWeight: "550",
            userSelect: "none",
            margin: "0px",
            marginRight: "15px",
          }}
        >
          {text}
        </p>
      )}
      {num && (
        <p
          className="num"
          style={{
            fontWeight: "bold",
            margin: "0px",
            marginRight: "15px",
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
