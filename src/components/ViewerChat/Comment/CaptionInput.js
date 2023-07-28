import React from "react";
import styled from "styled-components";

const Input = styled.input`
  width: ${(props) => props.fullWidth && "100%"};
  padding: 0.5rem;
  min-height: 50px;
  border-radius: 5px;
  outline: none;
  border: 1px solid lightgray;
  margin-top: 0.5rem;
`;

const CaptionInput = ({ ...others }) => {
  return <Input {...others} />;
};

export default CaptionInput;
