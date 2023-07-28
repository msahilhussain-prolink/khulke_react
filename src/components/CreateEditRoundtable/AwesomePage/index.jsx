import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RTListingCard from "../../RTListingCard";
//Importing Svg
import Welcome from "../../../assets/images/welcome.svg";
import { allWords } from "../../../App";
import { getRTSingleData } from "../../../redux/actions/roundtableAction/single_roundtable";
import Back from "../../../assets/icons/back.svg";
import "./style.css";
import { Grid } from "@material-ui/core";

export default function AwesomePage() {
  const single_rt_data = useSelector((state) => state.single_rt.data);

  const data = useSelector((state) => state.createEditRoundtable);

  const { urlRtId, wipRtId, rtTopic, rtImageUrl } = data;

  const [timestamp, setTimeStamp] = useState({});
  const [singleData, setSingleData] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getRTSingleData({
        rt_id: urlRtId ?? wipRtId,
        token:
          localStorage.access || JSON.parse(localStorage.anonymous_user).token,
      })
    );
  }, [wipRtId, urlRtId]);

  useEffect(() => {
    if (single_rt_data && single_rt_data?.status === 200) {
      let temp_data = single_rt_data?.data?.[0];
      setTimeStamp({
        start: temp_data?.["start"],
        end: temp_data?.["end"],
      });

      setSingleData(temp_data);
    }
  }, [single_rt_data]);

  return (
    <section>
      <>
        <div className="row">
          <Link className="preview-link-class" to={"/roundtable/all"}>
            <img src={Back} alt="back" />
          </Link>
          <h3 className="preview-h3">
            {urlRtId
              ? allWords.misc.livert.rt_updated
              : allWords.misc.livert.rtcreated}
          </h3>
        </div>
        {/* Welcome Image  */}
        <section style={{ paddingBottom: "1rem" }}>
          <div className="col-sm-12 col-md-12 col-lg-12 mb-3 text-center">
            <img src={Welcome} className="img-fluid" alt="KhulKe Logo" />
          </div>

          {/* Text */}
          <div className="col-sm-12 col-md-12 col-lg-12 mb-3 text-center">
            <h2>{allWords.misc.livert.aw}!</h2>
            {urlRtId ? (
              <small>{allWords.misc.your_rt_has_update}</small>
            ) : (
              <small>{allWords.misc.livert.rtcreated}</small>
            )}
          </div>
        </section>
        <Grid container>
          <Grid item sm={2} lg={3}></Grid>
          <Grid item xs={12} sm={8} lg={6} xl={6}>
            <RTListingCard
               broadcast_destination={singleData?.broadcast_destination}
              listingDisplay
              displayValue={"center"}
              style={{ justifyContent: "center" }}
              cardImg
              cover_img={rtImageUrl}
              title={rtTopic}
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
              invitation_code={singleData?.roundtable_code}
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
              reminder_status={
                singleData.reminder_set || singleData.was_invited
              }
              was_invited={singleData?.was_invited}
              awesomeDisplay={true}
              media_recording={
                singleData?.media_recording?.length > 0
                  ? singleData?.media_recording
                  : undefined
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
                  ? singleData?.["invite_count"] -
                    singleData?.["rejected_count"]
                  : ""
              }
              owner_details={singleData?.owner}
              ext={
                singleData?.media_recording?.length > 0
                  ? singleData?.media_recording?.[0]?.["metadata"]?.["ext"]
                  : undefined
              }
            />
          </Grid>
          <Grid item sm={2} lg={3}></Grid>
        </Grid>
        <div className="text-center">
          <button
            onClick={() => {
              navigate(
                urlRtId
                  ? `/roundtable/edit/invite-audience/${urlRtId}`
                  : "/roundtable/create/invite-audience"
              );
            }}
            className="btn primary-btn-blk inviteAudBtn"
          >
            {allWords.misc.invite_audience}
          </button>
        </div>
      </>
    </section>
  );
}
