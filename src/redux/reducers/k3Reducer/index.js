import {GET_K3_POSTS_SUCCESS, GET_K3_POSTS_FAILURE} from "../../actions/actionTypes";

// Initial state for the K3 posts
const initialState = {
  k3Posts: [],
  error: null,
};

const k3PostsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_K3_POSTS_SUCCESS:
      return {
        ...state,
        k3Posts: action.payload,
        error: null,
      };
    case GET_K3_POSTS_FAILURE:
      return {
        ...state,
        k3Posts: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default k3PostsReducer;
