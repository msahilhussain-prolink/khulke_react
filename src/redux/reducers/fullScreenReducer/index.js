const initialState = { full: false };

const fullScreenReducer = (state = initialState, action) => {
    switch (action.type) {
        case "full":
            return { full: true };
        case "notFull":
            return { full: false };
        default:
            return state;
    }
};

export default fullScreenReducer;
