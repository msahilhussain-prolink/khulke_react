import { useEffect, useState } from "react";
import { getPostData } from "../../redux/actions/postAction";
import { useDispatch, useSelector } from "react-redux";

const useScroll = ({ limit }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const allPostData = useSelector((state) => state.post.posts);
  const postLoading = useSelector((state) => state.post.loading);

  useEffect(() => {
    dispatch(getPostData(limit));
  }, [limit]);

  return { allPostData };
};

export default useScroll;
