import React from "react";
import styled from "styled-components";

const CustomButton = styled.button`
  min-height: 50px;
  border: none;
  border-radius: 0.3rem;
  text-align: center;
  font-family: normal normal normal 16px/19px Work Sans;
  letter-spacing: 0px;
  color: #ffffff;
  text-transform: uppercase;
  opacity: 1;
  background-color: ${(props) => props.theme.color.secondary};
  :hover {
    background-color: ${(props) => props.theme.color.primary};
  }
`;

const Button = ({ ...props }) => {
  return <CustomButton className="shadow-none" {...props} />;
};

export default Button;
