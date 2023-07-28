import { Avatar, Box, Chip, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import RTImg from "../RTListingCard/RTImg";
import { useNavigate } from "react-router-dom";
import ListingParticipants from "../RTListingCard/ListingParticipants";
import moment from "moment";
import DotIcon from "@mui/icons-material/FiberManualRecord";
import { allWords } from "../../App";
import DescComp from "../RTListingCard/DescComp";
import { useMemo } from "react";
import ShareComponent from "../RTListingCard/ShareComponent";
import { ShareOutlined } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";
import { useState } from "react";

const RTCard = (props) => {
  const {
    speakers,
    moderator,
    viewer_count,
    timestamp,
    rt_details,
    rt_nature,
    upcoming,
    past,
    live,
    was_invited,
    is_cancelled,
    rt_type,
    reminder_status,
    request_status,
    rt_id,
    owner_details,
    title,
    cover_img,
    rec_end_flag,
    rec_owner_flag,
    rec_start_flag,
    notificationDisplay,
    listingDisplay,
    owner_flag,
    last_requested_user,
    accepted_count,
    rejected_count,
    invite_by,
    has_accepted,
    has_rejected,
    has_removed,
    audience_flag,
    moderator_flag,
    speaker_flag,
    nt_id,
    acr,
    rt_name,
    invitation_token,
    invitees_count,
    join_count,
    awesomeDisplay,
    media_recording,
    description,
    category,
    user_views_count,
    cardfooter,
    req_visitor_count,
    ext,
    muteFlag,
    setMuteFlag,
    videoElem,
    reject,
    accept,
    time,
    setTime,
    pauseVid,
    playVid,
  } = props;

  const navigate = useNavigate();

  const allTagsCategory = useMemo(() => {
    const cat = category ?? [];
    const tags = rt_details?.tags ?? [];

    return [...cat, ...tags];
  }, [category, rt_details]);
  return (
    <Grid container sx={{borderBottom: "1px solid #e4e9f0"}}>
      <Grid item xs={4}>
        <Box
          as="div"
          sx={{
            cursor: "pointer",
          }}
          onMouseOver={() => {
            setMuteFlag(true);
            setTimeout(playVid, 2000);
          }}
          onMouseLeave={() => {
            setMuteFlag(false);
           pauseVid();
          }}
        >
          <RTImg
            cover_img={cover_img}
            past={past}
            title={title}
            live={live}
            upcoming={upcoming}
            rt_nature={rt_nature}
            rt_type={rt_type}
            rec_end_flag={rec_end_flag}
            rec_owner_flag={rec_owner_flag}
            rec_start_flag={rec_start_flag}
            join_count={join_count}
            is_cancelled={is_cancelled}
            timestamp={timestamp}
            media_recording={media_recording}
            owner_details={owner_details}
            rt_id={rt_id}
            muteFlag={muteFlag}
            setMuteFlag={setMuteFlag}
            videoElem={videoElem}
            rt_details={rt_details}
            listingDisplay={listingDisplay}
            moderator={moderator}
            speakers={speakers}
            navigate={navigate}
            reminder_status={reminder_status}
            reject={reject}
            accept={accept}
            has_accepted={has_accepted}
            acr={acr}
            was_invited={was_invited}
            request_status={request_status}
            time={time}
            setTime={setTime}
            pauseVid={pauseVid}
            ext={ext}
            id={rt_id}
          />
        </Box>
      </Grid>
      <Grid xs={8} flexDirection={"column"} sx={{ padding: "5px 10px" }}>
        <Box as="div">
          <Typography variant="h6" fontWeight={600} fontSize={"1rem"}>
            {title} {title}
          </Typography>
        </Box>
        <Box as="div" sx={{ display: "flex" }}>
          <>
            <p className="time_p text-muted" style={{ marginTop: "0px" }}>
              {past === true ? (
                <>
                  {user_views_count} {allWords.misc.views}
                </>
              ) : (
                <>
                  {live && (
                    <div className="d-flex">
                      {viewer_count}
                      <>
                        &nbsp;
                        {rt_type === "RECORDING_BASED" ? (
                          <>
                            {media_recording?.[0]?.["metadata"]?.[
                              "ext"
                            ].toLowerCase() === "mp3" ? (
                              <p
                                style={{
                                  // color: "#63779c",
                                  textAlign: "center",
                                }}
                              >
                                {allWords.misc.liste}
                              </p>
                            ) : (
                              <p
                                style={{
                                  // color: "#63779c",
                                  textAlign: "center",
                                }}
                              >
                                {allWords.misc.watch}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            {rt_type === "AUDIO_STREAMING" ? (
                              <p
                                style={{
                                  // color: "#63779c",
                                  textAlign: "center",
                                }}
                              >
                                {allWords.misc.liste}
                              </p>
                            ) : (
                              <>
                                {rt_type === "VIDEO_STREAMING" && (
                                  <p
                                    style={{
                                      // color: "#63779c",
                                      textAlign: "center",
                                    }}
                                  >
                                    {allWords.misc.watch}
                                  </p>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    </div>
                  )}
                  {awesomeDisplay && upcoming === true ? (
                    <span style={{ marginLeft: "-5px" }}>
                      0 {allWords.misc.attending}
                    </span>
                  ) : (
                    <>
                      {upcoming && (
                        <>
                          {invitees_count > 0
                            ? "+" + invitees_count + allWords.misc.attending
                            : invitees_count + allWords.misc.attending}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </p>
            <DotIcon
              sx={{
                fontSize: "10px !important",
                margin: "4px 5px 0px",
                color: "#63779c !important",
              }}
              fill="#63779c"
            />{" "}
            <p className="time_p" style={{ marginTop: "0px" }}>
              <span className="text-muted">
                {moment(new Date(timestamp?.["start"]))
                  .local()
                  .format("DD MMM")}
                <span>&nbsp;at&nbsp;</span>
                {moment(new Date(timestamp?.["start"]))
                  .local()
                  .format("hh:mm A")}
              </span>
            </p>
          </>
        </Box>
        <Box as="div">
          <ListingParticipants
            moderator={moderator}
            speakers={speakers}
            timestamp={timestamp}
            user_type={owner_details?.user_type}
            marginTopStyle={"0"}
            hideTime
          />
        </Box>
        <Box as="div">
          <Typography
            variant="p"
            sx={{
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </Typography>
        </Box>
        <Box as="div" display={"flex"}>
          <Stack direction="row" spacing={1} sx={{width: "80%", overflow: "hidden"}}>
            {allTagsCategory.map((item) => (
              <Chip label={item} sx={{borderRadius: "6px", height: "24px"}}/>
            ))}
          </Stack>
          <Box sx={{width: "20%", display: "flex", justifyContent: 'center'}}>
            <ShareIconComp rt_id={rt_id}/>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const ShareIconComp = ({rt_id}) => {

    const rtAction = useSelector((state) => state.rtActionRed.data);

  const [loadingState, setLoadingState] = useState(false);

  const dispatch = useDispatch();

    useEffect(() => {
        if (loadingState) {
          if (rtAction && rtAction?.data?.status == 200) {
            setLoadingState(false);
            navigator.clipboard
              .writeText(rtAction?.data?.data?.[0]?.url)
              .then(function () {
                ToastHandler("sus", allWords.misc.succcopied);
              })
              .catch(function () {
                ToastHandler("dan", "Failed. try again!");
              });
          }
        }
      }, [rtAction]);
    
      const handleShare = () => {
        dispatch(rtActionData({ rt_id: rt_id, action: "SHARE" }));
        setLoadingState(true);
      };
    return (
        <span onClick={handleShare} style={{display:"block"}}>
        <ShareOutlined />
        </span>
    )
};

export default RTCard;
