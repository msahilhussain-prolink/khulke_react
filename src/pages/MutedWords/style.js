import styled from "styled-components";
import { Button } from "@mui/material";

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
  @media (max-width: 768px) {
    min-width: unset;
  }
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
  margin-left: 0.8rem;
`;

export const MuteBtn = styled.div`
  border: 1px solid #66b984;
  color: #66b984;
  padding: 1rem;
  text-align: center;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
`;

export const Unmute = styled(Button)`
  border-radius: 50px !important;
  background-color: ${(props) => props.theme.color.primary} !important;
  padding: 1rem !important;
  text-transform: capitalize !important;
  color: ${(props) => props.theme.color.white} !important;
  min-width: 80px !important;
  outline: none !important;
  border: none !important;
  height: 30px !important;
  cursor: pointer !important;
  font-weight: bold !important;
  font-size: 14px !important;
`;

export const WordList = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  align-items: flex-start;
`;
