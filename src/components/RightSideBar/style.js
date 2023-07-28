import styled from "styled-components";

export const RightSideContainer = styled.div`
  /* min-width: 320px; */
  /* border:2px dotted blue; */
  /* width: 100%; */
  margin-top: 0.5rem;

  /* @media (min-width: 481px) and (max-width: 767px) {
    width: 20%;
  }
  @media (min-width: 768px) and (max-width: 1068px) {
    width: 20%;
  }
  @media (min-width: 1069px) {
    // width: 20%;
  } */
`;

export const Wrapper = styled.div`
  /* border: 1px solid olive; */
  background-color: white;
  box-shadow: 0px 20px 40px rgba(255, 255, 255, 0.25),
    0px 1px 5px rgba(0, 0, 0, 0.1), inset 0 0 0 0.5px rgba(255, 255, 255, 0.4);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  padding: 20px 20px;
  position: absolute;
  z-index: 999999;
  margin-left: 0.3rem;
  width: 100%;
  height: auto;
  overflow-x: none;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 5px;
  }
`;

export const SearchItem = styled.div`
  background-color: white;
  padding: 0.7rem;
  cursor: pointer;
  :hover {
    background-color: #e6e6e6;
  }
`;
