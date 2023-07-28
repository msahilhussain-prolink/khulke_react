import styled from "styled-components";
import { Button } from "@mui/material";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* max-width: 500px; */
  /* min-width: 500px; */
  .input_container {
    display: flex;
    align-items: start;
    p {
      opacity: 0.5;
    }
  }
  .post_container {
    padding: 1rem;
    margin-left: 3rem;
    border: 2px dashed ${(props) => props.theme.color.lightGray};
    margin-top: 0.2rem;
    border-radius: ${(props) => props.theme.borderRadius};

    .post_card {
      margin-top: 0;
    }

    @media only screen and (max-width: 768px) {
      margin-left: 0rem;
      padding: 0rem;
    }
  }
  .icon_container {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
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

export const AddPostBtn = styled(Button)`
  min-width: 132px !important;
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
  margin-top: 10px !important;
`;
