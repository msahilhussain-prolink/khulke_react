import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const IconContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  .icon_container {
    .selected_icon {
      color: ${(props) => props.theme.color.primary};
    }
    .selected_title {
      color: ${(props) => props.theme.color.black};
    }

    .icon {
      width: 25px;
      height: 25px;
      margin-right: 1rem;
    }
    :hover {
      cursor: pointer;
      color: ${(props) => props.theme.color.primary};
      .nav_title {
        color: ${(props) => props.theme.color.black};
        font-weight: bold;
        transition: 0.3s;
        :hover {
          color: ${(props) => props.theme.color.black};
          font-weight: bold;
          transition: 0.3s;
        }
      }
    }
  }
`;

export const Title = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.color.lynch};
  font-size: 1.125rem;
  font-family: "Work Sans";
  line-height: 0;
`;

export const Notification = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50px;
  text-align: center;
  vertical-align: middle;
  line-height: 25px;
  background-color: ${(props) => props.theme.color.flamingo};
  color: ${(props) => props.theme.color.whiteBackground};
  font-family: "Work Sans";
  font-size: 14px;
`;

const AccountListItem = ({ Icon, title, path, selected, style, openTab }) => {
  return (
    <IconContainer>
      <div className={`icon_container`}>
        {Icon && <Icon className={`icon  ${selected && "selected_icon"}`} />}
        {openTab ? (
          <Title
            style={style}
            to={path}
            className={`nav_title ${selected && "selected_title"}`}
            activeclassname="active"
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </Title>
        ) : (
          <Title
            style={style}
            to={path}
            className={`nav_title ${selected && "selected_title"}`}
            activeclassname="active"
          >
            {title}
          </Title>
        )}
      </div>
    </IconContainer>
  );
};

export default AccountListItem;
