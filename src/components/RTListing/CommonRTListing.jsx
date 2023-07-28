import { Grid } from "@mui/material";
import RTListingCard from "../RTListingCard";
import RTListingBorderColoring from "./RTListingBorderColoring";
import RTListSentence from "./RTListSentence";
import ThumbnailImage from "../ThumbnailImage";
import Carousel from "./CumtomCarousel/Carousel";
import NoTables from "../ResponseData/NoTable";


const CommonRTListing = ({ data, width, isProfile, type, setRTData, user_id, rtData }) => {
  const RTData = () => {
    return (
      data?.data.length ?
      data?.data
        ?.sort((a, b) => {
          return b._id.localeCompare(a._id);
        })
        ?.map((item) => (
          <Grid
            item
            xl={isProfile ? 4 : 3}
            lg={isProfile ? 6 : 4}
            sm={6}
            xs={12}
            style={{ padding: "5px" }}
            key={item?._id}
          >
            <RTListingCard
              listingDisplay
              broadcast_destination={item.broadcast_destination}
              displayValue={"space-between"}
              style={RTListingBorderColoring(data?.type)}
              rt_id={item?._id}
              cardImg
              cover_img={ThumbnailImage(item)}
              mod_cover_img={ThumbnailImage(item)}
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
                item?.media_recording?.length > 0 ? item?.media_recording : null
              }
              ext={
                item?.media_recording?.length > 0
                  ? item?.media_recording?.[0]?.["metadata"]?.["ext"]
                  : null
              }
              description={item?.description}
              category={item?.category}
              other_count={item?.other_count}
              user_views_count={item?.user_views_count}
              user_type={item?.moderator?.user_type}
            />
          </Grid>
        )):  <NoTables/>
    )
  }
  return data?.data?.length ? (
    <>
      <RTListSentence sentence={data?.sentence}/>
      <Carousel>

      {RTData()}
      </Carousel>

    </>
  ):
  
      <></>

}

export default CommonRTListing;
