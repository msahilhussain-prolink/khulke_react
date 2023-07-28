import axios from "axios";
import logoutUser from "../../apis/logoutUser";
import { auto_login_continue } from "../../utils/utils";

export default function MaidanContentPaginateRt(data, selectedTab) {
  return async (dispatch, getState) => {
    if (!data?.config) return;
    try {
      let response = await axios(data.config);
      if (response.status === 200) {
        data.onSuccess(response.data, selectedTab);
      } else {
        data.onFailed(response.data);
      }
    } catch (e) {
      const response = e.response;

      if (!response) {
        return data.onFailed(e);
      }

      if (response.status === 401) {
        await auto_login_continue(() => {
          const temp = data;

          temp.config.headers.Authorization = `Bearer ${localStorage.getItem(
            "access"
          )}`;

          dispatch(MaidanContentPaginateRt(temp, selectedTab));
        });
      } else {
        data.onFailed(response.data);
      }
    }
  };
}
