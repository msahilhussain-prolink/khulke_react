import styled from "styled-components";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";

export const MainContainer = styled(Container)`
  max-width: 100vw;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;

  .grid_container {
    width: 100%;
    margin-top: 2rem;
    .left_side_grid_container {
      height: 65vh;
      padding: 1rem;
      border-radius: 1rem;
      border: 1px solid lightgray;
      margin-right: 1rem;
      width: calc(100% - 10px);
      aspect-ratio: 16/9;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .left_below_div {
      height: 20vh;
      padding: 1rem;
      border-radius: 1rem;
      border: 1px solid lightgray;
      margin-right: 1rem;
      width: calc(100% - 10px);
      aspect-ratio: 16/9;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .right_side_grid_container {
      /* padding: 0.5rem; */
      background: #f0f4f8 !important;
      border-radius: 10px;

      .title {
        color: #161f3a;
        padding-left: 1rem;
        margin-bottom: 0 !important;
        font-size: 1.45rem;
        text-transform: capitalize;
      }
      .audience_interaction_container {
        padding: 0.5rem;
        width: 100%;
        height: 75vh;
        overflow: hidden;
        overflow-y: scroll;
        ::-webkit-scrollbar {
          width: 0rem;
        }
      }
    }
    @media (max-width: 768px) {
      .right_side_grid_container {
        background: #fff !important;
        height: 53vh;
        margin-left: 0.5rem;
        width: 370px;
      }
    }

    @media (min-width: 1200px) and (max-width: 1440px) {
      max-width: 1200px;
    }
  }
`;

export const Logo = styled.img`
  height: 50px;
  width: 50px;
`;

export const HeaderDiv = styled(Container)`
  max-width: 100vw;
  width: 100%;
  height: 98px;
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  padding: 0px !important;
  margin: 0px !important;

  .header-title-past {
    color: #161f3a;
    padding-left: 1rem;
    margin-bottom: 0 !important;
    font-size: 1.45rem;
    text-transform: capitalize;
    margin-right: 2rem;
    align-self: center;
  }

  @media (max-width: 768px) {
    display: block !important;
  }

  @media (min-width: 1200px) and (max-width: 1440px) {
    max-width: 1200px;
  }

  @media (min-width: 1441px) {
    max-width: 100vw;
  }
`;

export const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// post

export const PostCard = styled(Card)`
  border: 1px solid lightgray !important;
  border-radius: 0.5rem !important;
  margin-top: 0.4rem !important;
  .MuiCardHeader-avatar {
    border-radius: 0.5rem !important;
  }
  .MuiCardHeader-title {
    font-weight: bold !important;
    font-size: 1rem;
  }
  .MuiCardHeader-subheader {
    :hover {
      color: blue !important;
      cursor: pointer;
    }
  }
`;

export const TimeImg = styled.img`
  width: 26px;
  height: 26px;
  margin-left: 5px;
  margin-right: 0.5rem;
`;

export const ImgWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ImgContainer = styled.img`
  width: 100%;
  height: 100%;
  max-height: 200px;
  max-width: 200px;
`;
export const IconMenuContainer = styled.img`
  width: 100%;
  height: 100%;
  max-height: 32px;
  max-width: 32px;
`;

export const DownloadContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const FileNameDiv = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;
export const SubHeaderMain = styled.div`
  display: flex;
  align-items: center;
`;
export const SubHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
  /* border: 1px solid green;  */
  /* padding-top: 4px; */
`;

export const UserAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: -5px;
`;
export const FullNameInPanel = styled.div`
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  margin-top: 4px;
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
