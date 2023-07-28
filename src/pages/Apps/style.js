import styled from "styled-components";
import Button from "@mui/material/Button";
import { style } from "@mui/system";

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
  margin-left: 3rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  margin-top: 0.1rem;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none;
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
  margin-left: 0.8rem
`;

export const TwitterTxt = styled.p`
  color:#25BCF5;
  font-size: 2rem;
  font-weight: 400;
`;

export const TwitterDiv = styled.div`
  background-color:#F7FAFD;
  text-align-last:center;
  margin-top:3rem;
  border-radius:0.5rem
`;

