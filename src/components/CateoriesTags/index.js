import React, { useState } from "react";
// Components
import FormInput from "../FormInput";
// Assets
import "./style.css";
import { allWords } from "../../App";

export default function CategoriesTags(props) {
  const {
    custom_ref_input,
    custom_array,
    set_custom_array,
    custom_max_length,
  } = props;

  const [disabled, setDisabled] = useState(0);
  const removeCategories = (i) => {
    const newCat = [...custom_array];
    newCat.splice(i, 1);
    set_custom_array(newCat);
  };

  const inputKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === "Enter" && val) {
      if (
        custom_array?.find((tag) => tag?.toLowerCase() === val?.toLowerCase())
      ) {
        return;
      }
      set_custom_array([...custom_array, val]);
      custom_ref_input.current.value = null;
      setDisabled(0);
    } else if (e.key === "Backspace" && !val) {
      removeCategories(custom_array.length);
    }
  };

  const handleAdd = () => {
    const val = custom_ref_input.current.value;
    if (val?.length > 0) {
      if (
        custom_array?.find((tag) => tag?.toLowerCase() === val?.toLowerCase())
      ) {
        return;
      }
      set_custom_array([...custom_array, val]);
      setDisabled(0);
    }
    custom_ref_input.current.value = null;
  };

  return (
    <div>
      <div style={{ display: "flex", height: "60px" }}>
        <FormInput custom_styles={{ width: "85%", height: "50px" }}>
          <input
            type="text"
            // autoFocus={custom_auto_focus}
            style={{
              border: "none",
              width: "100%",
              height: "1.5rem",
              outline: "none",
            }}
            maxLength={custom_max_length}
            placeholder={allWords.misc.pg3.catergoryplace}
            onKeyDown={inputKeyDown}
            ref={custom_ref_input}
            onChange={() =>
              setDisabled(custom_ref_input?.current?.value?.length)
            }
          />
        </FormInput>{" "}
        &nbsp;
        <button
          className="btn addStyle"
          onClick={() => {
            handleAdd();
          }}
          disabled={disabled > 0 ? false : true}
        >
          {allWords.snip.btnadd}
        </button>
      </div>

      {custom_array?.length > 0 &&
        custom_array?.map((cat, i) => (
          <div className="tooltips" key={cat}>
            <div
              style={{
                marginTop: "1rem",
                textTransform: "capitalize",
                width: cat?.length > 22 ? "12rem" : "fit-content",
              }}
              className="catsTags"
              key={cat}
            >
              {cat?.length > 22 ? cat?.slice(0, 21) : cat}

              <button
                className="catbutn"
                type="button"
                onClick={() => {
                  removeCategories(i);
                }}
              >
                +
              </button>
            </div>
            {cat?.length > 22 ? <span className="tooltiptext">{cat}</span> : ""}
          </div>
        ))}
    </div>
  );
}
