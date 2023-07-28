import axios from "axios";
import ToastHandler from "../../../../utils/ToastHandler";
import { OAUTH_CONFIGS, OAUTH_URLS, fetchLinkedAccounts } from "./Configs";
import { REACT_APP_BASE_URL_FOR_USER } from "../../../../constants/env";

const StoreTokenData = async ({ platform, data, setloading, redirect_uri }) => {
  const APIdata = {
    data: {
      platform,
      ...data,
      redirect_uri,
    },
    onSuccess: () => {
      ToastHandler("sus", `Login with ${platform} successfull`);
      setloading(false);
    },
    onFailed: () => {
      ToastHandler("dan", `Unable to Login ${platform}`);
      setloading(false);
    },
  };

  //call the api here
  try {
    const response = await axios({
      data: APIdata.data,
      method: "POST",
      url: `${REACT_APP_BASE_URL_FOR_USER}/tokens`,
      headers: {
        authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    if (response.status === 200) {
      await fetchLinkedAccounts();

      return APIdata.onSuccess();
    }

    APIdata.onFailed();
  } catch (e) {
    APIdata.onFailed();
  }
};

const handlePlatformSignIn = ({
  setloading,
  signInOptions,
  platform,
  rootUrl,
}) => {
  setloading(true);

  console.log("sign options", signInOptions);
  const query = new URLSearchParams(signInOptions);

  const oAuthUrl = `${rootUrl}?${query.toString()}`;

  //Opening Google Login Consent
  const popupHeight = 600;
  const popupWidth = 500;
  const half = 2;

  const popup = window.open(
    oAuthUrl,
    `OAuthPopup${platform}`,
    `width=${popupWidth}px height=${popupHeight}px left=${
      (screen.width - popupWidth) / half
    } top=${(screen.height - popupHeight) / half}`
  );

  popup.focus();

  const intervalCheckPopupClosed = 2000;

  //Checking if the popup is closed abruptly by the user every 2 secs
  function childWindowClosed() {
    setloading(false);
    ToastHandler("dan", `Login aborted for ${platform}`);
  }

  //Event used to receive data from the Sign in Success screen
  function receiveMessage(event) {
    const params = new URLSearchParams(event.data.type);

    if (event.origin !== window.origin || params.get("platform") !== platform)
      return;

    clearInterval(checkPopupClosed);

    const error = event.data.error;

    const data = { code: event.data.data.code || event.data.data };

    if (data)
      //Send data to backend to Process as needed
      StoreTokenData({
        platform,
        data,
        setloading,
        redirect_uri: signInOptions.redirect_uri,
      });

    if (error) ToastHandler("dan", `Login aborted for ${platform} ${error}`);

    window.removeEventListener("message", receiveMessage);
  }

  const checkPopupClosed = setInterval(() => {
    if (!popup.closed) return;

    childWindowClosed();
    clearInterval(checkPopupClosed);
    window.removeEventListener("message", receiveMessage);
  }, intervalCheckPopupClosed);

  window.addEventListener("message", receiveMessage);
};

export default function handleSignIn(platform, setloading, customScopes) {
  const signInOptions = OAUTH_CONFIGS[platform];
  const rootUrl = OAUTH_URLS[platform];

  return handlePlatformSignIn({
    setloading,
    platform,
    signInOptions: {
      ...signInOptions,
      scope: customScopes || signInOptions.scope,
    },
    rootUrl,
  });
}
