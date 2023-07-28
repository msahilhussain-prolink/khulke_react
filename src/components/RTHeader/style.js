import styled from "styled-components";
import { IconButton, Box } from "@mui/material";

export const Logo = styled.img`
  height: 75px;
  width: 75px;
`;

export const RTKhulkeLogo = styled.img`
  height: 54px;
  width: 54px;
`;

export const TimeImg = styled.img`
  width: 20px;
  height: 20px;
`;

export const CommentDiv = styled.div`
  width: 100%;
  // min-height: 400px;
  border-radius: 10px;
  border: 1px solid lightgray;
  margin-top: 1rem;
  // margin-left: 0.4rem;
  // padding: 0.4rem;
  background-color: white;
  padding: 10px 0;
`;

export const UserAvatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 0.5rem;
  cursor: pointer;
`;

export const Avatar = styled.img`
  width: 30px;
  height: 30px;
`;

export const Starchats = styled.div`
  background-color: #e4e9f0;
  border-radius: 10px;
  padding: 1rem;
`;

export const MenuContainer = styled(IconButton)`
  width: 40px !important;
  height: 40px !important;
  border-radius: 50px !important;
`;

export const Menu = styled(Avatar)`
  width: 30px !important;
  height: 30px !important;
  // margin-left: 0.6rem
`;

export const Visibility = styled.small`
  visibility: hidden;
  user-selects: none;
`;

export const CancelBtn = styled.button`
  border: 1px solid #ed4d29 !important;
  padding: 0.5rem !important;
  margin-top: 1rem !important;
  color: #ed4d29 !important;
  width: 200px;
  background-color: transparent;
  border-radius: 8px;

  @media only screen and (max-width: 768px) {
    width: 100px;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  .btn_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

export const Button = styled.button`
  width: 200px;
  height: 50px;
  outline: none;
  border-radius: 5px;
  color: ${(props) => (props.primary ? props.theme.color.primary : "white")};
  background-color: ${(props) =>
    props.bgColor ? props.theme.color.secondary : "white"};
  border: 2px solid
    ${(props) =>
      props.primary ? props.theme.color.primary : props.theme.color.secondary};

  @media only screen and (max-width: 768px) {
    width: 100px;
  }
`;

export const StyledBox = styled(Box)`
  width: 400px !important;
  height: 72px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  border: 1px solid lightgrey !important;
  border-radius: 1rem !important;
  display: flex !important;
  padding: 0.5rem !important;
  align-items: center !important;
  margin-top: 0.7rem !important;
  justify-content: space-evenly !important;

  .MuiFilledInput-root {
    height: 64px !important;
    border-radius: 0.4rem !important;
    background: #f5f7f8 0% 0% no-repeat padding-box !important;
    font-size: 1rem !important;
    font-weight: bold !important;
  }
  .MuiSelect-select {
    background: #f5f7f8 0% 0% no-repeat padding-box !important;
  }
  .Mui-disabled {
    color: black !important;
    -webkit-text-fill-color: black !important;
  }
  .MuiSvgIcon-root {
    font-size: 1.5rem;
  }

  @media only screen and (max-width: 768px) {
    width: 100% !important;
  }
`;
