import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import FallBackSpinner from "../components/FallBackSpinner";
// import Notification from "../pages/Notification";

const Notification = lazy(() => import("../pages/Notification"));

export default function NotificationLayout() {
  return (
    <>
      {/* <LeftSideBar /> */}
      <Suspense fallback={<FallBackSpinner />}>
        <Routes>
          <Route
            path="interaction"
            element={<Notification selectedTab={0} />}
          />
          <Route path="network" element={<Notification selectedTab={1} />} />
        </Routes>
      </Suspense>
      {/* <RightSideBar /> */}
    </>
  )
}
