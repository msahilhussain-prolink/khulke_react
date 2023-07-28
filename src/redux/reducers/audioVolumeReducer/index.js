const initialState = { level: 100 };

const audioVolumeReducer = (state = initialState, action) => {
    switch (action.type) {
        case "changeVol":
            return { level: action.payload };
        default:
            return state;
    }
};

export default audioVolumeReducer;
