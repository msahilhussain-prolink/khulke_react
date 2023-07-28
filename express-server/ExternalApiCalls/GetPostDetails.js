import axios from "axios";
import {
  ANONYMOUS_USER_DATA,
  DEFAULT_META_TAGS,
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_CLOUDFRONT,
} from "../EnvFiles/Env.js";

const GetPostDetails = async (postId) => {
  if (!ANONYMOUS_USER_DATA) return false;

  const config = {
    url: `${POST_API_BASE_URL}/post/${postId}`,
    method: "post",
    headers: {
      Authorization: `Bearer ${ANONYMOUS_USER_DATA.token}`,
    },
    data: {
      type: "COMMENT",
    },
  };

  try {
    const response = await axios(config);
    if (response.status === 200) {
      return response.data[0];
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const PostToMetaTags = (postDetails) => {
  const { text, username, media, user_id, post_id, name, type, polling_data } =
    postDetails;

  let textDescription;

  if (type.split("_")[0] === "POLL") {
    textDescription = polling_data.question;
  } else {
    textDescription = `${text
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/  +/g, " ")}`;
  }

  let metaTags = {
    title: `${name} (@${username})`,
    description: textDescription || DEFAULT_META_TAGS.title,
  };

  if (media.length > 0)
    metaTags.image = `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${user_id}/post/${post_id}/${media[0].extra.filename}`;

  return metaTags;
};

export { PostToMetaTags, GetPostDetails };
