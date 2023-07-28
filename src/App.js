import "bootstrap/dist/css/bootstrap.min.css";
import { onMessage } from "firebase/messaging";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  gtmIdString,
  IS_ANDROID_OR_IOS,
  MAINTAINANCE_KEY,
  MAINTAINANCE_URL,
  MOBILE_VIEW,
  REACT_APP_VAPID_ID,
} from "./constants/env";
import GlobalStyle from "./global_styles/style";
import { messaging } from "./push_firebase";
import { notificationsState } from "./redux/actions/notificationAction";
import { tokensState } from "./redux/actions/notificationAction/token";
import { routes } from "./routes";
// import KhulKeLogo from "./assets/icons/KhulKe_logo.svg";
import axios from "axios";
import TagManager from "react-gtm-module";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  checkIfImagesNeedsToBeChanged,
  fetchNewImages,
} from "./apis/staticImageGlobalizeApi";
import {
  convertToObj,
  globalImages,
  localImages,
  updatedImagesToShow,
} from "./assets/imagesPath/images";
import MinimizedRoundtable from "./components/MinimizedRT";
import WalkThrough from "./components/WalkThrough";
import { PrivateRouteComponent } from "./routes/PrivateRoute";
import { publicRoute } from "./routes/PublicRoutes";
import PublicRoutesComp from "./routes/PublicRoutesComp";
import SuperParent from "./SuperParent";
import { langFunc, stopKeyboardShortcuts } from "./utils/utils";
import { getInvitationData } from "./redux/actions/InvitationAction";
import { userProfileData } from "./redux/actions/profileAction/userProfileAction";
export let allWords = langFunc();

function App() {
  const tagManagerArgs = {
    gtmId: gtmIdString,
  };
  const navigate = useNavigate();
  const loc = useLocation();
  const [search_params] = useSearchParams();
  let current_user = localStorage.current_user
    ? JSON.parse(localStorage.current_user)
    : null;
  useEffect(() => {
    if (
      localStorage.getItem("current_user") &&
      !JSON.parse(localStorage?.current_user)?.["display_language"]
    ) {
      let data = JSON.parse(localStorage.getItem("current_user"));
      data.display_language = "en";
      localStorage.setItem("current_user", JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (search_params.get("df") == "t") {
      moengageEvent("View Page", "ALL", {
        URL: `${window.location.origin}/app?name=dulitfest`,
        "Custom Name": search_params.get("df") == "t" ? "dulitfest" : "",
      });
    }
  }, [search_params]);

  useEffect(() => {
    if (IS_ANDROID_OR_IOS) {
      if (
        loc.pathname.includes("app") &&
        search_params.get("name") === "dulitfest"
      ) {
        if (navigator.userAgent.match(/android/i)) {
          try {
            // Try to launch the app using the intent URL  window.location.href = intentUrl;
            window.location.href = `intent://www.khulke.com/profile/${search_params.get(
              "name"
            )}/posts#Intent;scheme=https;package=com.khulke.app;end`;
          } catch (error) {
            // If the app is not installed, redirect to the Play Store  window.location.href = storeUrl;
            window.location.href =
              "https://play.google.com/store/apps/details?id=com.khulke.app";
          }
        } else if (navigator.userAgent.match(/iphone|ipad|ipod/i)) {
          window.location.href = `https://www.khulke.com/profile/${search_params.get(
            "name"
          )}/posts`;

          setTimeout(() => {
            window.location.href = `https://apps.apple.com/in/app/khul-ke-social-networking-app/id1590836834`;
          }, 1000);
        }
      }
    }
  }, []);
  const dispatch = useDispatch();

  // GTM Initialization
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
    axios.interceptors.response.use(
      async (response) => {
        if (response?.status === 281) {
          navigate("/maintainance");
        }

        if (response?.status === 502) {
          const apiData = {
            url: MAINTAINANCE_URL,
            method: "GET",
            headers: {
              "x-api-key": MAINTAINANCE_KEY,
            },
          };

          try {
            const res = await axios(apiData);

            if (res?.status === 200) {
              return navigate("/maintainance");
            }

            return response;
          } catch (e) {
            return response;
          }
        }

        return response;
      },
      async (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  let { logo } = globalImages;

  function showNotification(body) {
    let options = {
      body: body,
      icon: { logo },
      dir: "ltr",
    };
  }
  // kk new
  const langChangedApp = useSelector(
    (state) => state.languageChange.langChanged
  );

  useEffect(() => {
    if (langChangedApp == true) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [langChangedApp]);

  function firebase_actions() {
    //FOR PUSH NOTIFICATIONS
    messaging &&
      messaging
        ?.getToken({ vapidKey: REACT_APP_VAPID_ID })
        .then((currentToken) => {
          let current_user = localStorage?.current_user;
          current_user && (current_user = JSON.parse(current_user));
          let data = {};
          if (current_user?.access) {
            data = {
              access: current_user?.access,
              action: "save",
              token: currentToken,
            };
            if (
              currentToken &&
              localStorage?.current_user &&
              current_user?.access
            ) {
              let device_ids = current_user["device_ids"];
              if (device_ids?.length) {
                let temp = [];
                device_ids?.forEach((item) => {
                  temp.push(item["firebase_token"]);
                });
                if (!temp.includes(currentToken)) {
                  dispatch(tokensState(data));
                }
              }
            } else {
              dispatch(tokensState(data));
            }
          }
        })
        .catch();

    onMessage(messaging, (payload) => {
      let notification_body = payload?.data?.data;
      // added if condition as it throws error when notification_body is undefined
      if (notification_body && localStorage?.current_user) {
        showNotification(JSON.parse(notification_body)?.body?.message);
        let data = {
          notification: JSON.parse(notification_body)?.body?.message,
        };
        dispatch(notificationsState(data));
      }
    });
  }

  useEffect(() => {
    allWords = langFunc();
  }, [localStorage.getItem("current_user"), langChangedApp]);

  // for fetching images

  const fetchImages = async () => {
    let existingImages = localStorage.getItem("global_images")
      ? JSON.parse(localStorage.getItem("global_images"))
      : null;

    updatedImagesToShow(existingImages ? existingImages : localImages);

    // Function will not be called for anonymous user
    if (!localStorage?.current_user && localStorage?.anonymous_user) return;

    // integrate api to fetch new version & flag
    const res = await checkIfImagesNeedsToBeChanged();

    if (res?.data?.is_invited) dispatch(getInvitationData());

    if (res?.status !== 200) {
      updatedImagesToShow(localImages);
      return;
    }

    // if !flag, updateImagesToShow(imagesPath) localstorage.removeItem('imagesPath') return
    if (res.data.file_updated * 1 === 0) {
      updatedImagesToShow(localImages);
      localStorage.getItem("global_images") &&
        localStorage.removeItem("global_images");
      return;
    }

    // if flag && existingImage?.version === newversion, return
    const newGlobalImagesVersion =
      res.data?.json_file_path &&
      res.data.json_file_path.split("_")?.[1].split(".")?.[0];

    if (
      res?.data?.file_updated &&
      localStorage.getItem("global_images") &&
      JSON.parse(localStorage.getItem("global_images"))?.version ===
        newGlobalImagesVersion
    ) {
      return;
    }

    // fetch new json & convert array to oject
    const newJsonImagesResponse = await fetchNewImages(
      res.data?.json_file_path
    );
    if(newJsonImagesResponse?.data?.length ) {
    const newImages = convertToObj(newJsonImagesResponse?.data?.static_images);

    // set localstorage images path
    localStorage.setItem(
      "global_images",
      JSON.stringify({
        ...newImages,
        version: newGlobalImagesVersion,
      })
    );

    updatedImagesToShow(newImages);
    }
  };

  useEffect(() => {
    fetchImages();
    firebase_actions();
    stopKeyboardShortcuts();
  }, []);
  useEffect(() => {
    if (current_user?.username) {
      dispatch(userProfileData(current_user?.username));
    }
  }, []);
  useEffect(() => {
    if (
      !window.location.pathname.includes("roundtable") &&
      !window.location.pathname.includes("recording")
    ) {
      document.addEventListener(
        "play",
        function (e) {
          var audios = document.getElementsByTagName("audio");
          for (var i = 0, len = audios.length; i < len; i++) {
            if (audios[i] != e.target) {
              audios[i].pause();
            }
          }
        },
        true
      );
      document.addEventListener(
        "play",
        function (e) {
          var audios = document.getElementsByTagName("video");
          for (var i = 0, len = audios.length; i < len; i++) {
            if (audios[i] != e.target) {
              audios[i].pause();
            }
          }
        },
        true
      );
    }
    if (window.location.pathname === "/roundtable/join") {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
      };
    }
  }, []);

  const privateRoutes = routes.map(({ path, component: Component }, key) => (
    <Route
      element={
        <PrivateRouteComponent>
          <Component />
        </PrivateRouteComponent>
      }
      exact
      path={path}
      key={path}
    />
  ));

  const publicRoutes = publicRoute.map(({ path, component }, key) => (
    <Route
      exact
      path={path}
      element={<PublicRoutesComp component={component} path={path} />}
      key={path}
    />
  ));

  const appComponent = () => (
    <SuperParent>
      <GlobalStyle />
      <MinimizedRoundtable />
      <Routes>
        <Route path="app" element={<Navigate to="/roundtable/all?df=t" />} />
        <Route path="" element={<Navigate to="/roundtable/all" />} />
        {/* <Route
          path="/roundtable/*"
          element={<Navigate to="/roundtable/all" />}
        /> */}
        <Route path="*" element={<Navigate to="/roundtable/all" />} />
        <Route path="/mini" element={<Navigate to="/snip-it" />} />
        <Route path="/signup21" element={<Navigate to="/signup" />} />
        {
          //TODO making static for now
        }
        <Route
          path="/trends/RoundTable"
          element={<Navigate to="/roundtable/all" />}
        />
        <Route
          path="/trends/BigIndianPicture"
          element={
            <Navigate to="/roundtable/recorded/62ebb7ac0c5aeb110b348a6f" />
          }
        />
        <Route
          path="/profile/OpIndia_com/<div%20style="
          element={<Navigate to="/profile/OpIndia_com/posts" />}
        />

        {[...privateRoutes, ...publicRoutes]}
      </Routes>
    </SuperParent>
  );

  return (
    <>
      {!MOBILE_VIEW ? (
        <WalkThrough>{appComponent()}</WalkThrough>
      ) : (
        appComponent()
      )}
    </>
  );
}

export default App;
