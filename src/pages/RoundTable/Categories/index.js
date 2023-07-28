import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch } from "react-redux";

// Components
import ConfirmButton from "../../../components/ConfirmButton";

//Importing CSS
import "../Create/style.css";
import "../ModeratorandPanelist/style.css";

import { setRtCreationDocument } from "../../../redux/actions/roundtableAction/single_roundtable";

// Data
import CategoriesTags from "../../../components/CateoriesTags";
import UploadImage from "../../../components/UploadImage";
import UploadDocument from "../../../components/UploadDocument";
import MultipleLogo from "../../../components/MultipleLogo";
import IntroOutro from "../../../components/IntroOutro";
import InfoIcon from "../../../components/InfoIcon";
import UploadImageComp from "../../../components/UploadImageComp";
import { allWords } from "../../../App";

export default forwardRef(function Categories(props, ref) {
  const {
    setProgress,
    url_rt_id = null,
    setSendData,
    sendData,
    wip_rt_id,
    setProgressThree,
    parsed_data,
    image_name,
    imageUrls,
    setImageUrl,
    uploadingFiles,
    imgValidation,
    onImageChange,
    onDocImageDelete,
    categories,
    setCategories,
    tags,
    setTags,
    setImgDelFlag,
    docName,
    setDocName,
    doc_target_files,
    docs,
    setDocs,
    document_name,
    previous_document,
    setPreviousDocument,
    progress,
    docDelFlag,
    setDocDelFlag,
    docValidation,
    onDocChange,
    docImg,
    setDocImg,
    DocSvg,
    setDocSvg,
    navigate,
    logoUrls1,
    setLogoUrl1,
    logoUrls2,
    setLogoUrl2,
    logoUrls3,
    setLogoUrl3,
    setLogoDelFlag1,
    setLogoDelFlag2,
    setLogoDelFlag3,
    ivideoUrls,
    setiVideoUrl,
    vidValidation,
    setiVidDelFlag,
    ovideoUrls,
    setOVideoUrl,
    setOVidDelFlag,
    progress_name,
    setLogo1,
    setLogo2,
    setLogo3,
    setiVid,
    setOVid,
  } = props;

  // Local state
  let [rt_id, setRTId] = useState(null);
  const [loading, setLoading] = useState(true);

  // variables
  const dispatch = useDispatch();

  // refs
  const catInput = useRef();
  const tagInput = useRef();

  // LifeCycle Effects
  useEffect(() => {
    if (!url_rt_id) {
      setLoading(false);
      setRTId(wip_rt_id);
    } else {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (
      sendData?.["tags"] !== undefined ||
      sendData?.["category"] !== undefined
    ) {
      setTags(sendData?.["tags"]);
      setCategories(sendData?.["category"]);
    }
  }, [sendData]);

  const RTCategory = () => {
    let data = null;
    if (docs.length !== 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        let durl = reader.result;
        dispatch(setRtCreationDocument(durl));
      });

      try {
        reader.readAsDataURL(docs[0]);
      } catch (e) {}
    }

    data = {
      name: sendData?.["name"],
      description: sendData?.["description"],
      open_to_all: sendData?.["open_to_all"],
      date: sendData?.["date"],
      end_time: sendData?.["end_time"],
      start_time: sendData?.["start_time"],
      durationHr: sendData?.["durationHr"],
      durationMin: sendData?.["durationMin"],
      anonymous: sendData?.["anonymous"],
      r_type: sendData?.["r_type"],
      visibility: sendData?.["visibility"],
      host: sendData["host"],
      host_name: sendData["host_name"],
      bio: sendData["bio"],
      speakers: sendData["speakers"],
      start_recording: sendData?.["start_recording"],
      category: categories,
      tags: tags,
      image_filename: imageUrls,
      image_upload_name: image_name,
      doc_filename: docName,
      document_upload_name: document_name,
      previous_document: previous_document,
      doc_target_files:
        doc_target_files !== null
          ? doc_target_files
          : {
              type:
                parsed_data?.["doc_media"]?.[0]?.["metadata"]?.["mimeType"] !==
                undefined
                  ? parsed_data?.["doc_media"]?.[0]?.["metadata"]?.["mimeType"]
                  : null,
            },
      followers: sendData?.["followers"],
      following: sendData?.["following"],
      user_id: sendData?.["user_id"],
      past_rtid: sendData?.["past_rtid"],
      email_list: sendData?.["email_list"],
      phone_list: sendData?.["phone_list"],
      user_data: sendData?.["user_data"],
      host_id: sendData?.["host_id"],
      m_type: sendData?.["m_type"],
      schedule:
        sendData?.["schedule"] !== undefined ? sendData?.["schedule"] : true,
    };

    if (!url_rt_id) {
      data["roundtable_id"] = rt_id;
      navigate("/roundtable/create/send-invitation");
    } else {
      data["roundtable_id"] = url_rt_id;
      if (wip_rt_id) {
        navigate("/roundtable/create/send-invitation");
      } else navigate(`/roundtable/edit/send-invitation/${url_rt_id}`);
    }
    setSendData(data);
    setProgressThree(3);
  };

  useImperativeHandle(ref, () => ({
    saveData() {
      let data = {
        anonymous: sendData?.["anonymous"],
        name: sendData?.["name"],
        date: sendData?.["date"], //12/15/2021
        description: sendData?.["description"],
        r_type: sendData?.["r_type"],
        visibility: sendData?.["visibility"],
        open_to_all: sendData?.["open_to_all"],
        start_time: sendData?.["start_time"], //01:00 AM
        end_time: sendData?.["end_time"],
        durationHr: sendData?.["durationHr"],
        durationMin: sendData?.["durationMin"],
        host: sendData?.["host"],
        host_name: sendData?.["host_name"],
        bio: sendData?.["bio"],
        speakers: sendData?.["speakers"],
        category: categories,
        tags: tags,
        roundtable_id: rt_id,
        start_recording: sendData?.["start_recording"],
        image_filename: imageUrls,
        image_upload_name: image_name,
        doc_filename: docName,
        document_upload_name: document_name,
        previous_document: previous_document,
        doc_target_files:
          doc_target_files !== null
            ? doc_target_files
            : {
                type:
                  parsed_data?.["doc_media"]?.[0]?.["metadata"]?.[
                    "mimeType"
                  ] !== undefined
                    ? parsed_data?.["doc_media"]?.[0]?.["metadata"]?.[
                        "mimeType"
                      ]
                    : null,
              },
        user_data: sendData?.["user_data"],
        host_id: sendData?.["host_id"],
        m_type: sendData?.["m_type"],
        schedule:
          sendData?.["schedule"] !== undefined ? sendData?.["schedule"] : true,
      };
      setSendData(data);
    },
  }));

  return (
    <section>
      <>
        {/* Upload Image  */}
        <UploadImageComp
          url_rt_id={url_rt_id}
          rt_id={rt_id}
          imageUrls={imageUrls}
          setImageUrl={setImageUrl}
          image_name={image_name}
          imgValidation={imgValidation}
          onImageChange={onImageChange}
          onDocImageDelete={onDocImageDelete}
          setImgDelFlag={setImgDelFlag}
        />

        {/* Upload Logos (Max 3 )  */}
        <div>
          <small className="label_txt">
            {allWords.misc.pg3.logo}
            <InfoIcon
              infoTitle1={allWords.misc.pg3.Recommendation}
              infoTitle6={allWords.misc.pg3.ll1}
              infoTitle7={allWords.misc.pg3.ll2}
              infoTitle8={allWords.misc.pg3.l2}
              infoTitle9={allWords.misc.pg3.ll4}
            />{" "}
          </small>
        </div>
        <MultipleLogo
          url_rt_id={url_rt_id}
          rt_id={rt_id}
          imgValidation={imgValidation}
          logoUrls1={logoUrls1}
          setLogoUrl1={setLogoUrl1}
          logoUrls2={logoUrls2}
          setLogoUrl2={setLogoUrl2}
          logoUrls3={logoUrls3}
          setLogoUrl3={setLogoUrl3}
          setLogoDelFlag1={setLogoDelFlag1}
          setLogoDelFlag2={setLogoDelFlag2}
          setLogoDelFlag3={setLogoDelFlag3}
          progress_name={progress_name}
          parsed_data={parsed_data}
          setLogo1={setLogo1}
          setLogo2={setLogo2}
          setLogo3={setLogo3}
        />
        <IntroOutro
          url_rt_id={url_rt_id}
          rt_id={rt_id}
          ivideoUrls={ivideoUrls}
          setiVideoUrl={setiVideoUrl}
          vidValidation={vidValidation}
          setiVidDelFlag={setiVidDelFlag}
          ovideoUrls={ovideoUrls}
          setOVideoUrl={setOVideoUrl}
          setOVidDelFlag={setOVidDelFlag}
          progress_name={progress_name}
          parsed_data={parsed_data}
          setiVid={setiVid}
          setOVid={setOVid}
        />

        {/* Attach Document  */}
        <div className="mt-4">
          <small className="label_txt">
            {allWords.misc.pg3.attachdoc}
            <InfoIcon
              infoTitle1={allWords.misc.pg3.docRecommendation}
              infoTitle6={allWords.misc.pg3.docl1}
              infoTitle7={allWords.misc.pg3.docl2}
              infoTitle8={allWords.misc.pg3.docl3}
            />
          </small>
        </div>
        <UploadDocument
          url_rt_id={url_rt_id}
          rt_id={rt_id}
          docName={docName}
          setDocName={setDocName}
          docs={docs}
          setDocs={setDocs}
          setLoading={setLoading}
          setPreviousDocument={setPreviousDocument}
          parsed_data={parsed_data}
          progress={progress}
          docDelFlag={docDelFlag}
          setDocDelFlag={setDocDelFlag}
          docValidation={docValidation}
          onDocChange={onDocChange}
          onDocImageDelete={onDocImageDelete}
          docImg={docImg}
          setDocImg={setDocImg}
          DocSvg={DocSvg}
          setDocSvg={setDocSvg}
          document_name={document_name}
        />
        {/* Categories */}
        <div>
          <div>
            <small className="label_txt">{allWords.misc.pg3.category}</small>
          </div>
          <CategoriesTags
            custom_ref_input={catInput}
            custom_array={categories}
            set_custom_array={setCategories}
            // custom_auto_focus
            custom_max_length={30}
          />

          {/* Tags  */}
          <div className="mt-4">
            <small className="label_txt">{allWords.misc.pg3.tags}</small>
          </div>
          <CategoriesTags
            custom_ref_input={tagInput}
            custom_array={tags}
            set_custom_array={setTags}
            custom_max_length={45}
          />
        </div>
        <ConfirmButton
          is_valid={true}
          onclick={RTCategory}
          uploadingFiles={uploadingFiles}
        />
      </>
    </section>
  );
});
