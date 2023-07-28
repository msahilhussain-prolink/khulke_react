import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RTListingCard from "../../../components/RTListingCard";
//Importing Svg
import Welcome from "../../../assets/images/welcome.svg";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../../constants/env";
import { allWords } from "../../../App";
import { getRTSingleData } from "../../../redux/actions/roundtableAction/single_roundtable";

const RTAwesome = ({
  wip_rt_id,
  url_rt_id,
  setProgress,
  setProgressName,
  sendData,
  parsed_data,
  imageUrls,
  schedule,
}) => {
  const single_rt_data = useSelector((state) => state.single_rt.data);

  const wipRtId = useSelector((state) => state.createEditRoundtable.wipRtId);

  console.log({ wipRtId });

  const [final_message, setFinalMessage] = useState("");
  const [has_error, setHasError] = useState(false);
  const [timestamp, setTimeStamp] = useState({});
  const [singleData, setSingleData] = useState("");
  const [mod_cover_image, setModCoverImage] = useState("");

  const url_params = new URL(window.location.href);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getRTSingleData({
        rt_id: wipRtId,
        token:
          localStorage.access || JSON.parse(localStorage.anonymous_user).token,
      })
    );
  }, [wipRtId]);

  useEffect(() => {
    if (single_rt_data && single_rt_data?.status === 200) {
      let temp_data = single_rt_data?.data?.[0];
      if (temp_data?.media?.length > 0) {
        // setCoverImage(
        // );
        setModCoverImage(
          `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${temp_data?.owner?.user_id}/roundtable/${temp_data?.["_id"]}/profile/${temp_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
        );
      }
      try {
        setTimeStamp({
          start: temp_data?.["start"],
          end: temp_data?.["end"],
        });
      } catch (err) {
        setTimeStamp({
          start: temp_data?.["start"],
          end: temp_data?.["end"],
        });
        // }
      }
      setSingleData(temp_data);
      setHasError(false);
    }
  }, [single_rt_data]);

  return (
    <section>
      {/* RoundTable Card  */}
      {has_error && (
        <div className="container-fluid text-center my-5">
          <small className="warn-text">{final_message}</small>
        </div>
      )}
      {(parsed_data || singleData) && (
        <>
          {/* Welcome Image  */}
          <section style={{ paddingBottom: "1rem" }}>
            <div className="col-sm-12 col-md-12 col-lg-12 mb-3 text-center">
              <img src={Welcome} className="img-fluid" alt="KhulKe Logo" />
            </div>

            {/* Text */}
            <div className="col-sm-12 col-md-12 col-lg-12 mb-3 text-center">
              <h2>{allWords.misc.livert.aw}!</h2>
              {url_params.searchParams.get("id") ? (
                <small>Your roundtable has been updated.</small>
              ) : (
                <small>{allWords.misc.livert.rtcreated}</small>
              )}
            </div>
          </section>
          <RTListingCard
            listingDisplay
            broadcast_destination={singleData?.broadcast_destination}
            displayValue={"center"}
            style={{ justifyContent: "center" }}
            cardImg
            cover_img={imageUrls}
            mod_cover_img={mod_cover_image}
            title={singleData?.name}
            timestamp={timestamp}
            rt_id={singleData?.["_id"]}
            rt_type={singleData?.["r_type"]}
            rt_nature={singleData?.open_to_all}
            speakers={singleData?.speakers}
            moderator={singleData?.moderator}
            live={singleData?.active_flag}
            past={singleData?.happened_flag}
            upcoming={
              singleData?.active_flag !== true
                ? singleData?.upcoming_flag
                : false
            }
            bodyRow
            cardCenter
            centerRow
            cardHr
            cardfooter
            // noLeftBtn
            invitation_code={sendData?.roundtable_code}
            rec_owner_flag={
              singleData?.recording?.[0]?.owner_flag === 1 ? true : false
            }
            rec_start_flag={
              singleData?.recording?.[0]?.start_recording === 1 ? true : false
            }
            rec_end_flag={
              singleData?.recording?.[0]?.soft_end_recording === 0
                ? true
                : false
            }
            reminder_status={singleData.reminder_set || singleData.was_invited}
            was_invited={singleData?.was_invited}
            awesomeDisplay={true}
            media_recording={
              singleData?.media_recording?.length > 0
                ? singleData?.media_recording
                : null
            }
            rt_details={singleData}
            user_views_count={singleData?.user_views_count}
            join_count={
              singleData?.happened_flag === true
                ? singleData?.["join_count"]
                : 0
            }
            viewer_count={
              singleData?.active_flag === true
                ? singleData?.["viewer_count"]
                : ""
            }
            invitees_count={
              singleData?.upcoming_flag === true
                ? singleData?.["invite_count"] - singleData?.["rejected_count"]
                : ""
            }
            owner_details={singleData?.owner}
            ext={
              singleData?.media_recording?.length > 0
                ? singleData?.media_recording?.[0]?.["metadata"]?.["ext"]
                : null
            }
          />
          <div className="text-center">
            <button
              onClick={() => {
                navigate("/roundtable/all", { replace: true });
              }}
              style={{ width: "50%", margin: "1rem !important" }}
              className="btn primary-btn-blk"
            >
              {allWords.misc.pages.back2rt}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default RTAwesome;
