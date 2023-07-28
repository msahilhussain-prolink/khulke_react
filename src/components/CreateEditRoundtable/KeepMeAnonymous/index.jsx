import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../../App";
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";
import InfoIcon from "../../InfoIcon";
import { CustomColorCheckbox } from "../styles";

export default function KeepMeAnonymous() {
  const rtType = useSelector((state) => state.createEditRoundtable.rtType);
  const anonymous = useSelector(
    (state) => state.createEditRoundtable.anonymous
  );

  const dispatch = useDispatch();

  const anony = (e) => {
    dispatch(
      createEditRoundtableInitialize({
        anonymous: e.target.checked,
      })
    );
  };
  return (
    <>
      {rtType !== `${allWords.rt.opt3.toLowerCase()}` &&
        (window.location.origin.includes("dev") ||
          window.location.origin.includes("localhost") ||
          window.location.origin.includes("stage")) && (
          <div className="mb-2 d-flex">
            <CustomColorCheckbox checked={anonymous} onChange={anony} /> &nbsp;
            <div
              className="anonymous-check-div"
              onClick={() => {
                dispatch(
                  createEditRoundtableInitialize({ anonymous: !anonymous })
                );
              }}
            >
              {allWords.createRT.keepAnonTitle}{" "}
              <InfoIcon infoTitle2={allWords.createRT.keepAnonI} />
            </div>
          </div>
        )}
    </>
  );
}
