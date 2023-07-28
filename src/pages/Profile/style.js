import styled from "styled-components";

export const MainDiv = styled.div`
  width: 96vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  @media screen and (min-width: 1400px) {
    justify-content: center;
  }
  @media screen and (min-width: 1600px) {
    justify-content: center;
  }
  @media screen and (min-width: 1980px) {
    justify-content: center;
  }
`;

export const LeftDiv = styled.div`
  @media screen and (max-width: 960px) {
    display: none;
  }
`;
export const CenterDiv = styled.div`
  flex: 1;
  // margin-left: 1.875rem;
  // margin-right: 1.875rem;
  /* margin-bottom: 1rem; */
  /* margin-top: 0.5rem; */
  overflow-y: scroll;
  /* min-width: 624px;
  max-width: 624px; */
  width: 100%;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  /* border: 1px solid teal; */
  margin-top: 1.2rem;
  margin-left: 0.5rem;
  ::-webkit-scrollbar {
    width: 5px;
    padding-left: 5px;
  }
  @media (max-width: 1000px) {
    margin-top: 1rem;
  }
`;

export const RightDiv = styled.div`
  margin-top: 1rem;
  width: 360px;
  @media (max-width: 1200px) {
    /* border: 5px solid red; */
    display: none;
  }
`;
