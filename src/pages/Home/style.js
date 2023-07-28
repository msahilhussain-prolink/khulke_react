import styled from "styled-components";

export const MainDiv = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
  @media screen and (max-width: 960px) {
    overflow-x: scroll;
    overflow-y: hidden;
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
  padding-left: 1rem;
  border-right: 1px solid #e4e9f0;
  // width: 20%;
  @media (min-width: 481px) and (max-width: 767px) {
    min-width: 0;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    min-width: 0;
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    min-width: 0;
  }
`;
export const CenterDiv = styled.div`
  flex: 1;
  overflow: auto;
  /* margin-top: 1rem; */
  overflow-y: hidden;
  /* min-width: 624px;
  max-width: 768px !important; */
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  margin-right: 10px;
  /* border:2px solid red; */
  ::-webkit-scrollbar {
    width: 5px;
    padding-left: 5px;
    color: #141414;
  }



  /* @media (max-width: 480px) {
    width: 100%;
    min-width: 0;
  }

  @media (min-width: 481px) and (max-width: 767px) {
    min-width: 80%;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    min-width: 564px;
  } */
`;

export const RightDiv = styled.div`
  /* margin-top: 1rem; */
  /* min-width: 260px; */
  /* max-width: 320px; */
  /* max-width: 410px; */
  // width: 20%;
  /* border:1px solid red; */
  width: 100%;
  max-width: 350px;

  @media (max-width: 1200px) {
    /* border: 5px solid red; */
    display: none;
  }
`;

export const Title = styled.p`
  font-weight: bold;
  font-size: 1.875rem;
`;
