import Select from "react-select";
import Delete from "../../../assets/icons/Group 19618.svg";
import UserProfile from "../../../components/UserProfile";
import { useSelector } from "react-redux";
import "./style.css";
import { Value, ValuesContainer, XButton } from "./style";

const SelectedOptions = (props) => {
  const { isMulti, value, onChange } = props;

  const selectedValue = useSelector(
    (state) => state.createEditRoundtable.user_data
  );

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
          height: value?.length > 4 ? "25rem" : "",
          overflowY: value?.length > 4 ? "scroll" : "hidden",
        }}
      >
        {isMulti
          ? selectedValue.map((item, index) => (
              <div className="user_suggestion_container mt-4 value-cont">
                <Value
                  key={index}
                  className="d-flex justify-content-between py-2"
                >
                  <div className="d-flex">
                    <UserProfile username={item.label} className="avatar" />
                    &emsp;
                    <div>
                      <strong className="d-block">{item.value}</strong>
                      <small className="text-muted">@{item.label}</small>
                    </div>
                  </div>

                  <XButton name={item.value} onClick={handleRemoveValue}>
                    <img className="x-delete-button" alt="" src={Delete} />
                  </XButton>
                </Value>
              </div>
            ))
          : null}
      </ValuesContainer>
    </div>
  );
};

export default SelectedOptions;
