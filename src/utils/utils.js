import axios from "axios";
import JSEncrypt from "jsencrypt";
import logoutUser from "../apis/logoutUser";
import { allWords } from "../App";
import {
  ENCRYPTED_PASSWORD_KEY,
  LOGIN_URL,
  PUBLIC_TOKEN,
  PUBLIC_TOKEN_URL,
  STATIC_TOKEN,
  updatePublicToken,
} from "../constants/env";
import allWordsH from "../lang/hindi";
import allWordsT from "../lang/tamil";
import allWordsE from "../lang/english";
import { isEmpty, isString } from "lodash";
import logger from "../logger";
import fs from "fs";

export function replaceURLs(title) {
  if (!title) return;

  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return title.replace(urlRegex, function (url) {
    var hyperlink = url;
    if (!hyperlink.match("^https?://")) {
      hyperlink = "http://" + hyperlink;
    }
    return (
      '<div><a target="_blank" style="color: #009AD3;" href="' +
      hyperlink +
      '" rel="noopener noreferrer">' +
      url +
      "</a></div>"
    );
  });
}
// export function replaceURLs(title) {
//   if (!title) return;
//   var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
//   return title.replace(urlRegex, "")
// }

export function filterURLs(title) {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return title.match(urlRegex);
}

//!Redirect to user's profile in a new tab
export const profileRedirect = (username) => {
  if (!username) {
    return;
  }
  window.open(`${window.location.origin}/profile?username=${username}`);
};

//! Identify if a document is of a valid type
export const validDocType = (docname, extensions) => {
  if (extensions.length === 0 && !docname.includes(".")) {
    return false;
  }
  let file_ext = docname.split(".").at(-1);

  let result = extensions.filter((ext) => {
    if (ext === file_ext) {
      return true;
    }
  });
  return result.length > 0;
};

//not dependent on backend to remove cross site scripts, plus treat html code messages as normal string instead of hiding it
const RE_URL = /(((https?:\/\/)|(www\.))[^\s]+)/g;

export const linkify = (str) => {
  let match;
  const results = [];
  let lastIndex = 0;
  while ((match = RE_URL.exec(str))) {
    const link = match[0];
    if (lastIndex !== match.index) {
      const text = str.substring(lastIndex, match.index);
      results.push(<span key={results.length}>{text}</span>);
    }

    let hyperlink = link;
    if (!hyperlink.match("^https?://")) {
      hyperlink = "http://" + hyperlink;
    }

    results.push(
      <a
        key={results.length}
        href={hyperlink}
        target="_blank"
        style={{
          textDecoration: "none",
          color: "blue",
        }}
      >
        {link}
      </a>
    );
    lastIndex = match.index + link.length;
  }
  if (results.length === 0) {
    return str;
  }
  if (lastIndex !== str.length) {
    results.push(<span key={results.length}>{str.substring(lastIndex)}</span>);
  }
  return results;
};

const getPuToken = async () => {
  var config = {
    method: "get",
    url: PUBLIC_TOKEN_URL,
    headers: {
      Authorization: STATIC_TOKEN,
    },
  };

  const response = await axios(config);
  updatePublicToken(response.data.data[0]);
  return response.data.data[0];
};

export const get_encrypted_password = async (password) => {
  if (!PUBLIC_TOKEN) {
    await getPuToken();
  }

  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(PUBLIC_TOKEN);
  return encrypt.encrypt(password);
};

export const auto_login_continue = async (recall) => {
  const encrypted_password = localStorage.getItem(ENCRYPTED_PASSWORD_KEY);
  const currentUser = localStorage.getItem("current_user");

  if (!encrypted_password && currentUser) {
    if (!JSON.parse(currentUser).anonymous) logoutUser();
  } else if (!currentUser && !encrypted_password) {
    return;
  } else {
    const username = JSON.parse(localStorage.getItem("current_user")).username;

    if (!username) return;

    const data = JSON.stringify({
      username,
      password: encrypted_password,
    });

    const config = {
      method: "POST",
      url: LOGIN_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data,
    };

    const response = await axios(config);

    if (response.status !== 200) {
      logger.info("logged out user");
      return logoutUser();
    }

    const access = response.data.access;
    const refresh = response.data.refresh;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("tokens", JSON.stringify({ access, refresh }));
    localStorage.setItem("current_user", JSON.stringify(response.data));
    if (recall) {
      return recall();
    } else {
      window.location.reload();
    }
  }
};

export const getCursorXY = (input, selectionPoint) => {
  if (!input) return;

  const { offsetLeft: inputX, offsetTop: inputY } = input;

  const div = document.createElement("div");

  const copyStyle = getComputedStyle(input);
  for (const prop of copyStyle) {
    div.style[prop] = copyStyle[prop];
  }

  const swap = ".";
  const inputValue =
    input.tagName === "INPUT" ? input.value.replace(/ /g, swap) : input.value;

  const textContent = inputValue.substr(0, selectionPoint);

  div.textContent = textContent;

  if (input.tagName === "TEXTAREA") div.style.height = "auto";

  if (input.tagName === "INPUT") div.style.width = "auto";

  const span = document.createElement("span");

  span.textContent = inputValue.substr(selectionPoint) || ".";

  div.appendChild(span);

  document.body.appendChild(div);

  const { offsetLeft: spanX, offsetTop: spanY } = span;

  const { offsetTop: divY } = div;

  document.body.removeChild(div);

  return {
    x: inputX + spanX,
    y: inputY + spanY - document.body.offsetHeight,
  };
};

export const getCusrorPosition = (input) => {
  if (!input) return;

  const {
    offsetLeft,
    offsetTop,
    offsetHeight,
    offsetWidth,
    scrollLeft,
    scrollTop,
    selectionEnd,
    value,
  } = input;

  const { lineHeight, paddingRight } = getComputedStyle(input);
  const text = value.slice(0, selectionEnd);
  const words = text.split(/\r?\n/).join(" ").split(" ");
  const lastword = words[words.length - 1];

  const { x, y } = getCursorXY(input, selectionEnd - lastword.length);

  const newLeft = Math.min(
    x - scrollLeft,
    offsetLeft + offsetWidth - parseInt(paddingRight, 10)
  );

  const newTop = Math.min(
    y - scrollTop + parseInt(lineHeight, 10),
    offsetTop + offsetHeight
  );

  return { left: newLeft, top: newTop };
};

export const moengageEvent = async (event_name, component, props) => {
  let data1 = "";

  if (navigator.geolocation) {
    data1 = navigator.geolocation.getCurrentPosition(
      (position) => (data1 = position)
    );
  }

  let data = {
    ID: JSON.parse(localStorage.current_user || localStorage.anonymous_user)?.[
      "_id"
    ],
    // "K Device ID" :,
    Device: "web",
    OS: navigator.platform,
    "OS Version": "v1",
    // "Model": ,
    // "Model Name" : ,
    "App Version": 1,
    "Build Version": 1,
    // IP: res?.data?.IPv4,
    // City: res?.data?.city,
    // State: res?.data?.state,
    // Country: res?.data?.country_name,
    // "Country Code": res?.data?.country_code,
    // Postcode: res?.data?.postal,
    Latitude: data1?.coords?.latitude,
    Longitude: data1?.coords?.longitude,
    Component: component,
    "Is UnReg":
      !localStorage.currentUser && localStorage.anonymous_user ? 1 : 0,
  };

  window.Moengage.track_event(event_name, { ...data, ...props });
};

export const langFunc = () => {
  let local = JSON.parse(
    localStorage.getItem("current_user")
  )?.display_language;
  switch (local) {
    case "en":
      return allWordsE;

    case "hi":
      return allWordsH;

    case "ta":
      return allWordsT;

    default:
      return allWordsE;
  }
};

const getMatchingMonth = (d) => {
  const getMonths = Object.keys(allWordsE.dateTime.months);
  return getMonths.find((m) => m === d.toLowerCase());
};

export const filterDateTrans = (data) => {
  let newDate = data;
  let local = JSON.parse(
    localStorage.getItem("current_user")
  )?.display_language;
  if (local === "en" || isEmpty(data)) {
    return data;
  }
  const splitDate = data.split(" ");
  const monthIndex = splitDate.findIndex(
    (d) => isString(d) && getMatchingMonth(d)
  );
  if (monthIndex >= 0) {
    const Month = splitDate[monthIndex];
    const monthKey = getMatchingMonth(Month);
    splitDate[monthIndex] = allWords.dateTime.months[monthKey];
    newDate = splitDate.join(" ");
  }

  return newDate;
};

export const isEngContent = () => {
  return (
    JSON.parse(localStorage.getItem("current_user"))?.display_language === "en"
  );
};

export const isHindiContent = () => {
  return (
    JSON.parse(localStorage.getItem("current_user"))?.display_language === "hi"
  );
};
export const stopKeyboardShortcuts = () => {
  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "S":
      case "s":
        if (
          window.location.origin !== "http://localhost:3000" &&
          event.ctrlKey
        ) {
          event.preventDefault();
        }
        break;
      case "F12":
      case "f12":
        if (window.location.origin !== "http://localhost:3000") {
          event.preventDefault();
        }
        break;
      case "I":
      case "i":
      case "J":
      case "j":
      case "K":
      case "k":
        if (
          window.location.origin !== "http://localhost:3000" &&
          event.ctrlKey &&
          event.shiftKey
        ) {
          event.preventDefault();
        }
        break;
      case "U":
      case "u":
        if (
          window.location.origin !== "http://localhost:3000" &&
          event.ctrlKey
        ) {
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  });
};

export function getTimeRemaining(t, n) {
  let timeout = t;
  let now = n;
  const total = timeout - now;
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  return {
    total,
    hours,
    minutes,
    seconds,
  };
}

export const device_info = {
  device_name: navigator.userAgent,
  platform: navigator.platform,
  platform_version: navigator.platform,
  app_version: "0.1.0",
  latitude: 0.0,
  longitude: 0.0,
  ip_address: "",
};
