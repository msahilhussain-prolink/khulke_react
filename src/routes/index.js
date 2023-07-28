import { lazy } from "react";
import "../global_styles/khulke-global.css";

export const routes = [
  { path: "/oauth", component: lazy(() => import("../pages/Oauth")) },
  {
    path: "/broadcast",
    component: lazy(() => import("../pages/AccountSettings/BroadCast/index")),
  },
  {
    path: "/yapp/*",
    component: lazy(() => import("../pages/Yaap_chats/src/defaultPages/App")),
  },
  // {
  //   path: "/step-2",
  //   component: lazy(() => import("../pages/VerifyOTP")),
  // },
  // {
  //   path: "/step-3",
  //   component: lazy(() => import("../pages/auth/SignUp")),
  // },
  {
    path: "/step-4",
    component: lazy(() => import("../pages/InviteCode")),
  },
  {
    path: "/invite-code",
    component: lazy(() => import("../pages/auth/Signup2/Signup21")),
  },
  {
    path: "/friends",
    component: lazy(() => import("../pages/FriendSuggestions")),
  },
  {
    path: "/choose_wisely",
    component: lazy(() => import("../pages/ChooseWisely")),
  },
  {
    path: "/invite",
    component: lazy(() => import("../pages/TwitterInvite")),
  },
  {
    path: "/invite_friends",
    component: lazy(() => import("../pages/InviteFriends")),
  },
  {
    path: "/notifications/*",
    component: lazy(() => import("./NotificationLayout")),
  },
  {
    path: "/account_settings",
    component: lazy(() => import("../pages/AccountSettings")),
  },
  {
    path: "/personal_details",
    component: lazy(() => import("../pages/PersonalDetails")),
  },
  {
    path: "/blocked_accounts",
    component: lazy(() => import("../pages/BlockedAccounts")),
  },
  {
    path: "/muted_accounts",
    component: lazy(() => import("../pages/MutedAccounts")),
  },
  {
    path: "/muted_words",
    component: lazy(() => import("../pages/MutedWords")),
  },
  {
    path: "/change_password",
    component: lazy(() => import("../pages/Password")),
  },
  {
    path: "/setPass",
    component: lazy(() => import("../components/PasswordNew/CreatePass")),
  },
  {
    path: "/changepass",
    component: lazy(() => import("../components/PasswordNew/ChangePass")),
  },
  {
    path: "/oldpass",
    component: lazy(() => import("../components/PasswordNew/EnterOldPass.jsx")),
  },
  {
    path: "/apps",
    component: lazy(() => import("../pages/Apps")),
  },
  {
    path: "/privacy_settings",
    component: lazy(() => import("../pages/PrivacySettings")),
  },
  {
    path: "/earn_invite",
    component: lazy(() => import("../pages/EarnInvite")),
  },
  {
    path: "/deactivate_info",
    component: lazy(() => import("../pages/AccountSettings/DeactivateInfo")),
  },
  {
    path: "/verifypass_setting",
    component: lazy(() =>
      import("../pages/AccountSettings/PasswordVerifySetting")
    ),
  },
  {
    path: "/verifyotp_setting",
    component: lazy(() => import("../pages/AccountSettings/OtpVerifySetting")),
  },
  {
    path: "/reactivate",
    component: lazy(() => import("../pages/Reactivate/index")),
  },
];

export const privateRoutes = [
  {
    path: "/yapp/conversations",
    component: lazy(() =>
      import(
        "../pages/Yaap_chats/src/cometchat-pro-react-ui-kit/CometChatWorkspace/src/components/Chats/CometChatConversationListWithMessages"
      )
    ),
  },
  {
    path: "/yapp/groups",
    component: lazy(() =>
      import(
        "../pages/Yaap_chats/src/cometchat-pro-react-ui-kit/CometChatWorkspace/src/components/Groups/CometChatGroupListWithMessages"
      )
    ),
  },
  {
    path: "/yapp/users",
    component: lazy(() =>
      import(
        "../pages/Yaap_chats/src/cometchat-pro-react-ui-kit/CometChatWorkspace/src/components/Users/CometChatUserListWithMessages"
      )
    ),
  },
  {
    path: "/yapp/conversation-list",
    component: lazy(() =>
      import(
        "../pages/Yaap_chats/src/cometchat-pro-react-ui-kit/CometChatWorkspace/src/components/Chats/CometChatConversationList"
      )
    ),
  },
  {
    path: "/yapp/group-list",
    component: lazy(() =>
      import(
        "../pages/Yaap_chats/src/cometchat-pro-react-ui-kit/CometChatWorkspace/src/components/Groups/CometChatGroupList"
      )
    ),
  },
  {
    path: "/yapp/user-list",
    component: lazy(() =>
      import(
        "../pages/Yaap_chats/src/cometchat-pro-react-ui-kit/CometChatWorkspace/src/components/Users/CometChatUserList"
      )
    ),
  },
  {
    path: "/yapp/messages",
    component: lazy(() =>
      import(
        "../pages/Yaap_chats/src/cometchat-pro-react-ui-kit/CometChatWorkspace/src/components/Messages/CometChatMessages"
      )
    ),
    chatWithGroup: "supergroup",
  },
];
