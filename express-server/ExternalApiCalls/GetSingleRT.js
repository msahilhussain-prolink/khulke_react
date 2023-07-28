import axios from "axios";
import moment from "moment";
import {
  ANONYMOUS_USER_DATA,
  DEFAULT_META_TAGS,
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
} from "../EnvFiles/Env.js";

async function GetSingleRTDetails(id) {
  if (!ANONYMOUS_USER_DATA) return false;

  const config = {
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/anonymous/get-single-roundtable/${id}`,
    method: "get",
    headers: {
      Authorization: `Bearer ${ANONYMOUS_USER_DATA.token}`,
    },
  };

  try {
    const response = await axios(config);
    if (response.status === 200) {
      return response.data.data[0];
    }

    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

const RTDetailsToMetaTags = (rtDetails) => {
  const rtDuration = Math.round(
    (new Date(rtDetails.end).getTime() - new Date(rtDetails.start).getTime()) /
      (1000 * 60).toString()
  );

  let rtType =
    rtDetails.r_type.split("_")[0].slice(0, 1) +
    rtDetails.r_type.split("_")[0].slice(1).toLowerCase();

  if (rtType === "Recording") {
    if (
      rtDetails.media_recording.length < 2 &&
      rtDetails.recording[0].start_recording === 0 &&
      rtDetails.recording[0].end_recording === 0
    ) {
      const val = rtDetails.media_recording[0].metadata.media_type;
      rtType =
        val.split("_")[0].slice(0, 1) +
        val.split("_")[0].slice(1).toLowerCase();
    }
  }

  const metaTags = {
    title: rtDetails.name,
    description:
      rtDetails.description ||
      `Meet Moderator @${rtDetails.moderator.username} on ${moment(
        new Date(rtDetails.start)
      )
        .utcOffset("+05:30")
        .format("MMM DD")} at ${moment(new Date(rtDetails.start))
        .utcOffset("+05:30")
        .format("hh:mm A")} IST for ${rtDuration} mins in ${
        rtDetails.open_to_all.slice(0, 1).toUpperCase() +
        rtDetails.open_to_all.slice(1)
      } ${rtType} Roundtable`,
    image:
      rtDetails.media.length > 0
        ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${rtDetails.owner.user_id}/roundtable/${rtDetails["_id"]}/profile/${rtDetails["media"][0]["metadata"]["tempFilename"]}`
        : DEFAULT_META_TAGS.image,
    keywords: rtDetails.tags.join(",") + rtDetails.category.join(","),
  };

  return metaTags;
};

export { GetSingleRTDetails, RTDetailsToMetaTags };
