import Select, { components as Components } from "react-select";
import styled from "styled-components";
import { POST_API_BASE_URL } from "../../../constants/env";
import Delete from "../../../assets/icons/Group 19618.svg";
import UserProfile from "../../../components/UserProfile";

const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: -webkit-fill-available;
`;

const Value = styled.div`
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
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
  const { isMulti, value, onChange, custom_style, url_rt_id, sendData } = props;

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
      <ValuesContainer
        style={{
          height:
            value?.length > 4 || sendData?.["user_data"]?.length > 4
              ? "25rem"
              : "",
          overflowY:
            value?.length > 4 || sendData?.["user_data"]?.length > 4
              ? "scroll"
              : "hidden",
        }}
      >
        {isMulti
          ? value.map((item, index) => (
              <div
                className="user_suggestion_container mt-4"
                style={{ width: "100%" }}
              >
                <Value
                  key={index}
                  className="d-flex justify-content-between py-2"
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
                      <strong style={{ display: "block" }}>{item.value}</strong>
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

        {/* {url_rt_id && (
          <> */}
        {sendData?.["user_data"]?.map((item, index) => (
          <div
            className="user_suggestion_container mt-4"
            style={{ width: "100%" }}
          >
            <Value key={index} className="d-flex justify-content-between py-2">
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
                  <strong style={{ display: "block" }}>{item.value}</strong>
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
        ))}
        {/* </>
        )} */}
      </ValuesContainer>
    </div>
  );
};

export default SelectedOptions;
