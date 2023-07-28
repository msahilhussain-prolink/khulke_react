import React from "react";
import InfoIcon from "../InfoIcon";
import UploadImage from "../UploadImage";
import { allWords } from "../../App";

export default function UploadImageComp(props) {
  const {
    url_rt_id,
    rt_id,
    imageUrls,
    setImageUrl,
    image_name,
    imgValidation,
    onImageChange,
    onDocImageDelete,
    setImgDelFlag,
    label,
  } = props;
  return (
    <div style={{ width: "13rem" }} className="mix_custom">
      <div className="mt-4">
        <small className="label_txt">
          {allWords.misc.pg3.uplImg}
          <InfoIcon
            infoTitle1={allWords.misc.pg3.Recommendation}
            infoTitle6={allWords.misc.pg3.l1}
            infoTitle7={allWords.misc.pg3.l2}
            infoTitle8={allWords.misc.pg3.l3}
          />
        </small>
      </div>
      <UploadImage
        url_rt_id={url_rt_id}
        rt_id={rt_id}
        imageUrls={imageUrls}
        setImageUrl={setImageUrl}
        image_name={image_name}
        imgValidation={imgValidation}
        onImageChange={onImageChange}
        onDocImageDelete={onDocImageDelete}
        setImgDelFlag={setImgDelFlag}
        label={label}
      />
    </div>
  );
}
