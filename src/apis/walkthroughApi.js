import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

export async function walkthroughApi({ walkthrough_step, is_interested }) {
  const data = JSON.stringify({
    walkthrough_step: walkthrough_step,
    is_interested: is_interested,
  });

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_USER}/walkthrough/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: data,
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        await auto_login_continue(() => {
          return walkthroughApi({
            walkthrough_step,
            is_interested,
          });
        });
      }
      return res;
    });
}
