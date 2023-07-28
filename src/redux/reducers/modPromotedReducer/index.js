const initialState = ["emptynow"];

const modPromotedReducer = (state = initialState, action) => {
  switch (action.type) {
    case "added":
      return action.payload;

    default:
      return state;
  }
};

export default modPromotedReducer;
