import { combineReducers } from "redux";
import interestReducer from "./interestReducer";
import postReducer from "./postReducer";
import userReducer from "./authReducer";
import getTokenReducer from "./authReducer/token";
import suggestionsReducer from "./interestReducer/suggestionsReducer";
import editDetailReducer from "./profileReducer/editReducer";
import editUserReducer from "./profileReducer/editUserReducer";
import searchReducer from "./searchReducer/searchReducer";
import followReducer from "./followReducer/index";
import notificationReducer from "./notificationsReducer/index";
import userActionReducer from "./userActionReducer/index";
import getTwFolReducer from "./twitterReducer/getFollowers";
import bookmarkReducer from "./bookmarkReducer";
import urlMetaDataReducer from "./urlMetaDataReducer";
import audioTrimReducer from "./trimAudioReducer";
import videoTrimReducer from "./trimVideoReducer";
import roundtableReducer from "./roundtableReducer";
import roundtableSingleReducer from "./roundtableReducer/single_roundtable";
import disclaimerRTReducer from "./roundtableReducer/disclaimerReducer";
import roundtableReminderReducer from "./roundtableReducer/set_reminder";
import roundtableCreateEditRt from "./roundtableReducer/create_edit_rt";
import roundtableInvitePanelist from "./roundtableReducer/invitePanelist";
import roundtableInviteeList from "./roundtableReducer/inviteeList";
import roundtableViewList from "./roundtableReducer/viewList";
import acceptAccessReducer from "./roundtableReducer/acceptAccess";
import requestAccessReducer from "./roundtableReducer/requestAccess";
import inviteVisitorReducer from "./roundtableReducer/inviteVisitor";
import userSearchReducer from "./userSearchReducer";
import YappReducer from "./YappReducer";
import pastRTReducer from "./pastRTReducer";
import visitorSearchReducer from "./visitorSearchReducer";
import histMessageReducer from "./rtReducer/historicalMessaging";
import visitorCommentReducer from "./visitorCommentReducer";
import RTuserInteractionReducer from "./RTuserInteractionReducer";
import HeaderDataReducer from "./HeaderDataReducer";
import toggleGridReducer from "./toggleGridReducer";
import userProfilerReducer from "./profileReducer/userProfileReducer";
import ownerRightsReducer from "./roundtableReducer/ownerRights";
import MinimizedRoundtableReducer from "./minimizedRoundtable";
import restoreUsernameReducer from "./restoreUsernameReducer";
import deleteRtReducer from "./roundtableReducer/deleteRT";
import modPromotedReducer from "./modPromotedReducer/index";
import inviteByReducer from "./inviteByReducer";
import RaiseHandReducer from "./roundtableReducer/RaiseHandToggle";
import fullScreenReducer from "./fullScreenReducer/index";
import audioVolumeReducer from "./audioVolumeReducer/index";
import followUnfollowInRTReducer from "./followUnfollowInRTReducer/index";
import popularReducer from "./popularReducer/popularRt";
import popularShowsReducer from "./popularReducer/popularShows";
import reducer from "../../pages/Yaap_chats/src/store/reducer";
import walkthroughReducer from "./walkthroughReducer";
import {
  compReducer,
  drawerSwitchReducer,
  LiveRTStateReducer,
  signUpFlagReducer,
  tabSwitchReducer,
} from "./compReducer";
import rtActionReducer from "./roundtableReducer/rtAction";
import languageChangeReducer from "./languageChangeReducer";
import createEditRoundtableReducer from "./createEditRoundtableReducer";
import interactionReducer from "./interactionNotificationAction";
import createRecRTReducer from "./roundtableReducer/createRecRT";
import logoVideoReducer from "./roundtableReducer/logoVideo";
import delLogoVideoReducer from "./roundtableReducer/logoVideosDel";
import imageChangeReducer from "./roundtableReducer/imageChange";
import personalDetailsReducer from "./personalDetailsReducer";
import invitationReducer from "./InvitationReducer";
import rejectAcceptReducer from "./InvitationReducer/rejectAcceptInv";
import joinRTReducer from "./roundtableReducer/joinRT";
import liveRTReducer from "./liveRTReducer";
import mineRTListingReducer from "./miniListing/mineRtReducer";
import rtWithCategoryReducer from "./miniListing/rtWithCategoryReducer";
import k3PostsReducer from './k3Reducer';
import bkkPostsReducer from './bkkReducer';

const rootReducer = combineReducers({
  followUnfollowInRT: followUnfollowInRTReducer,
  audioVolume: audioVolumeReducer,
  modPromoted: modPromotedReducer,
  toggleGrid: toggleGridReducer,
  fullScreen: fullScreenReducer,
  HeaderData: HeaderDataReducer,
  audioTrim: audioTrimReducer,
  videoTrim: videoTrimReducer,
  post: postReducer,
  bookmark: bookmarkReducer,
  interest: interestReducer,
  user: userReducer,
  token: getTokenReducer,
  suggestion: suggestionsReducer,
  editDetails: editDetailReducer,
  edit_user: editUserReducer,
  search: searchReducer,
  follow: followReducer,
  notification: notificationReducer,
  interaction: interactionReducer,
  userAction: userActionReducer,
  twitter: getTwFolReducer,
  urlMetaData: urlMetaDataReducer,
  roundtable: roundtableReducer,
  single_rt: roundtableSingleReducer,
  disclaimer_rt: disclaimerRTReducer,
  set_reminder: roundtableReminderReducer,
  userSearch: userSearchReducer,
  yappmessages: YappReducer,
  pastrt: pastRTReducer,
  visitorSearch: visitorSearchReducer,
  historicalMessages: histMessageReducer,
  visitorComment: visitorCommentReducer,
  rtPost: RTuserInteractionReducer,
  create_edit_rt: roundtableCreateEditRt,
  inviteePanelist: roundtableInvitePanelist,
  user_profile: userProfilerReducer,
  inviteeList: roundtableInviteeList,
  viewList: roundtableViewList,
  acceptAccess: acceptAccessReducer,
  inviteVisitor: inviteVisitorReducer,
  request_access: requestAccessReducer,
  ownerRights: ownerRightsReducer,
  minimizedData: MinimizedRoundtableReducer,
  restore_username: restoreUsernameReducer,
  delete_rt: deleteRtReducer,
  inviteBy: inviteByReducer,
  raiseHand: RaiseHandReducer,
  popularRTs: popularReducer,
  popularShows: popularShowsReducer,
  yapp: reducer,
  walkthrough: walkthroughReducer,
  compRed: compReducer,
  signUpRed: signUpFlagReducer,
  tabSwitchRed: tabSwitchReducer,
  drawerSwitchRed: drawerSwitchReducer,
  rtActionRed: rtActionReducer,
  liveRTState: LiveRTStateReducer,
  languageChange: languageChangeReducer,
  createEditRoundtable: createEditRoundtableReducer,
  personalDetails: personalDetailsReducer,
  createRec: createRecRTReducer,
  logoVidRed: logoVideoReducer,
  delLogoVidRed: delLogoVideoReducer,
  imageChangeRed: imageChangeReducer,
  personalDetails: personalDetailsReducer,
  invitePopUp: invitationReducer,
  rejectAccept: rejectAcceptReducer,
  joinRTRed: joinRTReducer,
  liveRT: liveRTReducer,
  mineRTList: mineRTListingReducer,
  rtCategoryList: rtWithCategoryReducer,
  k3Posts: k3PostsReducer,
  bkkPosts:bkkPostsReducer
});

export default rootReducer;
