import styled from "styled-components";
import Button from "@mui/material/Button";
// import { style } from "@mui/system";

export const MainDiv = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
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

  @media only screen and (max-width: 768px) {
    min-width: 100%;
    margin-left: 0;
    padding: 0 15px;
    height: 88%;
  }
`;

export const RightDiv = styled.div`
  margin-top: 1rem;
  min-width: 260px;
  max-width: 320px;
  display: none;

  // @media screen and (max-width: 968px) {
  //   display: none;
  // }
`;

export const Title = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 1.1rem;
  margin-left: 0.8rem;
`;
export const Deactive_btn = styled(Button)`
  border: 1px solid #ed4d29 !important;
  border-radius: 50px !important;
  text-transform: capitalize !important;
  padding: 0.5rem !important;
  margin-top: 1rem !important;
  color: #ed4d29 !important;
  font-size: 0.7rem;
  width: 10rem;
`;
