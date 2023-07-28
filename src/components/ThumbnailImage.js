import { REACT_APP_BASE_URL_CLOUDFRONT } from "../constants/env";

const ThumbnailImage = (rtDetails) => {
  if (
    rtDetails?.media?.length &&
    rtDetails?.media[0]?.metadata?.tempFilename &&
    rtDetails?.owner?.user_id
  ) {
    const url = `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${rtDetails?.owner?.user_id}/roundtable/${rtDetails?._id}/profile/${rtDetails?.media[0]?.metadata?.tempFilename}`
    return url;
  } else if (rtDetails?.thumbnail_url && rtDetails?.thumbnail_url !== "") {
    return rtDetails?.thumbnail_url;
  } else {
    return undefined;
  }
};
export default ThumbnailImage;
