import React from "react";
import search_icon from "../../assets/icons/search.svg";
import styled from "styled-components";
import { SearchOutlined } from "@material-ui/icons";
import { allWords } from "../../App"

const SearchContainer = styled.div`
  width: auto;
  height: 48px;
  display: flex;
  align-items: center;
  border: 1px solid #e4e9f0;
  padding: 0.8rem;
  border-radius: 10px;
  background-color: transparent;
  margin-top: ${(props) => (props.label == "maidan" ? "0rem" : "0rem")};
`;
const CustomSearchInput = styled.input`
  width: 100%;
  height: 45px;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0.8rem;
  font-weight: medium;
  background-color: transparent;
`;

const SearchInput = ({ ...props }) => {
  return (
    <SearchContainer label={props.label}>
      <SearchOutlined
        style={{ fontSize: 25, padding: 2, opacity: "0.5", color: "#000" }}
      />
      <CustomSearchInput {...props} placeholder={allWords.th.searPlaceholder} />
    </SearchContainer>
  );
};

export default SearchInput;
