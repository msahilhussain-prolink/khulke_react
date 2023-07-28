import { Button, Card } from "@mui/material";
import styled from "styled-components";

export const PollDiv = styled(Card)`
  border-radius: 0.5rem;
  max-width: 500px;
  margin-left: 4rem;
  border: 1px solid lightgrey;
  //   margin-top: -1rem;
  padding: 0px;

  @media only screen and (max-width: 600px) {
    max-width: 400px;
    margin-left: 0rem;
  }

  @media only screen and (min-width: 600px) and (max-width: 767px) {
    max-width: 400px;
    margin-left: 0rem;
  }
`;

export const PollBtn = styled(Button)`
  width: 132px !important;
  border-radius: 5px !important;
  background-color: ${(props) => props.theme.color.secondary} !important;
  padding: 1.2rem !important;
  text-transform: capitalize !important;
  color: ${(props) => props.theme.color.white} !important;
  outline: none;
  border: none;
  height: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  margin-top: 30px !important;
  margin-bottom: 20px !important;
`;
