import styled from "styled-components";

export const PollingContainer = styled.div`
  width: 100%;
  height: auto;
  margin-top: 1rem;
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : null};
  align-items: center;
  cursor: pointer;
  border: ${(props) => (props.border ? "2px solid #a0a0a0" : null)};
  // background-color: ${(props) => (props.bgColor ? props.bgColor : null)};
  border-radius: 0.5rem;
  border: 1px solid #a0a0a0;
  border-left: ${(props) => (props.border ? props.border : null)};
`;

export const PollingInnerContainer = styled.div`
  width: ${(props) =>
    props.width ? (props.width === "0" ? "0rem" : props.width + "%") : "0rem"};
  height: 40px;
  // margin-top: 1px;
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : null};
  align-items: center;
  cursor: pointer;
  border: 1px solid #707070;
  background-color: ${(props) => (props.bgColor ? props.bgColor : null)};
  border-radius: 0.5rem;
  position: relative;
  left: 0px;
`;
