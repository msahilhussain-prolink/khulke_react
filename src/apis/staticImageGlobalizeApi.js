import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { device_info } from "../utils/utils";

export const checkIfImagesNeedsToBeChanged = async () => {
  if (localStorage?.access) {
    return await axios
      .post(
        `${REACT_APP_BASE_URL_FOR_USER}/update-device-info-on-app-launch/`,
        {
          device_info: device_info,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage?.access}`,
          },
        }
      )
      .then()
      .catch((err) => console.log(err));
  }
};

export const fetchNewImages = async (
  url = "https://khulkedev-public-cdn.s3.ap-south-1.amazonaws.com/static/updated/files/si_v1.json"
) => {
  return await axios
    .get(url)
    .then()
    .catch((err) => console.log({ err }));
};
