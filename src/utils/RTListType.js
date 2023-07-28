import RTListingBorderColoring from "../components/RTListing/RTListingBorderColoring";
import { RTType } from "./RTType";

const GetBorderColor = (item) => {
  if (item?.owner_flag) {
    return RTListingBorderColoring(RTType.OWNER);
  } else if (item?.owner_flag !== true && item.moderator_flag === true) {
    return RTListingBorderColoring(RTType.MODERATOR);
  } else if (item?.owner_flag !== true && item.speaker_flag === true) {
    return RTListingBorderColoring(RTType.PANALIST);
  } else if (item?.audience_flag === true) {
    return RTListingBorderColoring(RTType.AUDIENCE);
  } else {
    return RTListingBorderColoring("");
  }
};

export default GetBorderColor;
