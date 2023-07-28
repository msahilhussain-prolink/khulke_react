import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import FallBackSpinner from "../components/FallBackSpinner";
import { PrivateRouteComponent } from "./PrivateRoute";

const Maidan = lazy(() => import("../pages/Maidan"));
const RoundTable = lazy(() => import("../pages/RoundTable"));
const Disclaimer = lazy(() => import("../pages/Disclaimer"));
const AgoraSandbox = lazy(() => import("../pages/AgoraSandbox"));
const PageNotFound = lazy(() => import("../pages/Error/pageNotFound"));
const RTNotifications = lazy(() => import("../components/RTNotifications"));
const PreLoginFooter = lazy(() => import("../components/PreLoginFooter"));
const PastRT = lazy(() => import("../pages/PastRT"));
const CreateEditRoundtable = lazy(() =>
  import("../pages/CreateEditRoundtable")
);

export default function RoundTableLayout() {
  const location = useLocation();

  // add paths that you do not want footer to be showed
  const pathsToExclude = ["join", "recorded"];

  return (
    <>
      <Suspense fallback={<FallBackSpinner />}>
        <Routes>
          <Route path="live" element={<Maidan selectedTab={1} />} />
          <Route path="mine" element={<Maidan selectedTab={0} />} />
          <Route path="upcoming" element={<Maidan selectedTab={2} />} />
          <Route path="all" element={<Maidan selectedTab={3} />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="join" element={<AgoraSandbox />} />
          <Route path="notifications" element={<RTNotifications />} />
          <Route path="recorded/:id" element={<PastRT />} />
          <Route
            path="create/*"
            element={
              <PrivateRouteComponent>
                <Routes>
                  <Route
                    path="success"
                    element={<CreateEditRoundtable progress="success" />}
                  />
                  <Route
                    path="invite-audience"
                    element={<CreateEditRoundtable progress="invite" />}
                  />
                  <Route
                    path="invite-success"
                    element={<CreateEditRoundtable progress="invite-success" />}
                  />
                  <Route
                    path=""
                    element={<CreateEditRoundtable progress="creation" />}
                  />
                </Routes>
              </PrivateRouteComponent>
            }
          />

          <Route
            path="edit/*"
            element={
              <PrivateRouteComponent>
                <Routes>
                  <Route
                    path="success/:id"
                    element={<CreateEditRoundtable progress="success" />}
                  />
                  <Route
                    path="invite-audience/:id"
                    element={<CreateEditRoundtable progress="invite" />}
                  />
                  <Route
                    path="invite-success/:id"
                    element={<CreateEditRoundtable progress="invite-success" />}
                  />
                  <Route
                    path=":id"
                    element={<CreateEditRoundtable progress="creation" />}
                  />
                </Routes>
              </PrivateRouteComponent>
            }
          />
          <Route path="" element={<RoundTable progress="step5" />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      {!localStorage.current_user &&
        localStorage.anonymous_user &&
        location.pathname.split("/").filter((el) => pathsToExclude.includes(el))
          .length < 1 && <PreLoginFooter />}
    </>
  );
}
