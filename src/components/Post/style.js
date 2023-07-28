import styled from "styled-components";
import { IconButton, Avatar } from "@mui/material";

export const PostDiv = styled.div`
  width: 100%;
  /* min-height: 400px; */
  border-radius: 0.5rem;
  /* border: 1px solid red; */
  margin-top: 1rem;
  padding: 0.2rem;
  cursor: pointer;
`;
export const Header = styled.div`
  width: 100%;
  padding: 0.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const SubHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.7rem;
`;
export const SubHeaderMain = styled.div`
  display: flex;
  align-items: center;
`;
export const UserNameContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  /* border: 1px solid pink; */
  opacity: 0.8;

  width: max-content;
  .dot_icon {
    opacity: 0.8;
    margin-top: 0.4rem;
    font-size: 10px;
  }
  p {
    opacity: 0.8;
  }
`;

export const UserAvatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 0.5rem;
  cursor: pointer;
  z-index: 0;
`;

export const MenuContainer = styled(IconButton)`
  width: 40px !important;
  height: 40px !important;
  border-radius: 50px !important;
`;

export const Menu = styled(Avatar)`
  width: 30px !important;
  height: 30px !important;
`;
export const Body = styled.div`
  width: 100%;
  padding-right: 0.6rem;
  padding-left: 0.6rem;
  // padding-bottom: 1rem;
`;

export const PostTitle = styled.p`
  line-height: 1.6;
  font-family: "Work Sans";
  font-size: ${(props) => props.theme.font.small};
  word-wrap: break-word;
  white-space: pre-wrap;
`;
export const PostContent = styled.div`
  margin-top: 0.4rem;
`;

export const PostImgContainer = styled.img`
  width: auto;
  max-width: 100%;
  /* min-height: 220px; */
  /* max-height: 220px; */
  border-radius: 0.5rem;
  cursor: pointer;
  padding-bottom: 5px !important;
  max-height: 60vh;
  height: 100%;
`;
export const PostMultiImgContainer = styled.img`
  width: 100%;
  /* min-height: 220px; */
  /* max-height: 220px; */
  border-radius: 0.5rem;
  cursor: pointer;
  height: 220px;
  object-fit: cover;
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
`;

export const PostAudioContainer = styled.div`
  .img {
    width: 100%;
    border-radius: 0.5rem;
    object-fit: cover;
    max-height: 300px;
  }
`;

export const PollingContainer = styled.div`
  width: 100%;
  height: 40px;
  margin-top: 1rem;
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : null};
  align-items: center;
  cursor: pointer;
  border: ${(props) => (props.border ? "2px solid lightblue" : null)};
  // background-color: ${(props) => (props.bgColor ? props.bgColor : null)};
  border-radius: 0.5rem;
`;

export const PollingInnerContainer = styled.div`
  width: ${(props) =>
    props.width
      ? props.width === "0"
        ? "0.3rem"
        : props.width + "%"
      : "0.3rem"};
  height: 40px;
  margin-top: 1px;
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : null};
  align-items: center;
  cursor: pointer;
  border: ${(props) => (props.border ? "2px solid lightblue" : null)};
  background-color: ${(props) => (props.bgColor ? props.bgColor : null)};
  border-radius: 0.5rem;
  position: relative;
  left: 0px;
`;
