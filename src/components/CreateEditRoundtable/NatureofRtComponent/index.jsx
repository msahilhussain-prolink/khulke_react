import React from "react";
import ButtonComponent from "../ButtonComponent";
import { useSelector } from "react-redux";
import { allWords } from "../../../App";
import InfoIcon from "../../InfoIcon";
import confidential_b from "../../../assets/icons/Group 24796.svg";
import confidential_w from "../../../assets/icons/Group 24797.svg";

const NatureofRtComponent = () => {
  const isRecorded = useSelector((state) => state.createEditRoundtable.rtType);
  const rtNature = useSelector((state) => state.createEditRoundtable.rtNature);

  return (
    <>
      {isRecorded === `${allWords.rt.opt3.toLowerCase()}` ? null : (
        <div className="rt-nature-div">
          <h6 className="create-rt-nature">
            {allWords.createRT.natureOfRt}
            <span className="asterikMark">*</span>
            {window.location.origin.includes("dev") ||
            window.location.origin.includes("localhost") ||
            window.location.origin.includes("stage") ? (
              <InfoIcon
                infoTitle2={allWords.createRT.natureIBtn.one}
                infoTitle3={allWords.createRT.natureIBtn.two}
                infoTitle4={allWords.createRT.natureIBtn.three}
                infoTitle5={allWords.createRT.natureIBtn.four}
              />
            ) : (
              <InfoIcon
                infoTitle2={allWords.createRT.natureRtBtn.one}
                infoTitle3={allWords.createRT.natureRtBtn.two}
                infoTitle4={allWords.createRT.natureRtBtn.three}
              />
            )}
          </h6>
          <div className="row mx-0">
            <div className="col-4 col-sm-3 col-md-4 col-xl-3 px-0">
              <ButtonComponent
                icon={
                  rtNature === `${allWords.createRT.optPub.toLowerCase()}`
                    ? "/assets/icons/public_w.svg"
                    : "/assets/icons/public_b.svg"
                }
                title={allWords.createRT.optPub}
                reduxKeyName={"rtNature"}
              />
            </div>
            <div className="col-4 col-sm-3 col-md-4 col-xl-3 px-0">
              <ButtonComponent
                icon={
                  rtNature === `${allWords.createRT.optPriv.toLowerCase()}`
                    ? "/assets/icons/private_w.svg"
                    : "/assets/icons/private_b.svg"
                }
                title={allWords.createRT.optPriv}
                reduxKeyName={"rtNature"}
              />
            </div>
            {(window.location.origin.includes("dev") ||
              window.location.origin.includes("localhost") ||
              window.location.origin.includes("stage")) && (
              <div className="col-4 col-sm-3 col-md-4 col-xl-3 px-0">
                <ButtonComponent
                  icon={
                    rtNature === "secret" ||
                    rtNature === `${allWords.createRT.optConfi.toLowerCase()}`
                      ? confidential_w
                      : confidential_b
                  }
                  title={allWords.createRT.optConfi}
                  reduxKeyName={"rtNature"}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NatureofRtComponent;
