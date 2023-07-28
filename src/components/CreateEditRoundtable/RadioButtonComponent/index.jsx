import React from "react";
import { useDispatch, useSelector } from "react-redux";

// Material UI
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

// Constants
import { allWords } from "../../../App";

// Redux
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";

// Styles
import { RadioStyles } from "../styles";
import InfoIcon from "../../InfoIcon";

const RadioButtonComponent = () => {
  const rtType = useSelector((state) => state.createEditRoundtable.rtType);
  const rtPlayType = useSelector(
    (state) => state.createEditRoundtable.rtPlayType
  );

  const dispatch = useDispatch();

  const radioHandler = (e) => {
    const { value } = e.target;
    dispatch(
      createEditRoundtableInitialize({
        rtPlayType: value,
      })
    );
  };

  return (
    <>
      {rtType === `${allWords.rt.opt3.toLowerCase()}` ? null : (
        <>
          <h6 className="create-rt-nature">
            {allWords.createRT.type}
            <span className="asterikMark">*</span>

            <InfoIcon
              infoTitle2={allWords.createRT.iBtn.line1}
              infoTitle3={allWords.createRT.iBtn.line3}
              infoTitle4={allWords.createRT.iBtn.line2}
            />
          </h6>
          <div className="row mx-0 create-rt-radio-btn px-2">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue=""
                name="radio-buttons-group"
                row
                value={rtPlayType}
                onChange={radioHandler}
              >
                <div className="row w-100">
                  <div className="col-5 col-sm-3 col-md-4 col-xl-3">
                    <FormControlLabel
                      value={allWords.createRT.videoBtn.toLowerCase()}
                      control={
                        <Radio
                          sx={RadioStyles}
                          className="radio-btn-for-create-edit"
                        />
                      }
                      label={allWords.rt.opt1}
                    />
                  </div>
                  <div className="col-5 col-sm-3 col-md-4 col-xl-3">
                    <FormControlLabel
                      value={allWords.createRT.audioBtn.toLowerCase()}
                      control={
                        <Radio
                          sx={RadioStyles}
                          className="radio-btn-for-create-edit"
                        />
                      }
                      label={allWords.rt.opt2}
                    />
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        </>
      )}
    </>
  );
};

export default RadioButtonComponent;
