import React, { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  .btn_container {
    width: 100%;
    display: flex;
    // justify-content: space-between;
  }
`;

const Button = styled.button`
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
`;

const DiscardDialog = ({ setDialogTitle, setDiscard }) => {
  useEffect(() => {
    setDialogTitle("Save Post?");
  }, []);
  return (
    <Container>
      <p>Do You want to exit?</p>
      <div className="btn_container">
        <Button
          primary
          onClick={() => {
            setDiscard(false);
          }}
        >
          Discard
        </Button>
        <Button
          bgColor
          onClick={() => {
            setDiscard(false);
          }}
        >
          Save to draft
        </Button>
      </div>
    </Container>
  );
};

export default DiscardDialog;
