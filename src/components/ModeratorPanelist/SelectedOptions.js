import Select from "react-select";
import styled from "styled-components";

const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 1rem;
  background-color: black;
`;

const Value = styled.div`
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  margin: 0 0.55rem 0.55rem 0;
  font-size: 0.75rem;
  color: black;
  background-color: #66b984;
  border: 1px solid #e4e9f0;
  border-radius: 5px;
  // color: #63779c;
  user-select: none;
`;

const XButton = styled.button`
  all: unset;
  margin-left: 0.3rem;
  color: red;
  border: 1px solid red;
  transition: fill 0.15s ease-in-out;
  cursor: pointer;
  &:hover {
    color: #63779c;
  }
  &:focus {
    color: #63779c;
  }
`;

const SelectedOptions = (props) => {
  const { isMulti, value, onChange } = props;

  const handleRemoveValue = (e) => {
    if (!onChange) return;
    const { name: buttonName } = e.currentTarget;
    const removedValue = value.find((val) => val.value === buttonName);
    if (!removedValue) return;
    onChange(
      value.filter((val) => val.value !== buttonName),
      { action: "remove-value", removedValue }
    );
  };

  return (
    <div>
      <Select
        {...props}
        closeMenuOnSelect={true}
        controlShouldRenderValue={!isMulti}
      />
      <ValuesContainer>
        {isMulti
          ? value.map((val) => (
              <Value key={val.value}>
                {val.label}
                <XButton name={val.value} onClick={handleRemoveValue}>
                  ✕
                </XButton>
              </Value>
            ))
          : null}
      </ValuesContainer>
    </div>
  );
};

export default SelectedOptions;
