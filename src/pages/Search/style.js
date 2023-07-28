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
  margin-bottom: 1rem;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    margin-left: 0.3rem;
    margin-right: 0rem;
  }

  @media only screen and (min-width: 768px) {
    margin-left: 3rem;
    margin-right: 1rem;
  }
`;

export const RightDiv = styled.div`
  margin-top: 1rem;
  min-width: 260px;
  max-width: 320px;

  @media screen and (max-width: 968px) {
    display: none;
  }
`;

export const Title = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 1.1rem;
  margin-left: 0.5rem;
`;
