import React from "react";
import styled from "styled-components";
import FormInput from "../components/FormInput";
import { allWords } from "../App";

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

const Deactive_btn = styled(Button)`
  border: 1px solid #ed4d29 !important;
  padding: 0.5rem !important;
  margin-top: 1rem !important;
  color: #ed4d29 !important;
  width: 200px;
`;

const DeactivateDialog = ({ setDeactivateAcc }) => {
  return (
    <Container>
      <FormInput>
        <input type="password" placeholder="Enter Password" />
      </FormInput>
      <div className="btn_container">
        <Deactive_btn
          style={{ marginTop: "1rem" }}
          primary
          onClick={() => {
            setDeactivateAcc(false);
          }}
        >
          Submit
        </Deactive_btn>
        <Button
          style={{ marginTop: "1rem" }}
          bgColor
          onClick={() => {
            setDeactivateAcc(false);
          }}
        >
          {allWords.misc.cancel}
        </Button>
      </div>
    </Container>
  );
};

export default DeactivateDialog;
