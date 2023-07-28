import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  posts: {
    old_post: [],
    new_post: [],
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

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    // ** GET POST
    case actionTypes.GET_POST_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_POST_SUCCESS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };
    case actionTypes.GET_POST_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    // ** Add POST
    case actionTypes.ADD_POST_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_POST_SUCCESS:
      return {
        ...state,
        post_res: action.payload,
        loading: false,
      };
    case actionTypes.ADD_POST_FAIL:
      return {
        ...state,
        loading: false,
      };

    // ** LIKE
    case actionTypes.LIKE_START:
      return {
        ...state,
      };
    case actionTypes.LIKE_SUCCESS:
      return {
        ...state,
        likeData: action.payload,
      };
    case actionTypes.LIKE_FAIL:
      return {
        ...state,
      };
    // ** DISLIKE
    case actionTypes.DISLIKE_START:
      return {
        ...state,
      };
    case actionTypes.DISLIKE_SUCCESS:
      return {
        ...state,
        dislikeData: action.payload,
      };
    case actionTypes.DISLIKE_FAIL:
      return {
        ...state,
      };
    // ** Add Quote Post
    case actionTypes.ADD_QUOTE_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_QUOTE_SUCCESS:
      return {
        ...state,
        quoteData: action.payload,
        loading: false,
      };
    case actionTypes.ADD_QUOTE_FAIL:
      return {
        ...state,
        loading: false,
      };
    // ** Add Circulate Post
    case actionTypes.ADD_CIRCULATE_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_CIRCULATE_SUCCESS:
      return {
        ...state,
        circulateData: action.payload,
        loading: false,
      };
    case actionTypes.ADD_CIRCULATE_FAIL:
      return {
        ...state,
        loading: false,
      };
    // ** Add Reply
    case actionTypes.ADD_REPLY_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_REPLY_SUCCESS:
      return {
        ...state,
        replyData: action.payload,
        loading: false,
      };
    case actionTypes.ADD_REPLY_FAIL:
      return {
        ...state,
        loading: false,
      };

    // ** Post Delete
    case actionTypes.DELETE_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.DELETE_SUCCESS:
      return {
        ...state,
        postDeleteRes: action.payload,
        loading: false,
      };
    case actionTypes.DELETE_FAIL:
      return {
        ...state,
        loading: false,
      };

    // ** Post Mute
    case actionTypes.MUTE_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.MUTE_SUCCESS:
      return {
        ...state,
        postMuteRes: action.payload,
        loading: false,
      };
    case actionTypes.MUTE_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default postReducer;
