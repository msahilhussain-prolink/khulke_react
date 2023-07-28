const initialState = { langChanged: false };

const languageChangeReducer = (state = initialState, action) => {
    switch (action.type) {
        case "changed":
            return { langChanged: true };
        default:
            return state;
    }
};

export default languageChangeReducer;
