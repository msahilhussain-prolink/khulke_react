import axios from "axios";
import {
  ANONYMOUS_USER_DATA,
  DEFAULT_META_TAGS,
  POST_API_BASE_URL,
  REACT_APP_BASE_URL,
} from "../EnvFiles/Env.js";

const GetProfileDetails = async (username) => {
  if (!ANONYMOUS_USER_DATA) return false;

  const config = {
    url: `${REACT_APP_BASE_URL}/user/anonymous/user_profile/`,
    method: "post",
    headers: {
      Authorization: `Bearer ${ANONYMOUS_USER_DATA.token}`,
    },
    data: {
      username: username,
    },
  };

  try {
    const response = await axios(config);
    if (response.status === 200) {
      return response.data.data;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const ProfileToMetaTags = (profileDetails) => {
  const { name, one_liner, username, profile_photo } =
    profileDetails.user_other;

  let profileImage;

  if (!profile_photo || profile_photo?.length < 1) {
    profileImage = `https://via.placeholder.com/300x300/66B984/FFFFFF?text=${username[0].toUpperCase()}`;
  } else {
    profileImage = `${POST_API_BASE_URL}/profile-photo/${username}/pp`;
  }

  const metaTags = {
    title: `${name} (@${username})`,
    description: `${one_liner}`,
    image: profileImage,
    keywords: DEFAULT_META_TAGS.keywords,
  };

  return metaTags;
};

export { GetProfileDetails, ProfileToMetaTags };
