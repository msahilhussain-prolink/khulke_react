import styled from "styled-components";
import { components } from "react-select";
import UserProfile from "../../UserProfile";

export const SearchCustomStyle = {
  control: () => ({
    border: "1px solid #d3d6db",
    borderRadius: "10px",
    display: "flex",
    padding: "0.1rem",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#63779C",
    fontFamily: "WorkSans-Regular",
  }),
  option: (styles, { isFocused }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#999999" : null,
      color: "#333333",
    };
  },
};

export const FormatOptionLabel = (props) => {
  return (
    <components.Option {...props}>
      <div
        className="d-flex my-1 pb-2"
        style={{ borderBottom: "1px solid lightgray" }}
      >
        <div>
          <UserProfile username={props.data.label} className="avatar" />
        </div>
        <div className="px-3" style={{ width: "80%" }}>
          <h6>{props.data.value}</h6>
          <p style={{ color: "#475376", fontSize: "0.8rem" }}>
            @{props.data.label}
          </p>
        </div>
      </div>
    </components.Option>
  );
};

export const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: -webkit-fill-available;

  ::-webkit-scrollbar {
    // width: 5px;
    // padding-left: 5px;

    display: none;
  }
`;

export const Value = styled.div`
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  margin: 0 0.55rem 0.55rem 0;
  color: black;
  user-select: none;
`;

export const XButton = styled.button`
  all: unset;
  margin-left: 0.3rem;
  color: #63779c;
  transition: fill 0.15s ease-in-out;
  cursor: pointer;
  &:hover {
    color: #63779c;
  }
  &:focus {
    color: #63779c;
  }
`;
