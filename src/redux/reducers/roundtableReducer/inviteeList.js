import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const inviteeListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INVITEE_LIST_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.INVITEE_LIST_SUCCESS:
      if (state.data) {
        let newPopulatedData;
        let newActionPayload;

        newPopulatedData = state.data.data.data;

        newPopulatedData = [...newPopulatedData, ...action.payload.data.data];

        newActionPayload = {
          ...action.payload,
          data: {
            data: newPopulatedData,
          },
        };

        return {
          ...state,
          loading: false,
          data: newActionPayload,
        };
      }

      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.INVITEE_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.INVITEE_LIST_LOADING_FALSE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default inviteeListReducer;
