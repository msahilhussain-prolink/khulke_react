import React from "react";
import { useSelector } from "react-redux";
import { allWords } from "../../../App";
import InfoIcon from "../../InfoIcon";
import ThumbnailComponent from "../ThumbnailComponent";
import "./style.css";

const TypeOfRtComponent = () => {
  const selector = useSelector((state) => state.createEditRoundtable.rtType);

  return (
    <div className="row mx-0">
      <div className="col-6 col-md-4 col-xl-3 px-0 mt-2">
        <h6 className="thumbnail-recording-class">
          {allWords.misc.thumbnail}
          <InfoIcon
            infoTitle1={allWords.misc.pg3.Recommendation}
            infoTitle6={allWords.misc.pg3.l1}
            infoTitle7={allWords.misc.pg3.l2}
            infoTitle8={allWords.misc.pg3.l3}
          />
        </h6>
        <ThumbnailComponent fileType="image" uploadType="rtImage" />
      </div>
      {selector === `${allWords.rt.opt3.toLowerCase()}` ? (
        <div className="col-6 col-md-4 col-xl-3 px-0 mt-2">
          <h6 className="thumbnail-recording-class">
            {allWords.misc.recording}
            <span className="asterikMark">*</span>
            <InfoIcon
              infoTitle1={allWords.misc.pg3.Recommendation}
              infoTitle6={allWords.misc.recline1}
              infoTitle7={allWords.misc.recline2}
              infoTitle8={allWords.misc.recline3}
            />
          </h6>
          <ThumbnailComponent fileType="video" uploadType="recording" />
        </div>
      ) : null}
    </div>
  );
};

export default TypeOfRtComponent;
