import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";

const getPersonalDetailsApi = async() => {
    const data = JSON.stringify({
        username: JSON.parse(
          localStorage.current_user || localStorage.anonymous_user
        )["username"],
      });
      const config = {
        method: "post",
        url: `${REACT_APP_BASE_URL_FOR_USER}/profile/`,
        headers: {
          Authorization: `Bearer ${localStorage.access}`,
          "Content-Type": "application/json",
        },
        data: data,
      };
  
     return await axios(config)
}

export default getPersonalDetailsApi;