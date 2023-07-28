import styled from "styled-components";
import MobileDatePicker from "@mui/lab/MobileDatePicker";

export const MainDiv = styled.div`
  /* width: 100vw;
  max-width: 100vw; */
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.label == "follow" ? "" : "center")};
  /* overflow: hidden; */
  /* border: 1px dotted green; */
  margin: 0 auto;
  overflow: auto;

  @media screen and (max-width: 1300px) {
    width: 100%;
  }
  /* @media screen and (max-width: 768px) {
    width: auto;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0 0rem 0 0rem;
    justify-content: left;
  } */
  @media (max-width: 968px) {
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0 0rem 0 0rem;
  }
  /* @media screen and (min-width: 1400px) {
    justify-content: center;
  }
  @media screen and (min-width: 1600px) {
    justify-content: center;
  }
  @media screen and (min-width: 1980px) {
    justify-content: center;
  } */
`;

export const LeftDiv = styled.div`
  /* border-right: 1px solid ${(props) => props.theme.color.lightGray};
  width: 378px;
  margin-left: -2rem;
  height: 100vh;
  @media screen and (max-width: 960px) {
    display: none;
  } */
  /* border: 1px solid red; */
`;

export const CenterDiv = styled.div`
  flex: 1;
  margin-left: ${(props) =>
    props.label == "maidan" || props.id === 'margin0' ? "" : "1rem !important"};
  margin-right: ${(props) =>
    props.label == "maidan"  ? "" : "1rem"};
  margin-top: ${(props) =>
    props.id === 'margin0' ? "" : "1rem"};
  overflow: ${(props) => (props.label == "maidan" ? "" : "auto !important")};
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    width: 5px;
    padding-left: 5px;
    color: #141414;
  }

  @media screen and (max-width: 960px) {
    min-width: ${(props) =>
      props.label == "maidan" ? "100%" : props.label == "follow" ? "98%" : ""};
    max-width: ${(props) =>
      props.label == "maidan" ? "100%" : props.label == "follow" ? "98%" : ""};
    margin-left: 0rem;
    margin-right: 0rem;
    overflow: ${(props) => props.label === "notification" ? "hidden!important" : ""};
  }

  @media only screen and (min-width: 1200px) {
    min-width: ${(props) =>
      props.label == "maidan" || props.label == "snip-it" ? "" : "600px"};
    max-width: ${(props) =>
      props.label == "maidan" || props.label == "snip-it" ? "" : "600px"};
    overflow: ${(props) => props.label === "notification" ? "hidden!important" : ""
    };
  }

  @media only screen and (min-width: 1400px) {
    max-width: 100%;
  }

  @media only screen and (min-width: 1700px) {
    min-width: ${(props) =>
      props.label == "maidan" || props.label == "snip-it"
        ? ""
        : props.label == "snip-it"
        ? ""
        : ""};
    max-width: ${(props) =>
      props.label == "maidan" || props.label == "snip-it"
        ? ""
        : props.label == "snip-it"
        ? ""
        : ""};
        overflow: ${(props) => props.label === "notification" ? "hidden!important" : ""};

  }
`;

export const RightDiv = styled.div`
  margin-top: 1rem;
  max-width: 350px;
  width: 100%;

  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

export const Title = styled.span`
  font-weight: bold;
  font-size: 1.875rem;
  /* margin-top: 1.688rem; */
`;
export const DatePicker = styled(MobileDatePicker)`
  width: 100%;
  border: 1px solid #d3d6db;
  padding: 0.7rem 0.6rem;
`;
export const MyContentCard = styled.div`
  width: 100%;
  height: 290px;
  padding: 0.1rem;
  overflow: hidden;

  .event_container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      width: 0.3em;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 15px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 15px;
      background-color: darkgrey;
      outline: 1px solid lightgray;
    }
  }
`;

export const MoreLessContent = styled.span`
  display: ${(props) =>
    props.label === "rt" ? (props.isReadMore ? "flex" : "") : "block"};
  font-size: ${(props) => (props.label === "rt" ? "18px" : "")};
  color: ${(props) => (props.label === "rt" ? "#000" : "")};
  white-space: break-spaces;
  user-select: text;
`;

export const MoreLessBtn = styled.span`
  text-decoration: ${(props) => (props.label == "" ? "underline" : "none")};
  cursor: pointer;
  color: ${(props) =>
    props.moreLess == "more" ? props.txtColorM : props.txtColorL};
  font-weight: ${(props) => (props.label == "" ? "" : "bold")};
`;
