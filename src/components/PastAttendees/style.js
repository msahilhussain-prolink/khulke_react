import styled from "styled-components";

export const SearchContainer = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  border: 1px solid #e4e9f0;
  padding: 0.8rem;
  border-radius: 10px;
  background-color: transparent;
  margin-top: 1rem;
`;
export const CustomSearchInput = styled.input`
  width: 100%;
  height: 45px;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0.8rem;
  // font-weight: medium;
  background-color: transparent;
`;

export const Wrapper = styled.div`
  // border: 1px solid grey;
  background-color: white;
  box-shadow: 0px 20px 40px rgba(255, 255, 255, 0.25),
    0px 1px 5px rgba(0, 0, 0, 0.1), inset 0 0 0 0.5px rgba(255, 255, 255, 0.4);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  padding: 20px 20px;
  position: absolute;
  z-index: 999999;
  // margin-left: 0.3rem;
  width: 90%;
  height: 33%;
  margin-top: -1rem;
`;
