const initialState = { showAll: true };

const toggleGridReducer = (state = initialState, action) => {
  switch (action.type) {
    case "one":
      return { showAll: false };
    case "all":
      return { showAll: true };
    default:
      return state;
  }
};

export default toggleGridReducer;
