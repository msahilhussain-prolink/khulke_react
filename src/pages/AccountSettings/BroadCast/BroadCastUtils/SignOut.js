import axios from "axios";
import ToastHandler from "../../../../utils/ToastHandler";
import { REACT_APP_BASE_URL_FOR_USER } from "../../../../constants/env";
import { fetchLinkedAccounts } from "./Configs";

export const handleSignOut = async (name, setloading) => {
  setloading(true);
  const apiData = {
    data: { platform: name },
    onSuccess: () => {
      ToastHandler("sus", "Account Removed Successfully");
      setloading(false);
    },
    onFailed: () => {
      ToastHandler("dan", "Could not remove account");
      setloading(false);
    },
  };

  try {
    const response = await axios({
      data: apiData.data,
      url: `${REACT_APP_BASE_URL_FOR_USER}/tokens`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    if (response.status === 200) {
      await fetchLinkedAccounts();

      return apiData.onSuccess();
    }

    return apiData.onFailed();
  } catch (e) {
    return apiData.onFailed();
  }
};
