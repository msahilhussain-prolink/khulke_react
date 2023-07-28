import styled from "styled-components";
import Button from "@mui/material/Button";
export const ReminderBtn = styled(Button)`
  border: 1px solid ${(props) => props.theme.color.primary} !important;
  border-radius: 50px !important;
  text-transform: capitalize !important;
  padding: 0.5rem !important;
  margin-top: 1rem;
  color: ${(props) => props.theme.color.primary} !important;
  font-size: 1rem;
  .icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

export const CancelBtn = styled.button`
  border: 1px solid #ed4d29 !important;
  padding: 1rem;
  margin-top: 1rem !important;
  color: #ed4d29 !important;
  width: 200px;
  background-color: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 3.1rem;

  @media only screen and (max-width: 768px) {
    width: 120px;
  }
`;
