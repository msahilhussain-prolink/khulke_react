import styled from "styled-components";

export const MainDiv = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
`;

export const LeftDiv = styled.div`
  @media screen and (max-width: 960px) {
    display: none;
  }
`;
export const CenterDiv = styled.div`
  flex: 1;
  margin-left: 1.875rem;
  margin-right: 1.875rem;
  margin-bottom: 1rem;
  overflow-y: scroll;
  min-width: 624px;
  max-width: 624px;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const RightDiv = styled.div`
  width: 360px;
  @media (max-width: 1200px) {
    display: none;
  }
`;

export const Title = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
`;
