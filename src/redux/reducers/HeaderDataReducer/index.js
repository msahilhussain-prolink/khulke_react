import { CircularProgress } from "@mui/material";

const initialState = {
  data: {
    viewer_count: 0,
    show_self: false,
    role: "audience",
    current_user: {},
    mod_pan_list: [],
    // wildcards,
    viewers: [],
    wc_uids: [],
    all_members: [],
    Person: () => {
      return <CircularProgress />;
    },
    MutePerson: [],
    NoUser: () => <></>,
  },
};

const HeaderDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "sendingHeaderData":
      return {
        // ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default HeaderDataReducer;
