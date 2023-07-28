import React from "react";
import { useSelector } from "react-redux";

// Components
import ButtonComponent from "../ButtonComponent";

// Constants
import { allWords } from "../../../App";

const RoundtableTypeComponent = () => {
  const rtType = useSelector((state) => state.createEditRoundtable.rtType);
  const urlRtId = useSelector((state) => state.createEditRoundtable.urlRtId);

  return (
    <div className="row mx-0 mb-2">
      <div className="col-5 col-sm-3 col-md-4 col-xl-3 px-0">
        <ButtonComponent
          icon={
            rtType === `${allWords.rt.label2.toLowerCase()}`
              ? "/assets/icons/live_white.svg"
              : "/assets/icons/live_black.svg"
          }
          title={allWords.rt.label2}
          reduxKeyName={"rtType"}
        />
      </div>
      <div
        className="col-5 col-sm-3 col-md-4 col-xl-3 px-0"
        hidden={urlRtId ? true : false}
      >
        <ButtonComponent
          disabled={urlRtId ? true : false}
          icon={
            rtType === `${allWords.rt.opt3.toLowerCase()}`
              ? "/assets/icons/recorded_w.svg"
              : "/assets/icons/recorded_b.svg"
          }
          title={allWords.rt.opt3}
          reduxKeyName={"rtType"}
        />
      </div>
    </div>
  );
};

export default RoundtableTypeComponent;
