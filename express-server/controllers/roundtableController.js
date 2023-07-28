import { DEFAULT_META_TAGS } from "../EnvFiles/Env.js";
import {
  GetSingleRTDetails,
  RTDetailsToMetaTags,
} from "../ExternalApiCalls/GetSingleRT.js";

const getRoundtable = async (req, res) => {
  const rtId = req.query.id;

  if (!rtId) return res.render("index_main", DEFAULT_META_TAGS);

  const rtDetails = await GetSingleRTDetails(rtId);

  if (!rtDetails) return res.render("index_main", DEFAULT_META_TAGS);

  const dynamicMetaTags = RTDetailsToMetaTags(rtDetails);

  res.render("index_main", dynamicMetaTags);
};

const getRecordedRt = async (req, res) => {
  const rtId = req.params.id;

  if (!rtId) return res.render("index_main", DEFAULT_META_TAGS);

  const rtDetails = await GetSingleRTDetails(rtId);

  if (!rtDetails) return res.render("index_main", DEFAULT_META_TAGS);

  const dynamicMetaTags = RTDetailsToMetaTags(rtDetails);

  res.render("index_main", dynamicMetaTags);
};

export { getRecordedRt, getRoundtable };
