import {
  GetPostDetails,
  PostToMetaTags,
} from "../ExternalApiCalls/GetPostDetails.js";

const getPostDetails = async (req, res) => {
  const postId = req.params.postId;

  if (!postId) return res.render("index_main", DEFAULT_META_TAGS);

  const postDetails = await GetPostDetails(postId);

  if (!postDetails) return res.render("index_main", DEFAULT_META_TAGS);

  const dynamicMetaTags = PostToMetaTags(postDetails);

  res.render("index_main", dynamicMetaTags);
};

export { getPostDetails };
