import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import { PrivateRouteComponent } from "./PrivateRoute";

const PageNotFound = lazy(() => import("../pages/Error/pageNotFound"));
const Followers = lazy(() => import("../pages/Followers"));
const Profile = lazy(() => import("../pages/Profile"));
const FallBackSpinner = lazy(() => import("../components/FallBackSpinner"));

export default function ProfileLayout() {
  // vars
  const url_search_params = new URL(window.location.href);
  const username = url_search_params.pathname.split("/")[2];
  const [searchParams] = useSearchParams();
  const searchedUsername = searchParams.get("username");
  //
  return (
    <>
      <Suspense fallback={<FallBackSpinner />}>
        <Routes>
          <Route
            path=":username/*"
            element={
              <Routes>
                <Route path="posts" element={<Profile selectedTab={0} />} />
                <Route
                  path="roundtables"
                  element={<Profile selectedTab={1} />}
                />
                <Route path="snip-it" element={<Profile selectedTab={2} />} />
                <Route
                  path="followers"
                  element={<Followers selectedTab={1} />}
                />
                <Route
                  path="followings"
                  element={<Followers selectedTab={0} />}
                />
                <Route
                  path="saved_posts"
                  element={
                    !localStorage.current_user ? (
                      <PageNotFound />
                    ) : username ===
                      JSON.parse(localStorage.current_user)?.username ? (
                      <PrivateRouteComponent>
                        <Profile selectedTab={3} />
                      </PrivateRouteComponent>
                    ) : (
                      <PageNotFound />
                    )
                  }
                />
                <Route path="" element={<Navigate replace to={"posts"} />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            }
          />
          <Route
            path=""
            element={
              <Navigate
                replace
                to={
                  searchedUsername ? (
                    searchedUsername
                  ) : !localStorage.current_user ? (
                    <PageNotFound />
                  ) : (
                    JSON.parse(localStorage.current_user).username
                  )
                }
              />
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
