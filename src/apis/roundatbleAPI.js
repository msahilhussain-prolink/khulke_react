import axios from "axios";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V2,
  RT_MEDIA_URL,
} from "../constants/env";
import { auto_login_continue, device_info } from "../utils/utils";

export const RoundTable = async ({ type, limit, skip, token }) => {
  const data = JSON.stringify({ type, limit, skip });

  const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));

  let config = {
    method: "post",
    url: `${
      anonymous_user
        ? REACT_APP_BASE_URL_FOR_ROUNDTABLE
        : REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1
    }${anonymous_user ? "/anonymous" : ""}/paginate/`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: data,
  };
  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return RoundTable({
          type,
          limit,
          skip,
          token: localStorage.getItem("access"),
        });
      });
    });
};

export const SingleRoundTable = async ({ rt_id, token }) => {
  const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));
  let config = {
    method: "get",
    url: `${
      anonymous_user
        ? REACT_APP_BASE_URL_FOR_ROUNDTABLE
        : REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1
    }/${anonymous_user ? "anonymous/" : ""}get-single-roundtable/${rt_id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return SingleRoundTable({
          rt_id,
          token: localStorage.getItem("access"),
        });
      });
    });
};

export const DisclaimerRoundTable = async ({ token }) => {
  const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));

  let config = {
    method: "get",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/${
      anonymous_user ? "anonymous/" : ""
    }get_disclaimer`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return DisclaimerRoundTable({
          token: localStorage.getItem("access"),
        });
      });
    });
};

export const SetRTReminder = async ({ rt_id }) => {
  let config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/set-reminder`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ roundtable_id: rt_id }),
  };
  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return SetRTReminder({
          rt_id,
        });
      });
    });
};

export const createEditRt = async ({
  url,
  data,
  rt_id,
  org_logo,
  brand_logo,
  sub_brand_logo,
  intro,
  outro,
}) => {
  const FormData = require("form-data");
  const form_data = new FormData();
  form_data.append("data", JSON.stringify(data));
  form_data.append("device_info", JSON.stringify(device_info));

  if (url === "edit-roundtable") {
    if (org_logo?.length !== 0) {
      form_data.append("org_logo", org_logo);
      form_data.append("org_logo_position", "bottom left");
    }
    if (brand_logo?.length !== 0) {
      form_data.append("brand_logo", brand_logo);
      form_data.append("brand_logo_position", "top right");
    }
    if (sub_brand_logo?.length !== 0) {
      form_data.append("sub_brand_logo", sub_brand_logo);
      form_data.append("sub_brand_logo_position", "top left");
    }
    if (intro?.length !== 0) {
      form_data.append("intro", intro);
    }
    if (outro?.length !== 0) {
      form_data.append("outro", outro);
    }
  }
  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/${url}/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: form_data,
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return createEditRt({
          url,
          data,
          rt_id,
        });
      });
    });
};

export const invite_panelist = async ({ data }) => {
  const FormData = require("form-data");
  const form_data = new FormData();
  form_data.append("data", JSON.stringify(data));
  form_data.append("device_info", JSON.stringify(device_info));
  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/invite-pannelist/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: form_data,
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return invite_panelist({ data });
      });
    });
};

export const invite_visitor = async ({ data }) => {
  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/invite-visitors/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
      "Content-Type": "application/json",
    },
    data: data,
  };
  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return invite_visitor({ data });
      });
    });
};

export const getInviteeList = async ({ rt_id, skip }) => {
  const data = JSON.stringify({
    device_info: device_info,
    rt_id: rt_id,
    skip: skip,
    limit: 15,
  });

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/get-invitee-list/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return getInviteeList({ rt_id, skip });
      });
    });
};

export const getViewList = async ({ rt_id }) => {
  const config = {
    method: "get",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/get-access-rt-request/${rt_id}`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return getViewList({ rt_id });
      });
    });
};

export const acceptAccess = async ({ rt_id, user_id }) => {
  const FormData = require("form-data");
  const data = new FormData();
  let accept_data = {
    roundtable_id: rt_id,
    type: "SEEK-INVITATION",
    request_user: user_id,
  };

  data.append("data", JSON.stringify(accept_data));

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/accept-access-request/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: data,
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return acceptAccess({ rt_id, user_id });
      });
    });
};

export const requestAccess = async ({ rt_id }) => {
  const FormData = require("form-data");
  const data = new FormData();
  let requestValue = {
    roundtable_id: rt_id,
    type: "SEEK-INVITATION",
  };

  data.append("data", JSON.stringify(requestValue));

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/seek-invitation/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: data,
  };
  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return requestAccess({ rt_id });
      });
    });
};

export const ownerRights = async ({ ownerRight, user_id, rt_id }) => {
  const data = JSON.stringify({
    flag: ownerRight,
    moderator_id: user_id,
    rt_id: rt_id,
  });

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/change_moderator_rights/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return ownerRights({ ownerRight, user_id, rt_id });
      });
    });
};

export const deleteRT = async ({ rt_id }) => {
  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/delete/${rt_id}`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return deleteRT({ rt_id });
      });
    });
};

export const RtAction = async ({
  rt_id,
  action,
  last_video_time,
  total_time_spend,
}) => {
  const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));

  let data = {
    device_info: device_info,
    rt_id: rt_id,
    rt_action: action,
  };

  if (action === "VIEW") {
    data["last_video_time"] = last_video_time;
    data["total_time_spend"] = total_time_spend;
  }

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V2}/${
      anonymous_user ? "anonymous/" : ""
    }rt-action`,
    headers: {
      Authorization: `Bearer ${
        anonymous_user ? anonymous_user?.token : localStorage.access
      }`,
      "Content-Type": "application/json",
      "X-API-Version": "1.1",
    },
    data: JSON.stringify(data),
  };

  return axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return RtAction({ rt_id, action });
      });
    });
};

export const createRecRT = async ({ data1, recVid, img, data2 }) => {
  const FormData = require("form-data");
  const formData = new FormData();

  formData.append("data", JSON.stringify(data1));
  formData.append("audio/video", recVid);
  if (img?.length !== 0) {
    formData.append("image", img);
  }
  formData.append("panelist_data", JSON.stringify(data2));

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V2}/create_rt_media/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: formData,
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return createRecRT({ data1, recVid, img, data2 });
      });
    });
};

export const logoVideos = async ({
  logo1,
  logo2,
  logo3,
  ivid,
  ovid,
  rt_id,
}) => {
  const data = new FormData();
  if (logo1?.length !== 0) {
    data.append("org_logo", logo1);
    data.append("org_logo_position", "bottom left");
  }
  if (logo2?.length !== 0) {
    data.append("brand_logo", logo2);
    data.append("brand_logo_position", "top right");
  }
  if (logo3?.length !== 0) {
    data.append("sub_brand_logo", logo3);
    data.append("sub_brand_logo_position", "top left");
  }
  if (ivid?.length !== 0) {
    data.append("intro", ivid);
  }
  if (ovid?.length !== 0) {
    data.append("outro", ovid);
  }
  data.append("roundtable_id", rt_id);
  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/upload/media`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };

  try {
    return await axios(config);
  } catch (e) {
    const res = e.response;
    if (!res) return;
    if (res.status !== 401) return res;
    return await await auto_login_continue(() => {
      return logoVideos({ logo1, logo2, logo3, ivid, ovid, rt_id });
    });
  }
};

export const deleteLogoVideos = async ({
  logoDelFlag1,
  logoDelFlag2,
  logoDelFlag3,
  ividDelFlag,
  ovidDelFlag,
  rt_id,
}) => {
  const formData = new FormData();

  if (logoDelFlag1 === true) {
    formData.append("org_logo_delete", logoDelFlag1);
  }
  if (logoDelFlag2 === true) {
    formData.append("brand_logo_delete", logoDelFlag2);
  }
  if (logoDelFlag3 === true) {
    formData.append("sub_brand_logo_delete", logoDelFlag3);
  }
  if (ividDelFlag === true) {
    formData.append("intro_delete", ividDelFlag);
  }
  if (ovidDelFlag === true) {
    formData.append("outro_delete", ovidDelFlag);
  }

  const config = {
    method: "delete",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/media-delete/${rt_id}`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: formData,
  };

  try {
    return await axios(config);
  } catch (e) {
    const res = e.response;
    if (!res) return;
    if (res.status !== 401) return res;
    return await await auto_login_continue(() => {
      return logoVideos({ logo1, logo2, logo3, ivid, ovid, rt_id });
    });
  }
};

export const onImageDocChange = async ({ rt_id, imgFile, file }) => {
  const reader = new FileReader();
  reader.onloadend = async function () {
    const FormData = require("form-data");
    const data = new FormData();
    data.append(file, imgFile);
    data.append("roundtable_id", rt_id);

    const config = {
      method: "post",
      url: `${RT_MEDIA_URL}`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    try {
      return await axios(config);
    } catch (e) {
      const res = e.response;

      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(() =>
          onImageChange({ rt_id, imgFile })
        );
      }
    }
  };
  reader.readAsDataURL(imgFile);
};

export const onDocImageDelete = async ({ rt_id, fileName }) => {
  let data = null;

  data = {
    roundtable_id: rt_id,
    file_name: fileName,
  };

  var config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/delete-media/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(onDocImageDelete({ rt_id, fileName }));
      }
    });
};

export const joinRT = async (rt_id) => {
  let access;

  const anonymous_user = localStorage.anonymous_user;

  access = localStorage.access || JSON.parse(anonymous_user).token;

  let config = {
    method: "get",
    url: `${
      anonymous_user
        ? REACT_APP_BASE_URL_FOR_ROUNDTABLE
        : REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1
    }${anonymous_user ? "/anonymous" : ""}/${rt_id}/join`,
    headers: {
      Authorization: `Bearer ${access}`,
    },
  };

  return axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(joinRT({ rt_id }));
      }
    });
};
