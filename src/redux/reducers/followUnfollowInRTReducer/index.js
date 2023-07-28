const initialState = { followings: [] };

const followUnfollowInRTReducer = (state = initialState, action) => {
    switch (action.type) {
        case "following":
            return { followings: action.payload };

        default:
            return state;
    }
};

export default followUnfollowInRTReducer;
