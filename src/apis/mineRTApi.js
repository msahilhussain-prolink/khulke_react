import axios from "axios";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1, REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../constants/env";

export const getRTByCategories =async(data) => {
  let config = {};
  const listdata = {
      user_id: data?.user_id,
      skip: data?.skip,
      limit: data?.limit
    }
    if(localStorage.access || localStorage.getItem("anonymous_user")) {
    if(listdata?.user_id && listdata?.limit) {
      const url = localStorage.getItem("anonymous_user") ? `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/anonymous/get-other-profile-category-rt-list/` : `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/get-other-profile-category-rt-list/`
      config = {
            method: "POST",
            url,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("anonymous_user") ? JSON.parse(localStorage.getItem("anonymous_user"))?.token : localStorage.access}`,
              "Content-Type": "application/json",
            },
            data: listdata
          };
      }
   else {
   config = {
        method: "GET",
        url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/get-role-based-rt-details`,
        headers: {
          Authorization: `Bearer ${localStorage.access}`,
          "Content-Type": "application/json",
        },
      };
    }
  }
     return await axios(config);
}

export const getRTListByCategory =async(data) =>{
    let config = {};
    const listdata = {
        user_id: data?.user_id,
        role: data?.type,
        skip: data?.skip,
        limit: data?.limit
      }
      if(listdata?.user_id && listdata?.type && listdata?.skip && listdata?.limit) {
        config = {
              method: "POST",
              url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/get-role-based-next-rt-details`,
              headers: {
                Authorization: `Bearer ${localStorage.access}`,
                "Content-Type": "application/json",
              },
              data: listdata
            };
        }
        return await axios(config);
}