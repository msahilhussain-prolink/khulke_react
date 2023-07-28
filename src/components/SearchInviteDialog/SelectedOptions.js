import Select from "react-select";
import styled from "styled-components";
import Delete from "../../assets/icons/Group 19618.svg";
import UserProfile from "../UserProfile";

const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  // width: -webkit-fill-available;
`;

const Value = styled.div`
  // padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  margin: 0 0.55rem 0.55rem 0;
  // font-size: 0.75rem;
  color: black;
  // background-color: rgba(247, 173, 46, 0.6);
  user-select: none;
`;

const XButton = styled.button`
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

const SelectedOptions = (props) => {
  const { isMulti, value, onChange, addMobile, removeMobile, error_message } =
    props;

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
        isClearable={false}
        backspaceRemovesValue={false}
        closeMenuOnSelect={true}
        controlShouldRenderValue={!isMulti}
      />
      {error_message !== "" && (
        <small className="warn-text">{error_message}</small>
      )}
      <div
        style={{
          height: "27.5rem",
          overflowY: "auto",
        }}
      >
        <ValuesContainer>
          {isMulti
            ? value.map((item, index) => (
                <div
                  key={item?.label}
                  className="user_suggestion_container mt-4"
                  style={{ width: "100%" }}
                >
                  <Value
                    key={item?.label}
                    className="d-flex justify-content-between py-1"
                  >
                    <div className="d-flex">
                      <UserProfile username={item.label} className="avatar" />
                      <span
                        style={{
                          userSelect: "none",
                          visibility: "hidden",
                        }}
                      >
                        ||
                      </span>
                      <div>
                        <strong style={{ display: "block" }}>
                          {item.value}
                        </strong>
                        <small className="text-muted">@{item.label}</small>
                      </div>
                    </div>

                    <XButton name={item.value} onClick={handleRemoveValue}>
                      <img
                        alt=""
                        style={{
                          border: "0.5px solid lightgray",
                          padding: "0.6rem",
                          borderRadius: "10px",
                        }}
                        src={Delete}
                      />
                    </XButton>
                  </Value>
                </div>
              ))
            : null}
        </ValuesContainer>

        {addMobile?.map((mob, i) => (
          <div
            className="d-flex justify-content-between py-1"
            style={{
              marginTop: "1rem",
              padding: "10px",
            }}
            key={mob}
          >
            <strong style={{ alignSelf: "center" }}>{mob}</strong>

            <XButton
              onClick={() => {
                removeMobile(i);
              }}
            >
              <img
                alt=""
                style={{
                  border: "0.5px solid lightgray",
                  padding: "0.6rem",
                  borderRadius: "10px",
                }}
                src={Delete}
              />
            </XButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedOptions;
