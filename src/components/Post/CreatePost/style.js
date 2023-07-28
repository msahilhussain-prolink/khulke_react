import styled from "styled-components";
import { Button } from "@mui/material";

export const CardContainer = styled.div`
  padding: 0.8rem 0.8rem;
  width: "auto";
  align-items: center;
  border-radius: 8px;
  border: 1px solid lightgrey;
  /* border-bottom: 1px solid lightgrey; */
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
  margin-left: 0.5rem;
  margin-right: 1rem;
  overflow: auto;
  @media (max-width: 480px) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
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

export const IconContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  .icon_container {
    display: flex;
    flex: 1;
  }
`;
export const AddPostBtn = styled(Button)`
  width: 106px !important;
  border-radius: 5px !important;
  background-color: ${(props) => props.theme.color.secondary} !important;
  padding: 1rem !important;
  text-transform: capitalize !important;
  color: ${(props) => props.theme.color.white} !important;
  outline: none;
  border: none;
  height: 35px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
`;
