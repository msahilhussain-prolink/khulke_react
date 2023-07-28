import axios from "axios";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../../constants/env";
import { auto_login_continue } from "../../utils/utils";

let current_user = null;
const FormData = require("form-data");

try {
  if (localStorage.current_user) {
    current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );
  } else {
    // window.location.replace("/");
  }
} catch (err) {
  // window.location.replace("/");
}
//TODO: Combine with block function
export const warnUser = (rt_id) => {
  alert("You've been warned by the moderator!");
  var data = new FormData();
  data.append("user_id", current_user._id);

  var configwarn = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/moderator-actions/moderator-warn/${rt_id}`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: data,
  };

  axios(configwarn)
    .then((res) => {
      if (res.status === 200) {
        return true;
      }
      return false;
    })
    .catch(async function (error) {
      const res = error.response;
      if (!res) {
        return false;
      }

      if (res.status === 401) {
        return await auto_login_continue(() => warnUser(rt_id));
      }
    });
};

export const addWildcard = (rt_id, username) => {
  var data = new FormData();
  data.append(
    "data",
    '{"rt_id":"' +
      rt_id +
      '", "speakers": {"user_id" :"","type" : "WILDCARD", "username":"' +
      username +
      '"}}'
  );
  var config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/wildcard-speakers/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      if (response.status === 200) {
        return true;
      }
      return false;
    })
    .catch(async function (error) {
      const res = error.response;
      if (!res) {
        return false;
      }

      if (res.status === 401) {
        return await auto_login_continue(() => addWildcard(rt_id, username));
      }
    });
};

export const removeWildcard = (rt_id, username) => {
  const data = {
    roundtable_id: rt_id,
    username: username,
  };
  var config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/remove-wildcard/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: JSON.stringify(data),
  };

  axios(config)
    .then((res) => {
      if (res.status === 200) {
        return true;
      }
      return false;
    })
    .catch(async function (error) {
      const res = error.response;
      if (!res) {
        return false;
      }

      if (res.status === 401) {
        return await auto_login_continue(() => removeWildcard(rt_id, username));
      }
    });
};
export const removeSelfWildcard = (rt_id) => {
  let data = {
    rt_id: rt_id,
  };
  var config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/wildcard-remove/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: JSON.stringify(data),
  };

  axios(config)
    .then((res) => {
      if (res.status === 200) {
        return true;
      }
      return false;
    })
    .catch(async function (error) {
      const res = error.response;
      if (!res) {
        return false;
      }

      if (res.status === 401) {
        return await auto_login_continue(() => removeSelfWildcard(rt_id));
      }
    });
};

export const leaveRT = (rt_id) => {
  const anonymous_user = localStorage.anonymous_user;

  let access;

  access = localStorage.access || JSON.parse(anonymous_user).token;

  var config = {
    method: "get",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}${
      anonymous_user ? "/anonymous" : ""
    }/${rt_id}/leave`,
    headers: {
      Authorization: `Bearer ${access}`,
    },
  };

  axios(config)
    .then(function (response) {
      if (response.status === 200) {
        return true;
      }
      return false;
    })
    .catch(async function (error) {
      const res = error.response;
      if (!res) {
        return false;
      }

      if (res.status === 401) {
        return await auto_login_continue(() => leaveRT(rt_id));
      }
    });
};

export const sendHistoricalMessage = (rt_id, message, panel) => {
  var data = {
    roundtable_id: rt_id,
    message: message,
    panel: panel,
  };

  var config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/panelist-chat/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };

  axios(config)
    .then((response) => {
      if (response.status === 200) {
        return true;
      }
      return false;
    })
    .catch(async function (error) {
      const res = error.response;
      if (!res) {
        return false;
      }

      if (res.status === 401) {
        return await auto_login_continue(() =>
          sendHistoricalMessage(rt_id, message, panel)
        );
      }
    });
};

export const blockUser = (rt_id, leaveChannel) => {
  var data = new FormData();
  data.append("user_id", current_user._id);

  var config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/moderator-actions/moderator-block/${rt_id}`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: data,
  };

  axios(config)
    .then((response) => {
      if (response.status === 200) {
        leaveChannel();
        return true;
      }
      return false;
    })
    .catch(async function (error) {
      const res = error.response;
      if (!res) {
        return false;
      }

      if (res.status === 401) {
        return await auto_login_continue(() => blockUser(rt_id, leaveChannel));
      }
    });
};
