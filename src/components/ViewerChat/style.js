import styled from "styled-components";
import { IconButton, Avatar } from "@mui/material";

export const MyContentCard = styled.div`
  width: 100%;
  /* min-width: 470px; */
  border-radius: 4px;
  padding: 0.2rem;
  /* margin-top: 1rem; */
  overflow: hidden;
  // overflow: hidden;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 15px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 15px;
    background-color: #aebdd3;
    outline: 1px solid lightgray;
  }

  .event_container {
    width: 100%;
    height: 92%;
  }
`;

export const ViewersDiv = styled.div`
  width: 100%;
  border-bottom: 1px solid lightgray;
  margin-top: 0.2rem;
  padding: 0.03rem;
`;

export const Header = styled.div`
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // border: 1px solid blue;
`;
export const SubHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
  /* border: 1px solid green; */
`;
export const SubHeaderMain = styled.div`
  display: flex;
  align-items: center;
  /* border: 1px solid red; */
`;
export const UserNameContainer = styled.div`
  display: flex;
  opacity: 0.8;
  margin-top: -3px;
  font-size: 0.8rem !important;
  .dot_icon {
    opacity: 0.8;
    margin-top: 0.2rem;
  }
  p {
    opacity: 0.8;
  }
`;
export const FullNameInPanel = styled.div`
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  margin-top: -2px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 10rem;
`;
export const UserAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 0.5rem;
  cursor: pointer;
  // margin-top: -10px;
  object-fit: cover;
`;

export const MenuContainer = styled(IconButton)`
  width: 40px !important;
  height: 40px !important;
  border-radius: 50px !important;
`;

export const Menu = styled(Avatar)`
  width: 30px !important;
  height: 30px !important;
  margin-top: 0;
`;

export const Footer = styled.div`
  width: 86%;
  display: flex;
  justify-content: space-between;

  margin: auto 3rem;
`;

export const CommentDiv = styled.div`
  display: flex;
  width: 100%;
  border-radius: 10px;
  border: 1px solid lightgray;
  margin-top: 0.2rem;
  background-color: white;
  align-items: center;
  justify-content: space-around;
`;

export const Body = styled.div`
  width: 76%;
  padding-top: 5px;
  margin: auto 4rem;
`;

export const CmtTitle = styled.p`
  /* line-height: 1.6; */
  font-family: "Work Sans";
  font-size: ${(props) => props.theme.font.small};
  padding: 0px;
  /* margin: 0px; */
  word-wrap: break-word;
  white-space: pre-wrap;
  color: black;
  // text-decoration: underline;
`;

export const CmtContent = styled.div`
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
`;

export const CmtImgContainer = styled.img`
  width: 100%;
  /* max-height: 320px; */
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 3px;
  object-fit: cover;
  height: 100px;
`;

export const PostContent = styled.div`
  // margin-top: 0.4rem;
  // margin-left: 10px;
`;

// export const PostImgContainer = styled.img`
//   width: 100%;
//   max-height: 320px;
//   border-radius: 0.5rem;
//   cursor: pointer;
// `;

export const PostImgContainer = styled.img`
  width: 100%;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 3px;
  object-fit: cover;
  height: 100px;
`;
