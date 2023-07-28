import { DEFAULT_META_TAGS } from "../EnvFiles/Env.js";
import {
  GetProfileDetails,
  ProfileToMetaTags,
} from "../ExternalApiCalls/GetProfile.js";

const getUserDetails = async (req, res) => {
  const username = req.params.username;

  if (!username) return res.render("index_main", DEFAULT_META_TAGS);

  const profileDetails = await GetProfileDetails(username);

  if (!profileDetails) return res.render("index_main", DEFAULT_META_TAGS);

  const dynamicMetaTags = ProfileToMetaTags(profileDetails);

  res.render("index_main", dynamicMetaTags);
};

export { getUserDetails };
