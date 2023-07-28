import urlMetaDataApi from "../../apis/urlMetaDataApi";
import { getMetaDataFail, getMetaDataStart, getMetaDataSuccess } from "../actions/urlMetaData";

export const getMetaDataAction = (target_url) => {
    return (dispatch) => {
      dispatch(getMetaDataStart());
      urlMetaDataApi(target_url)
        .then((res) => {
            dispatch(getMetaDataSuccess(res.data));
        })
        .catch((err) => {
          dispatch(getMetaDataFail(err));
        });
    };
  };