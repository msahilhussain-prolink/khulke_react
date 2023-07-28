import styled from "styled-components";
import { Button } from "@mui/material";

export const MainDiv = styled.div`
  width: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;

  .input_container {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .main_container {
    flex: 1 !important;
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

  ::placeholder {
    color: ${(props) => props.theme.color.lynch};
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

export const AddPostBtn = styled(Button)`
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
