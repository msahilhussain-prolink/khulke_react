import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  posts: {
    message: "",
    loading: false,
    error: null,
    post_res: null,
    likeData: null,
    dislikeData: null,
    quoteData: null,
    circulateData: null,
    replyData: null,
    postDeleteRes: null,
    postMuteRes: null,
  },
};

const RTuserInteractionReducer = (state = initialState, action) => {
  switch (action.type) {
    // ** LIKE
    case actionTypes.POST_LIKE_START:
      return {
        ...state,
      };
    case actionTypes.POST_LIKE_SUCCESS:
      return {
        ...state,
        likeData: action.payload,
      };
    case actionTypes.POST_LIKE_FAIL:
      return {
        ...state,
      };
    // ** DISLIKE
    case actionTypes.POST_DISLIKE_START:
      return {
        ...state,
      };
    case actionTypes.POST_DISLIKE_SUCCESS:
      return {
        ...state,
        dislikeData: action.payload,
      };
    case actionTypes.POST_DISLIKE_FAIL:
      return {
        ...state,
      };
    // ** Add Reply
    case actionTypes.ADD_RT_POST_REPLY_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_RT_POST_REPLY_SUCCESS:
      return {
        ...state,
        replyData: action.payload,
        loading: false,
      };
    case actionTypes.ADD_RT_POST_REPLY_FAIL:
      return {
        ...state,
        loading: false,
      };
          // ** Add Quote Post
    case actionTypes.ADD_RT_POST_QUOTE_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_RT_POST_QUOTE_SUCCESS:
      return {
        ...state,
        quoteData: action.payload,
        loading: false,
      };
    case actionTypes.ADD_RT_POST_QUOTE_FAIL:
      return {
        ...state,
        loading: false,
      };
          // ** Add Circulate Post
    case actionTypes.ADD_RT_POST_CIRCULATE_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_RT_POST_CIRCULATE_SUCCESS:
      return {
        ...state,
        circulateData: action.payload,
        loading: false,
      };
    case actionTypes.ADD_RT_POST_CIRCULATE_FAIL:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default RTuserInteractionReducer;
