import styled from "styled-components";
import { Button } from "@mui/material";

export const ReplyDiv = styled.div`
  /* max-width: 500px; */
  /* min-width: 500px; */
  padding-left: 2rem;
  display: flex;
  flex-direction: column;

  .reply_header {
    // margin-left: 1.5rem;
    display: flex;
    flex-direction: column;

    div {
      display: flex;
      p {
        opacity: 0.5;
        /* margin-right: 0.4rem; */
        padding: 0px;
        margin: 0px;
      }
    }
    hr {
      margin-top: 0.5rem;
      padding: 0;
      opacity: 0.2;
    }
  }
  .reply_body {
    /* width: 100%; */
    // margin-left: 1.5rem;
    display: flex;
    flex-direction: column;
    /* margin-top: 1rem; */

    .post_card {
      margin-top: 0;
    }
    .reply_input_container {
      display: flex;
      margin-top: 1rem;
    }
  }
`;

export const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 0.5rem;
`;

export const Input = styled.input`
  flex: 1;
  outline: none;
  border: none;
  padding: 0.8rem;
`;

export const PostBtn = styled(Button)`
  min-width: 132px !important;
  border-radius: 60px !important;
  background-color: ${(props) => props.theme.color.secondary} !important;
  padding: 1rem !important;
  text-transform: capitalize !important;
  color: ${(props) => props.theme.color.white} !important;
  min-width: 80px;
  outline: none;
  border: none;
  height: 30px;
  cursor: pointer;
  font-weight: 500 !important;
  font-size: 14px;
`;
