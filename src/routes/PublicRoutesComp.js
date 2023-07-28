import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import FallBackSpinner from "../components/FallBackSpinner";
import { REACT_APP_BASE_URL_FOR_USER, STATIC_TOKEN } from "../constants/env";
import ToastHandler from "../utils/ToastHandler";

export default function PublicRoutesComp({ component: Component, path }) {
  const [loggingAnonymousUser, setLoggingAnnonymousUser] = useState(true);

  const fetchAnonymousUser = async () => {
    const ip_address =
      Math.floor(Math.random() * 255) +
      1 +
      "." +
      Math.floor(Math.random() * 255) +
      "." +
      Math.floor(Math.random() * 255) +
      "." +
      Math.floor(Math.random() * 255);

    const config = {
      url: `${REACT_APP_BASE_URL_FOR_USER}/anonymous_user_entry/`,
      method: "POST",
      data: {
        deviceinfo: {
          device_name: navigator.userAgent,
          platform: navigator.platform,
          platform_version: "v1",
          app_version: "1",
          ip_address,
        },
      },
      headers: { Authorization: STATIC_TOKEN },
    };

    const response = await axios(config);

    if (response.status === 200) {
      const data = response.data.data[0];
      localStorage.setItem(
        "anonymous_user",
        JSON.stringify({
          anonymous: true,
          ...data,
        })
      );

      return setLoggingAnnonymousUser(false);
    }
  };

  useEffect(() => {
    const commonPathsNoAuthRequired = [
      "/",
      "/login/password",
      "/login/otp",
      "/signup",
      "/signup/otp",
      "/roundtable/disclaimer",
      "/welcome",
      "/recording",
      "/maintainance",
      "/forgot_password",
      "/faq",
      "/community-guidelines",
      "/support",
      "/privacy-policy",
      "/disclaimers",
      "/terms-conditions",
    ];

    const isCommonPath = commonPathsNoAuthRequired.find(
      (elem) => elem === path
    );

    if (isCommonPath) {
      return setLoggingAnnonymousUser(false);
    }

    const current_user = localStorage.getItem("current_user");
    const anonymous_user = localStorage.getItem("anonymous_user");

    if (current_user || anonymous_user) return setLoggingAnnonymousUser(false);

    if (!current_user) fetchAnonymousUser();
  }, []);

  if (loggingAnonymousUser) return <FallBackSpinner />;

  return <Component />;
}
