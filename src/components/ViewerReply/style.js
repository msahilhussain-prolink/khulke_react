import styled from "styled-components";
import { Button } from "@mui/material";

export const ReplyDiv = styled.div`
  padding-left: 2rem;
  display: flex;
  flex-direction: column;

  .reply_header {
    display: flex;
    flex-direction: column;

    div {
      display: flex;
      p {
        opacity: 0.5;
        margin-right: 0.4rem;
      }
    }
    hr {
      margin: 0;
      padding: 0;
      opacity: 0.2;
    }
  }
  .reply_body {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;

    .post_card {
      margin-top: 0;
    }
    .reply_input_container {
      display: flex;
      margin-top: 1rem;
      width: 100%;
    }
  }

  .reply_footer {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }

  @media only screen and (max-width: 600px) {
    padding-left: 0px;
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
  min-width: 120px !important;
  border-radius: 50px !important;
  background-color: ${(props) => props.theme.color.secondary} !important;
  padding: 1rem !important;
  text-transform: capitalize !important;
  color: ${(props) => props.theme.color.white} !important;
  min-width: 80px;
  outline: none;
  border: none;
  height: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
`;
