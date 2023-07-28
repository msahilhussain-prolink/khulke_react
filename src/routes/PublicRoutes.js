import { lazy } from "react";

export const publicRoute = [
  {
    path: "/app",
    component: lazy(() => import("../pages/UniversalAppPage/index")),
  },
  {
    path: "/login",
    component: lazy(() => import("../pages/auth/Login2")),
  },
  {
    path: "/redirect",
    component: lazy(() => import("../pages/auth/Login2/PreRedirection")),
  },
  {
    path: "/login/password",
    component: lazy(() => import("../pages/auth/Login2/Loginp")),
  },
  {
    path: "/login/otp",
    component: lazy(() => import("../pages/auth/Login2/Logino")),
  },
  {
    path: "/signup",
    component: lazy(() => import("../pages/auth/Signup2/Signup21")),
  },
  {
    path: "/signup/otp",
    component: lazy(() => import("../pages/auth/Signup2/Signup22")),
  },
  {
    path: "/verify_fp",
    component: lazy(() => import("../pages/auth/VerifyFP")),
  },
  {
    path: "/roundtable/*",
    component: lazy(() => import("../routes/RoundTableLayout")),
  },
  {
    path: "/forgot_password",
    component: lazy(() => import("../pages/auth/ForgotPassword")),
  },
  {
    path: "/post/:id",
    component: lazy(() => import("../pages/SinglePost")),
  },
  {
    path: "/search",
    component: lazy(() => import("../pages/Search")),
  },
  {
    path: "/rt/search",
    component: lazy(() => import("../pages/SearchRountable")),
  },
  {
    path: "/welcome",
    component: lazy(() => import("../pages/Welcome/Welcome3.jsx")),
  },
  {
    path: "/recording",
    component: lazy(() => import("../pages/RecordRT")),
  },
  {
    path: "/maintainance",
    component: lazy(() => import("../pages/Maintainance")),
  },
  {
    path: "/password_reset",
    component: lazy(() => import("../pages/auth/ResetPassword")),
  },
  {
    path: "/home",
    component: lazy(() => import("../pages/Home")),
  },
  {
    path: "/profile/*",
    component: lazy(() => import("./ProfileLayout")),
  },
  {
    path: "/snip-it",
    component: lazy(() => import("../pages/Snippet")),
  },
  {
    path: "/policies/*",
    component: lazy(() => import("../pages/Policies")),
  },
  {
    path: "/k3",
    component: lazy(() => import("../pages/K3Page")),
  },
   {
    path: "/bol-khulke",
    component: lazy(() => import("../pages/BolKhulkePage")),
  },
  {
    path: "/preview-rt",
    component: lazy(() =>
      import("../components/CreateEditRoundtable/PreviewComponent")
    ),
  },
  {
    path: "*",
    component: lazy(() => import("../pages/Error/pageNotFound")),
  },
  // {},
];
