import React from "react";

// Material
import { Typography } from "@mui/material";

// Constants
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";

// Components
import RTListingCard from "../../components/RTListingCard";

// Style
import "./style.css";
import "../RTListingCard/style.css";
import { allWords } from "../../App";

export default function RecommendedRT(props) {
  const { recommendData, label } = props;

  return (
    <div
      className={
        window.location.pathname.includes("join")
          ? "recommendRtJ"
          : "recommendRtP"
      }
    >
      {recommendData?.length > 0 && (
        <div>
          <Typography className="recommended-rt-title">
            {label === "owner"
              ? allWords.misc.recomOwn
              : allWords.misc.recomMod}
          </Typography>
          <br />
        </div>
      )}

      <div className="recommend_div_style">
        {recommendData &&
          recommendData?.length > 0 &&
          recommendData?.map((item) => (
            <div key={item?._id}>
              <RTListingCard
                broadcast_destination={item.broadcast_destination}
                listingDisplay
                displayValue={"space-between"}
                style={{ border: "1px solid #E4E9F0" }}
                rt_id={item?._id}
                cardImg
                cover_img={
                  item?.media?.length > 0
                    ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                    : undefined
                }
                mod_cover_img={
                  item?.media?.length > 0
                    ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                    : undefined
                }
                title={item?.name}
                timestamp={item?.time}
                rt_type={item?.r_type}
                rt_nature={item?.open_to_all}
                moderator={item?.moderator}
                speakers={item?.speakers}
                reminder_status={item.reminder_set || item.was_invited}
                upcoming={item?.upcoming_flag}
                past={item?.happened_flag}
                bodyRow
                cardCenter
                centerRow
                cardHr
                cardfooter
                live={item.active_flag}
                join_count={
                  item?.happened_flag === true ? item?.["join_count"] : 0
                }
                viewer_count={
                  item?.active_flag === true ? item?.["viewer_count"] : ""
                }
                invitees_count={
                  item?.upcoming_flag === true
                    ? item?.["invite_count"] - item?.["rejected_count"]
                    : ""
                }
                rt_details={item}
                req_visitor_count={item?.req_visitor_count}
                req_visitor={item.req_visitor_count}
                request_status={item?.invite_requested || item?.was_invited}
                was_invited={item?.was_invited}
                request_access={
                  !item.owner_flag || !item.moderator_flag || !item.speaker_flag
                }
                invitation_code={item?.roundtable_code}
                owner_details={item?.owner}
                is_cancelled={item?.is_cancelled}
                rec_owner_flag={
                  item?.recording?.[0]?.owner_flag === 1 ? true : false
                }
                rec_start_flag={
                  item?.recording?.[0]?.start_recording === 1 ? true : false
                }
                rec_end_flag={
                  item?.recording?.[0]?.soft_end_recording === 0 ? true : false
                }
                media_recording={
                  item?.media_recording?.length > 0
                    ? item?.media_recording
                    : null
                }
                description={item?.description}
                category={item?.category}
                other_count={item?.other_count}
                user_views_count={item?.user_views_count}
                ext={
                  item?.media_recording?.length > 0
                    ? item?.media_recording?.[0]?.["metadata"]?.["ext"]
                    : null
                }
              />
            </div>
          ))}
      </div>
    </div>
  );
}
