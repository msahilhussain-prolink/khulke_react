import axios from "axios";
import { POST_API_BASE_URL } from "../constants/env";
import { device_info } from "../utils/utils";

// ** Add Visitor Comment
export const addVisitorComment = async (formData) => {
  const newFormData = formData;
  newFormData.append("device_info", JSON.stringify(device_info));

  return await axios
    .post(`${POST_API_BASE_URL}/round-table/message/`, newFormData, {
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
    })
    ;
};
