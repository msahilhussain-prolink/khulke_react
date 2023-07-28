import React, { useEffect, useState } from "react";
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

const CaptionInput = ({ onChangeCaption, imageCaption, ...others }) => {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (imageCaption !== undefined) {
      setCharCount(imageCaption.length);
    }
  }, []);

  return (
    <>
      <Input
        {...others}
        onChange={(e) => {
          setCharCount(e.target.value.length);
          onChangeCaption(e);
        }}
        value={imageCaption}
        style={{
          paddingRight: "50px",
        }}
      />{" "}
      <span
        style={{
          opacity: "0.6",
          marginLeft: "-50px",
          marginTop: "0.3rem",
        }}
      >
        {50 - charCount}/{50}
      </span>
    </>
  );
};

export default CaptionInput;
