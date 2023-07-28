import CategoriesTags from "../../CateoriesTags";
import { allWords } from "../../../App";
const CatNTagHiden = ({
  catNTagInput,
  catNTags,
  setCatNTags,
  customMaxLength,
  setCatNTagHide,
  catNTagHide,
}) => {
  return (
    <div hidden={false}>
      <CategoriesTags
        custom_ref_input={catNTagInput}
        custom_array={catNTags}
        set_custom_array={setCatNTags}
        custom_auto_focus
        custom_max_length={customMaxLength}
      />
      <button
        onClick={() => {
          setCatNTagHide(!catNTagHide);
        }}
        className="follow-button-small"
        style={{ width: "fit-content" }}
      >
        <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
          {allWords.misc.update}
        </span>
      </button>
    </div>
  );
};

export default CatNTagHiden;
