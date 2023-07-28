import styled from "styled-components";

export const PollingContainer = styled.div`
  width: 100%;
  height: 40px;
  margin-top: 1rem;
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : null};
  align-items: center;
  cursor: pointer;
  border: ${(props) => (props.border ? "2px solid lightblue" : null)};
  // background-color: ${(props) => (props.bgColor ? props.bgColor : null)};
  border-radius: 0.5rem;
`;

export const PollingInnerContainer = styled.div`
  width: ${(props) =>
    props.width
      ? props.width === "0"
        ? "0.3rem"
        : props.width + "%"
      : "0.3rem"};
  height: 40px;
  margin-top: 1px;
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : null};
  align-items: center;
  cursor: pointer;
  border: ${(props) => (props.border ? "2px solid lightblue" : null)};
  background-color: ${(props) => (props.bgColor ? props.bgColor : null)};
  border-radius: 0.5rem;
  position: relative;
  left: 0px;
`;
