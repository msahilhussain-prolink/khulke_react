import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import { allWords } from "../../App";

import { Done } from "@material-ui/icons";

const SelectForLanguage = ({ handleChangeForSelect, languages }) => {
  return (
    <>
      <div style={{ marginTop: "1rem" }}>
        <small style={{ color: "#63779C", fontWeight: "bold" }}>
          {allWords.misc.pages.lang}
        </small>
        <FormControl
          fullWidth
          size="small"
          style={{ marginBottom: "1rem", marginTop: "0.5rem" }}
          className="profile-lang-select"
        >
          <Select
            closeMenuOnSelect={false}
            value={languages[0]}
            onChange={handleChangeForSelect}
            style={{ borderRadius: "10px" }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "8px",
                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "#6A779B15",
                  },
                  "& .MuiMenuItem-root:hover": {
                    backgroundColor: "#6A779B15",
                  },
                  "& .MuiMenuItem-root.Mui-selected:hover": {
                    backgroundColor: "#6A779B15",
                  },
                },
              },
            }}
          >
            {languages.map((el) => (
              <MenuItem
                className="language-popup-list"
                disableRipple
                value={el}
                style={
                  languages[0] === el
                    ? {
                        color: "#66b984",
                        borderBottom: "1px solid #00000029",
                      }
                    : { color: "#000" }
                }
                id="special"
              >
                <p className="m-0 d-flex align-items-center">
                  {el}
                  {languages[0] === el ? (
                    <Done
                      className="done-icon-select"
                      color="#66b984"
                      style={{ marginLeft: "5px" }}
                    />
                  ) : null}
                </p>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </>
  );
};
export default SelectForLanguage;
