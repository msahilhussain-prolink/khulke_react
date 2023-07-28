import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import UserProfile from "../UserProfile";

const IconContainer = styled.div`
  width: 100%;
  /* height: 50px; */
  margin-top: 0.563rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;

  @media (max-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
  }
  /* @media (min-width: 481px) and (max-width: 767px) {
    flex-direction: row;
    justify-content: flex-end;
  }
  @media (min-width: 768px) and (max-width: 968px) {
    flex-direction: row;
    justify-content: flex-end;
  } */

  .icon_container {
    padding: 10px 20px 15px 10px;
    .selected_icon {
      color: ${(props) => props.theme.color.primary};
    }
    .selected_title {
      font-weight: bold;
      color: ${(props) => props.theme.color.black};
    }

    .icon {
      width: 25px;
      height: 25px;
      margin-right: 1rem;
    }
    :hover {
      background-color: #f0f4f8;
      border-radius: 10px;
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
  :hover {
    background-color: #f0f4f8;
    border-radius: 10px;
    cursor: pointer;
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
`;

export const Title = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.color.lynch};
  font-size: 1.125rem;
  font-family: "Work Sans";
  @media (max-width: 480px) {
    display: inline-flex;
  }
  @media (min-width: 481px) and (max-width: 767px) {
    display: none;
  }
  @media screen and (min-width: 969px) {
    display: inline-flex;
  }
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
  font-size: 12px;
  align-self: center;
  margin-top: -5px;
`;

const ListItem = ({
  Icon,
  title,
  username,
  path,
  notifications,
  selected,
  iconColor,
  onClick,
  style,
  comp,
  className,
  txt,
}) => {

  return (
    <IconContainer className={className} onClick={onClick}>
      <div className="icon_container">
        <Link to={path} style={{ textDecoration: "none" }}>
          {Icon && !comp && (
            <>
              {txt !== "profile" ? (
                <img
                  alt=""
                  src={Icon}
                  className={`icon  ${selected && "selected_icon"}  ${
                    iconColor && "iconColor"
                  }`}
                  style={{ borderRadius: txt === "profile" ? 8 : 0 }}
                />
              ) : (
                <>
                  <UserProfile username={username} />{" "}
                </>
              )}
            </>
          )}
        </Link>
        <Link to={path}>
          {comp && (
            <Icon
              className={`icon  ${selected && "selected_icon"}  ${
                iconColor && "iconColor"
              }`}
              style={style}
            />
          )}
        </Link>
        <Title
          to={path}
          className={`nav_title ${selected && "selected_title"}`}
          activeclassname="active"
        >
          {title}
        </Title>
      </div>
      {notifications && <Notification>{notifications}</Notification>}
    </IconContainer>
  );
};

export default ListItem;
