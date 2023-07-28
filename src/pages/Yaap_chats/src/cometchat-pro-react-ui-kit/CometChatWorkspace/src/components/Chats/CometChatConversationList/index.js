import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { ConversationListManager } from "./controller";

import {
  CometChatConfirmDialog,
  CometChatToastNotification,
} from "../../Shared";
import { CometChatConversationListItem } from "../";

import {
  CometChatContextProvider,
  CometChatContext,
} from "../../../util/CometChatContext";
import * as enums from "../../../util/enums.js";
import { UIKitSettings } from "../../../util/UIKitSettings";
import { SoundManager } from "../../../util/SoundManager";
import { CometChatEvent } from "../../../util/CometChatEvent";

import Translator from "../../../resources/localization/translator";
import { theme } from "../../../resources/theme";
import searchIcon from "./resources/search.svg";
import addIcon from "./resources/add.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  chatsWrapperStyle,
  chatsHeaderStyle,
  chatsHeaderCloseStyle,
  chatsHeaderTitleStyle,
  chatsMsgStyle,
  chatsMsgTxtStyle,
  chatsListStyle,
  noConversationsFoundButton,
  noConversationsFoundPara,
  noConversationsFoundHead,
  changeTabToUsers,
} from "./style";

import navigateIcon from "./resources/back.svg";
import chatIcon from "./resources/message.gif";
import ButtonComponent from "../../CustomComponents/ButtonComponent";
import {
  groupSearchButtonStyle,
  groupSearchInputStyle,
  groupSearchStyle,
} from "../../Groups/CometChatGroupList/style";
// import logger from "../../../../../../../../../logger";
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tabs,
  Tab,
  Box,
  Typography,
  Menu,
} from "@mui/material";
import { allWords } from "../../../../../../../../../App";
import { MOBILE_VIEW } from "../../../../../../../../../constants/env";

const noConversationsFound = (btnClickHandler) => (
  <>
    <h4 style={noConversationsFoundHead()}>Welcome to Yapp!</h4>
    <p style={noConversationsFoundPara()}>
      Drop a line, share Posts and more with private conversations between you
      and others on Khul ke.
    </p>
    <ButtonComponent btnHandler={btnClickHandler} btnText={"Start a Chat"} />
    <div style={{ margin: "0rem auto 0 auto", maxWidth: "14rem" }}>
      <img
        style={{ width: "100%", height: "auto" }}
        src={chatIcon}
        alt="gif-icon"
      />
    </div>
  </>
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      <Box
        sx={{
          paddingBottom: "24px",
          overflowY: "scroll",
          maxHeight: "80vh",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
        }}
      >
        {children}
      </Box>
    </Typography>
  );
}

class CometChatConversationList extends React.Component {
  loggedInUser = null;
  incrementUnreadCount = false;

  static contextType = CometChatContext;

  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      open: false,
      conversationlist: [],
      copyOfConversationList: [],
      onItemClick: null,
      hideGroupActionMessages: false,
      showConfirmDialog: false,
      decoratorMessage: Translator.translate("LOADING", props.lang),
      conversationToBeDeleted: null,
      showSearchBox: false,
      activeChatId: null,
      tabValue: 0,
    };

    this.contextProviderRef = React.createRef();
    this.chatListRef = React.createRef();
    this.toastRef = React.createRef();

    this.anchorRef = React.createRef();
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleListKeyDown = this.handleListKeyDown.bind(this);

    CometChat.getLoggedinUser()
      .then((user) => (this.loggedInUser = user))
      .catch((error) => {
        this.setState({
          decoratorMessage: Translator.translate(
            "SOMETHING_WRONG",
            this.props.lang
          ),
        });
      });
  }

  componentDidMount() {
    this._isMounted = true;

    this.item =
      this.getContext().type === CometChat.ACTION_TYPE.TYPE_USER ||
      CometChat.ACTION_TYPE.TYPE_GROUP
        ? this.getContext().item
        : null;
    this.hideGroupActionMessages();

    this.setState({ conversationlist: [] }, () => {
      this.ConversationListManager = new ConversationListManager(
        this.getContext()
      );
      this.getConversations();
      this.ConversationListManager.attachListeners(this.conversationCallback);
    });

    //updating last message whenever a message is composed and sent
    CometChatEvent.on("updateLastMessage", (args) =>
      this.updateLastMessage(args)
    );

    //updating unreadcount whenever a new message is received and not read.
    CometChatEvent.on(enums.EVENTS["NEW_MESSAGES"], (args) =>
      this.updateUnreadCount(args)
    );

    //clearing unreadcount whenever scrolled to the bottom.
    CometChatEvent.on(enums.EVENTS["CLEAR_UNREAD_MESSAGES"], (args) =>
      this.clearUnreadCount(args)
    );
  }

  componentDidUpdate() {
    //when a particular chat is selected from the chats list
    if (
      (Object.keys(this.getContext().item).length &&
        this.getContext().type.length) ||
      this.getContext().item !== this.item
    ) {
      const conversationlist = [...this.state.conversationlist];
      const conversationObj = this.filterConversation();

      if (
        conversationObj &&
        conversationObj.unreadMessageCount > 0 &&
        this.incrementUnreadCount === false
      ) {
        let conversationKey = conversationlist.indexOf(conversationObj);
        let newConversationObj = { ...conversationObj, unreadMessageCount: 0 };

        conversationlist.splice(conversationKey, 1, newConversationObj);
        this.setState({ conversationlist: conversationlist });
      }
    }

    //if user is blocked/unblocked, update conversationlist in state
    if (
      this.item &&
      Object.keys(this.item).length &&
      this.item.hasOwnProperty("uid") &&
      this.getContext().type === CometChat.ACTION_TYPE.TYPE_USER &&
      this.item.uid === this.getContext().item.uid &&
      this.item.blockedByMe !== this.getContext().item.blockedByMe
    ) {
      let conversationlist = [...this.state.conversationlist];

      //search for user
      let convKey = conversationlist.findIndex(
        (c) =>
          c.conversationType === CometChat.ACTION_TYPE.TYPE_USER &&
          c.conversationWith.uid === this.getContext().item.uid
      );
      if (convKey > -1) {
        const convObj = conversationlist[convKey];

        let convWithObj = { ...convObj.conversationWith };
        let newConvWithObj = Object.assign({}, convWithObj, {
          blockedByMe: this.getContext().item.blockedByMe,
        });

        let newConvObj = Object.assign({}, convObj, {
          conversationWith: newConvWithObj,
        });

        conversationlist.splice(convKey, 1, newConvObj);
        this.setState({ conversationlist: conversationlist });
      }
    }

    //if group detail(membersCount) is updated, update grouplist
    if (
      this.item &&
      Object.keys(this.item).length &&
      this.item.hasOwnProperty("guid") &&
      this.getContext().type === CometChat.ACTION_TYPE.TYPE_GROUP &&
      this.item.guid === this.getContext().item.guid &&
      this.item.membersCount !== this.getContext().item.membersCount
    ) {
      const conversationlist = [...this.state.conversationlist];

      let convKey = conversationlist.findIndex(
        (c) =>
          c.conversationType === CometChat.ACTION_TYPE.TYPE_GROUP &&
          c.conversationWith.guid === this.getContext().item.guid
      );
      if (convKey > -1) {
        const convObj = conversationlist[convKey];

        let convWithObj = { ...convObj.conversationWith };
        let newConvWithObj = Object.assign({}, convWithObj, {
          membersCount: this.getContext().item.membersCount,
        });

        let newConvObj = Object.assign({}, convObj, {
          conversationWith: newConvWithObj,
        });

        conversationlist.splice(convKey, 1, newConvObj);
        this.setState({ conversationlist: conversationlist });
      }
    }

    //upon user deleting a group, remove group from conversation list
    if (this.getContext().deletedGroupId.trim().length) {
      const guid = this.getContext().deletedGroupId.trim();
      const conversationlist = [...this.state.conversationlist];

      let conversationKey = conversationlist.findIndex(
        (c) =>
          c.conversationType === CometChat.ACTION_TYPE.TYPE_GROUP &&
          c.conversationWith.guid === guid
      );

      if (conversationKey > -1) {
        conversationlist.splice(conversationKey, 1);
        this.setState({ conversationlist: conversationlist });
      }
    }

    //upon user leaving a group, remove group from conversation list
    if (this.getContext().leftGroupId.trim().length) {
      const guid = this.getContext().leftGroupId.trim();
      const conversationlist = [...this.state.conversationlist];

      let conversationKey = conversationlist.findIndex(
        (c) =>
          c.conversationType === CometChat.ACTION_TYPE.TYPE_GROUP &&
          c.conversationWith.guid === guid
      );

      if (conversationKey > -1) {
        conversationlist.splice(conversationKey, 1);
        this.setState({ conversationlist: conversationlist });
      }
    }

    this.item =
      this.getContext().type === CometChat.ACTION_TYPE.TYPE_USER ||
      CometChat.ACTION_TYPE.TYPE_GROUP
        ? this.getContext().item
        : null;
    this.hideGroupActionMessages();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.ConversationListManager.removeListeners();
    this.ConversationListManager = null;
  }

  filterConversation = () => {
    const conversationlist = [...this.state.conversationlist];
    const conversationObj = conversationlist.find((c) => {
      if (
        (c.conversationType === this.getContext().type &&
          this.getContext().type === CometChat.RECEIVER_TYPE.USER &&
          c.conversationWith.uid === this.getContext().item.uid) ||
        (c.conversationType === this.getContext().type &&
          this.getContext().type === CometChat.RECEIVER_TYPE.GROUP &&
          c.conversationWith.guid === this.getContext().item.guid)
      ) {
        return c;
      }

      return false;
    });

    return conversationObj;
  };

  updateLastMessage = (lastMessage) => {
    const conversationList = [...this.state.conversationlist];
    const conversationKey = conversationList.findIndex(
      (c) => c.conversationId === lastMessage.conversationId
    );

    if (conversationKey > -1) {
      const conversationObj = conversationList[conversationKey];
      let newConversationObj = {
        ...conversationObj,
        lastMessage: { ...lastMessage },
      };

      if (conversationKey === 0) {
        conversationList.splice(conversationKey, 1, newConversationObj);
      } else {
        conversationList.splice(conversationKey, 1);
        conversationList.unshift(newConversationObj);
      }

      if (this._isMounted) {
        this.setState({ conversationlist: conversationList });
      }
    } else {
      const chatListMode = this.getContext().UIKitSettings.chatListMode;
      const chatListFilterOptions = UIKitSettings.chatListFilterOptions;
      if (chatListMode !== chatListFilterOptions["USERS_AND_GROUPS"]) {
        if (
          (chatListMode === chatListFilterOptions["USERS"] &&
            lastMessage.receiverType === CometChat.RECEIVER_TYPE.GROUP) ||
          (chatListMode === chatListFilterOptions["GROUPS"] &&
            lastMessage.receiverType === CometChat.RECEIVER_TYPE.USER)
        ) {
          return false;
        }
      }

      let newConversation = new CometChat.Conversation();
      newConversation.setConversationId(lastMessage.conversationId);
      newConversation.setConversationType(this.getContext().type);
      newConversation.setConversationWith(this.getContext().item);
      newConversation.setLastMessage(lastMessage);
      newConversation.setUnreadMessageCount(0);

      conversationList.unshift(newConversation);

      if (this._isMounted) {
        this.setState({ conversationlist: conversationList });
      }
    }
  };

  updateUnreadCount = (params) => {
    this.incrementUnreadCount = true;
    return false;
  };

  clearUnreadCount = (params) => {
    this.incrementUnreadCount = false;

    let conversationList = [...this.state.conversationlist];
    const conversationObj = this.filterConversation();

    if (conversationObj && conversationObj.unreadMessageCount > 0) {
      let conversationKey = conversationList.indexOf(conversationObj);
      let newConversationObj = { ...conversationObj, unreadMessageCount: 0 };

      conversationList.splice(conversationKey, 1, newConversationObj);
      this.setState({ conversationlist: conversationList });
    }
    return false;
  };

  conversationCallback = (key, item, message, options) => {
    switch (key) {
      case enums.USER_ONLINE:
      case enums.USER_OFFLINE:
        this.updateUser(item);
        break;
      case enums.TEXT_MESSAGE_RECEIVED:
      case enums.MEDIA_MESSAGE_RECEIVED:
      case enums.CUSTOM_MESSAGE_RECEIVED:
        this.markMessageAsDelivered(message);
        this.conversationUpdated(key, message, options);
        break;
      case enums.INCOMING_CALL_RECEIVED:
      case enums.INCOMING_CALL_CANCELLED:
      case enums.MESSAGE_EDITED:
      case enums.MESSAGE_DELETED:
      case enums.MESSAGE_READ:
      case enums.GROUP_MEMBER_ADDED:
      case enums.GROUP_MEMBER_KICKED:
      case enums.GROUP_MEMBER_BANNED:
      case enums.GROUP_MEMBER_LEFT:
      case enums.GROUP_MEMBER_SCOPE_CHANGED:
      case enums.GROUP_MEMBER_JOINED:
      case enums.GROUP_MEMBER_UNBANNED:
        this.conversationUpdated(key, message, options);
        break;
      default:
        break;
    }
  };

  markMessageAsDelivered = (message) => {
    //if chat window is not open, mark message as delivered
    if (
      (this.getContext().type === "" ||
        Object.keys(this.getContext().item).length === 0) &&
      message.hasOwnProperty("deliveredAt") === false
    ) {
      CometChat.markAsDelivered(message).catch((error) => {});
    }
  };

  conversationUpdated = (key, message, options) => {
    const chatListMode = this.getContext().UIKitSettings.chatListMode;
    const chatListFilterOptions = UIKitSettings.chatListFilterOptions;

    if (chatListMode !== chatListFilterOptions["USERS_AND_GROUPS"]) {
      if (
        (chatListMode === chatListFilterOptions["USERS"] &&
          message.receiverType === CometChat.RECEIVER_TYPE.GROUP) ||
        (chatListMode === chatListFilterOptions["GROUPS"] &&
          message.receiverType === CometChat.RECEIVER_TYPE.USER)
      ) {
        return false;
      }
    }

    switch (key) {
      case enums.TEXT_MESSAGE_RECEIVED:
      case enums.MEDIA_MESSAGE_RECEIVED:
      case enums.CUSTOM_MESSAGE_RECEIVED:
      case enums.INCOMING_CALL_RECEIVED:
      case enums.INCOMING_CALL_CANCELLED:
        this.updateConversation(key, message);
        break;
      case enums.MESSAGE_EDITED:
      case enums.MESSAGE_DELETED:
        this.conversationEditedDeleted(message);
        break;
      case enums.GROUP_MEMBER_ADDED:
        this.updateGroupMemberAdded(message, options);
        break;
      case enums.GROUP_MEMBER_KICKED:
      case enums.GROUP_MEMBER_BANNED:
      case enums.GROUP_MEMBER_LEFT:
        this.updateGroupMemberRemoved(message, options);
        break;
      case enums.GROUP_MEMBER_SCOPE_CHANGED:
        this.updateGroupMemberScopeChanged(message, options);
        break;
      case enums.GROUP_MEMBER_JOINED:
      case enums.GROUP_MEMBER_UNBANNED:
        this.updateGroupMemberChanged(message, options);
        break;
      case enums.MESSAGE_READ:
        this.onMessagesRead(message);
        break;
      default:
        break;
    }
  };

  updateUser = (user) => {
    const conversationlist = [...this.state.conversationlist];
    const conversationKey = conversationlist.findIndex(
      (conversationObj) =>
        conversationObj.conversationType === "user" &&
        conversationObj.conversationWith.uid === user.uid
    );

    if (conversationKey > -1) {
      let conversationObj = { ...conversationlist[conversationKey] };
      let conversationWithObj = {
        ...conversationObj.conversationWith,
        status: user.getStatus(),
      };

      let newConversationObj = {
        ...conversationObj,
        conversationWith: conversationWithObj,
      };
      conversationlist.splice(conversationKey, 1, newConversationObj);
      this.setState({ conversationlist: conversationlist });
    }
  };

  hideGroupActionMessages = () => {
    this.getContext()
      .FeatureRestriction.isGroupActionMessagesEnabled()
      .then((response) => {
        if (response !== this.state.hideGroupActionMessages) {
          this.setState({ hideGroupActionMessages: response });
        }
      })
      .catch((error) => {
        if (this.state.hideGroupActionMessages !== false) {
          this.setState({ hideGroupActionMessages: false });
        }
      });
  };

  playAudio = (message) => {
    if (
      message.category === CometChat.CATEGORY_ACTION &&
      message.type === CometChat.ACTION_TYPE.TYPE_GROUP_MEMBER &&
      this.state.hideGroupActionMessages === true
    ) {
      return false;
    }

    /**
     * Sound alert for incoming messages
     */
    const receiverType = message.getReceiverType();
    const receiverId =
      receiverType === CometChat.RECEIVER_TYPE.USER
        ? message.getSender().uid
        : message.getReceiverId();

    if (receiverType === this.getContext().type) {
      if (
        (receiverType === CometChat.RECEIVER_TYPE.USER &&
          receiverId === this.getContext().item.uid) ||
        (receiverType === CometChat.RECEIVER_TYPE.GROUP &&
          receiverId === this.getContext().item.guid)
      ) {
        SoundManager.play(
          enums.CONSTANTS.AUDIO["INCOMING_MESSAGE"],
          this.getContext()
        );
      } else {
        SoundManager.play(
          enums.CONSTANTS.AUDIO["INCOMING_OTHER_MESSAGE"],
          this.getContext()
        );
      }
    } else {
      SoundManager.play(
        enums.CONSTANTS.AUDIO["INCOMING_OTHER_MESSAGE"],
        this.getContext()
      );
    }
  };

  onMessagesRead = (messageReceipt) => {
    const conversationList = [...this.state.conversationlist];
    conversationList.forEach((conversation, conversationKey) => {
      if (conversation?.conversationType === messageReceipt.receiverType) {
        if (
          (conversation?.conversationType === CometChat.RECEIVER_TYPE.USER &&
            messageReceipt.receiver === conversation?.conversationWith?.uid) ||
          (conversation?.conversationType === CometChat.RECEIVER_TYPE.GROUP &&
            messageReceipt.receiver === conversation?.conversationWith?.guid)
        ) {
          let unreadMessageCount = conversation.unreadMessageCount;
          /**
           * If the message id of the read reciept if greater than or equal to the lastmessage id, set unreadmessagecount to 0
           */
          if (messageReceipt?.messageId >= conversation?.lastMessage?.id) {
            unreadMessageCount = 0;
          }

          let newConversationObj = {
            ...conversation,
            unreadMessageCount: unreadMessageCount,
          };
          conversationList.splice(conversationKey, 1, newConversationObj);
          this.setState({ conversationlist: conversationList });
        }
      }
    });
  };

  makeConversation = (message) => {
    const promise = new Promise((resolve) => {
      CometChat.CometChatHelper.getConversationFromMessage(message).then(
        (conversation) => {
          let conversationList = [...this.state.conversationlist];
          let conversationKey = conversationList.findIndex(
            (c) => c.conversationId === conversation.conversationId
          );

          let conversationObj = { ...conversation };
          if (conversationKey > -1) {
            conversationObj = { ...conversationList[conversationKey] };
          }

          resolve({
            conversationKey: conversationKey,
            conversationObj: conversationObj,
            conversationList: conversationList,
          });
        }
      );
    });

    return promise;
  };

  makeUnreadMessageCount = (message, conversation = {}) => {
    /**
     * If the received message is sent by the logged in user, don't increment the unread count
     */
    if (Object.keys(conversation).length === 0) {
      if (message.sender.uid === this.loggedInUser?.uid) {
        return 0;
      } else {
        return 1;
      }
    }

    let unreadMessageCount = parseInt(conversation.unreadMessageCount);
    if (
      (this.getContext().item.hasOwnProperty("guid") &&
        conversation.conversationWith.hasOwnProperty("guid") &&
        this.getContext().item.guid === conversation.conversationWith.guid) ||
      (this.getContext().item.hasOwnProperty("uid") &&
        conversation.conversationWith.hasOwnProperty("uid") &&
        this.getContext().item.uid === conversation.conversationWith.uid)
    ) {
      if (this.incrementUnreadCount === true) {
        unreadMessageCount = ++unreadMessageCount;
      } else {
        unreadMessageCount = 0;
      }
    } else {
      unreadMessageCount = this.shouldIncrementCount(message)
        ? ++unreadMessageCount
        : unreadMessageCount;
    }
    return unreadMessageCount;
  };

  shouldIncrementCount = (incomingMessage) => {
    let output = false;
    if (
      (incomingMessage.category === CometChat.CATEGORY_MESSAGE &&
        incomingMessage.sender.uid !== this.loggedInUser?.uid) ||
      (this.getContext().hasKeyValue(incomingMessage, enums.KEYS["METADATA"]) &&
        this.getContext().hasKeyValue(
          incomingMessage[enums.KEYS["METADATA"]],
          enums.KEYS["INCREMENT_UNREAD_COUNT"]
        ) &&
        incomingMessage[enums.KEYS["METADATA"]][
          enums.KEYS["INCREMENT_UNREAD_COUNT"]
        ] === true &&
        incomingMessage.sender.uid !== this.loggedInUser?.uid)
    ) {
      output = true;
    }

    return output;
  };

  makeLastMessage = (message, conversation = {}) => {
    const newMessage = Object.assign({}, message);
    return newMessage;
  };

  updateConversation = (key, message) => {
    this.makeConversation(message).then((response) => {
      const { conversationKey, conversationObj, conversationList } = response;

      if (conversationKey > -1) {
        let unreadMessageCount = this.makeUnreadMessageCount(
          message,
          conversationObj
        );
        let lastMessageObj = this.makeLastMessage(message, conversationObj);

        let newConversationObj = {
          ...conversationObj,
          lastMessage: lastMessageObj,
          unreadMessageCount: unreadMessageCount,
        };

        conversationList.splice(conversationKey, 1);
        conversationList.unshift(newConversationObj);
        this.setState({ conversationlist: conversationList });

        if (
          key !== enums.INCOMING_CALL_RECEIVED &&
          key !== enums.INCOMING_CALL_CANCELLED
        ) {
          this.playAudio(message);
        }
      } else {
        let unreadMessageCount = this.makeUnreadMessageCount(message, {});
        let lastMessageObj = this.makeLastMessage(message);

        let newConversationObj = {
          ...conversationObj,
          lastMessage: lastMessageObj,
          unreadMessageCount: unreadMessageCount,
        };
        conversationList.unshift(newConversationObj);
        this.setState({ conversationlist: conversationList });

        if (
          key !== enums.INCOMING_CALL_RECEIVED &&
          key !== enums.INCOMING_CALL_CANCELLED
        ) {
          this.playAudio(message);
        }
      }
    });
  };

  conversationEditedDeleted = (message) => {
    this.makeConversation(message).then((response) => {
      const { conversationKey, conversationObj, conversationList } = response;

      if (conversationKey > -1) {
        let lastMessageObj = conversationObj.lastMessage;

        if (lastMessageObj.id === message.id) {
          const newLastMessageObj = Object.assign({}, lastMessageObj, message);
          let newConversationObj = Object.assign({}, conversationObj, {
            lastMessage: newLastMessageObj,
          });
          conversationList.splice(conversationKey, 1, newConversationObj);
          this.setState({ conversationlist: conversationList });
        }
      }
    });
  };

  updateGroupMemberAdded = (message, options) => {
    this.makeConversation(message).then((response) => {
      const { conversationKey, conversationObj, conversationList } = response;

      if (conversationKey > -1) {
        let lastMessageObj = this.makeLastMessage(message, conversationObj);
        let conversationWithObj = { ...conversationObj.conversationWith };

        let membersCount = parseInt(conversationWithObj.membersCount);
        if (
          message.hasOwnProperty("actionFor") &&
          message.actionFor.hasOwnProperty("membersCount")
        ) {
          membersCount = message.actionFor.membersCount;
        }

        let newConversationWithObj = {
          ...conversationWithObj,
          membersCount: membersCount,
        };

        let newConversationObj = {
          ...conversationObj,
          conversationWith: newConversationWithObj,
          lastMessage: lastMessageObj,
        };
        conversationList.splice(conversationKey, 1);
        conversationList.unshift(newConversationObj);
        this.setState({ conversationlist: conversationList });
        this.playAudio(message);
      } else {
        if (options && this.loggedInUser.uid === options.user.uid) {
          let lastMessageObj = this.makeLastMessage(message);
          let conversationWithObj = { ...conversationObj.conversationWith };

          let membersCount = parseInt(conversationWithObj.membersCount);
          if (
            message.hasOwnProperty("actionFor") &&
            message.actionFor.hasOwnProperty("membersCount")
          ) {
            membersCount = message.actionFor.membersCount;
          }
          let scope = CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT;
          let hasJoined = options.hasJoined;

          let newConversationWithObj = {
            ...conversationWithObj,
            membersCount: membersCount,
            scope: scope,
            hasJoined: hasJoined,
          };
          let newConversationObj = {
            ...conversationObj,
            conversationWith: newConversationWithObj,
            lastMessage: lastMessageObj,
          };

          conversationList.unshift(newConversationObj);
          this.setState({ conversationlist: conversationList });
          this.playAudio(message);
        }
      }
    });
  };

  updateGroupMemberRemoved = (message, options) => {
    this.makeConversation(message).then((response) => {
      const { conversationKey, conversationObj, conversationList } = response;

      if (conversationKey > -1) {
        if (options && this.loggedInUser.uid === options.user.uid) {
          conversationList.splice(conversationKey, 1);
          this.setState({ conversationlist: conversationList });
        } else {
          let lastMessageObj = this.makeLastMessage(message, conversationObj);
          let conversationWithObj = { ...conversationObj.conversationWith };

          let membersCount = parseInt(conversationWithObj.membersCount);
          if (
            message.hasOwnProperty("actionFor") &&
            message.actionFor.hasOwnProperty("membersCount")
          ) {
            membersCount = message.actionFor.membersCount;
          }

          let newConversationWithObj = {
            ...conversationWithObj,
            membersCount: membersCount,
          };

          let newConversationObj = {
            ...conversationObj,
            conversationWith: newConversationWithObj,
            lastMessage: lastMessageObj,
          };
          conversationList.splice(conversationKey, 1);
          conversationList.unshift(newConversationObj);
          this.setState({ conversationlist: conversationList });
          this.playAudio(message);
        }
      }
    });
  };

  updateGroupMemberScopeChanged = (message, options) => {
    this.makeConversation(message).then((response) => {
      const { conversationKey, conversationObj, conversationList } = response;

      if (conversationKey > -1) {
        let lastMessageObj = this.makeLastMessage(message, conversationObj);

        let conversationWithObj = { ...conversationObj.conversationWith };
        let membersCount = parseInt(conversationWithObj.membersCount);

        let scope = conversationWithObj.scope;
        if (options && this.loggedInUser.uid === options.user.uid) {
          scope = options.scope;
        }

        let newConversationWithObj = {
          ...conversationWithObj,
          membersCount: membersCount,
          scope: scope,
        };
        let newConversationObj = {
          ...conversationObj,
          conversationWith: newConversationWithObj,
          lastMessage: lastMessageObj,
        };
        conversationList.splice(conversationKey, 1);
        conversationList.unshift(newConversationObj);
        this.setState({ conversationlist: conversationList });
        this.playAudio(message);
      }
    });
  };

  updateGroupMemberChanged = (message, options) => {
    this.makeConversation(message).then((response) => {
      const { conversationKey, conversationObj, conversationList } = response;
      if (conversationKey > -1) {
        if (options && this.loggedInUser.uid !== options.user.uid) {
          let lastMessageObj = this.makeLastMessage(message, conversationObj);
          let conversationWithObj = { ...conversationObj.conversationWith };

          let membersCount = parseInt(conversationWithObj.membersCount);
          if (
            message.hasOwnProperty("actionFor") &&
            message.actionFor.hasOwnProperty("membersCount")
          ) {
            membersCount = message.actionFor.membersCount;
          }

          let newConversationWithObj = {
            ...conversationWithObj,
            membersCount: membersCount,
          };
          let newConversationObj = {
            ...conversationObj,
            conversationWith: newConversationWithObj,
            lastMessage: lastMessageObj,
          };
          conversationList.splice(conversationKey, 1);
          conversationList.unshift(newConversationObj);
          this.setState({ conversationlist: conversationList });
          this.playAudio(message);
        }
      }
    });
  };

  handleScroll = (e) => {
    const bottom =
      Math.round(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) ===
      Math.round(e.currentTarget.clientHeight);
    if (bottom) this.getConversations();
  };

  //click handler
  handleClick = (conversation, id) => {
    if (!this.props.onItemClick) return;

    this.props.onItemClick(
      conversation.conversationWith,
      conversation.conversationType
    );

    this.setState({
      ...this.state,
      activeChatId: id,
    });
  };

  handleMenuClose = () => {
    if (!this.props.actionGenerated) {
      return false;
    }

    this.props.actionGenerated(enums.ACTIONS["TOGGLE_SIDEBAR"]);
  };

  getConversations = () => {
    this.ConversationListManager.fetchNextConversation()
      .then((conversationList) => {
        if (conversationList.length === 0) {
          if (this.state.conversationlist.length === 0) {
            this.setState({
              decoratorMessage: noConversationsFound(
                this.props.changeTabToUsers
              ),
              //   Translator.translate(
              //     "NO_CHATS_FOUND",
              //     this.props.lang
              //   ),
            });
          }
        } else {
          this.setState({ decoratorMessage: "" });
        }

        let conversations = [...this.state.conversationlist];
        //if conversation exists already in the state, remove it from this list
        conversationList.forEach((eachConversation) => {
          let conversationKey = conversations.findIndex(
            (c) => c.conversationId === eachConversation.conversationId
          );
          if (conversationKey > -1) {
            const newUnreadMessageCount =
              conversations[conversationKey]["unreadMessageCount"] +
              eachConversation["unreadMessageCount"];
            const updatedConversation = {
              ...conversations[conversationKey],
              unreadMessageCount: newUnreadMessageCount,
            };
            conversations.splice(conversationKey, 1, updatedConversation);

            conversationList.splice(conversationKey, 1);
          }
        });

        const arr = [...conversations, ...conversationList];
        const finalVals = [];

        let vals = arr.map((el) => el.conversationId);
        vals = new Set(vals);

        [...vals].forEach((el) =>
          arr.find((ele) => ele.conversationId === el && finalVals.push(ele))
        );

        this.setState({
          conversationlist: finalVals,
          copyOfConversationList: finalVals,
        });
      })
      .catch((error) => {
        console.log("()()", error);
        this.setState({
          decoratorMessage: Translator.translate(
            "SOMETHING_WRONG",
            this.props.lang
          ),
        });
      });
  };

  getContext = () => {
    if (this.props._parent.length) {
      return this.context;
    } else {
      return this.contextProviderRef.state;
    }
  };

  actionHandler = (action, conversation) => {
    switch (action) {
      case enums.ACTIONS["CONVERSATION_DELETED"]:
        this.conversationDeleted(conversation);
        break;
      case enums.ACTIONS["DELETE_CONVERSATION"]:
        this.deleteConversation(conversation);
        break;
      default:
        break;
    }
  };

  deleteConversation = (conversation) => {
    if (!this.state.showConfirmDialog) {
      this.setState({
        showConfirmDialog: true,
        conversationToBeDeleted: conversation,
      });
    }
  };

  onDeleteConfirm = (e) => {
    const optionSelected = e.target.value;

    this.setState({ showConfirmDialog: false });
    if (optionSelected === "yes") {
      const conversation = this.state.conversationToBeDeleted;
      const conversationWith =
        conversation.conversationType === CometChat.RECEIVER_TYPE.GROUP
          ? conversation?.conversationWith?.guid
          : conversation?.conversationWith?.uid;
      CometChat.deleteConversation(
        conversationWith,
        conversation.conversationType
      )
        .then((deletedConversation) => {
          this.conversationDeleted(conversation);
        })
        .catch((error) => {
          console.log("()()", error);
          this.toastRef.setError("SOMETHING_WRONG");
        });
    } else {
      this.setState({
        showConfirmDialog: false,
        conversationToBeDeleted: null,
      });
    }
  };

  conversationDeleted = (conversation) => {
    const conversationList = [...this.state.conversationlist];
    const conversationKey = conversationList.findIndex(
      (c) => c.conversationId === conversation.conversationId
    );

    if (conversationKey > -1) {
      if (
        (conversation.conversationType === this.getContext().type &&
          this.getContext().type === CometChat.RECEIVER_TYPE.USER &&
          conversation.conversationWith.uid === this.getContext().item.uid) ||
        (conversation.conversationType === this.getContext().type &&
          this.getContext().type === CometChat.RECEIVER_TYPE.GROUP &&
          conversation.conversationWith.guid === this.getContext().item.guid)
      ) {
        this.getContext().setTypeAndItem("", {});
      }

      conversationList.splice(conversationKey, 1);
      this.setState({
        conversationlist: conversationList,
        conversationToBeDeleted: null,
      });
    }
  };

  searchGroup = (e) => {
    const { value } = e.target;

    if (value.length < 1) {
      this.setState({ conversationlist: [] }, () => {
        this.ConversationListManager = new ConversationListManager(
          this.getContext()
        );
        this.getConversations();
        this.ConversationListManager.attachListeners(this.conversationCallback);
      });
    }

    const updatedArr = this.state.copyOfConversationList.filter((el) =>
      el.conversationWith.name.toLowerCase().includes(value)
    );

    this.setState({
      ...this.state,
      conversationlist: updatedArr,
    });
  };

  handleToggle() {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  }

  handleClose(event) {
    if (
      this.anchorRef.current &&
      this.anchorRef.current.contains(event.target)
    ) {
      return;
    }

    this.setState({
      open: false,
    });
  }

  handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      this.setState({
        open: false,
      });
    } else if (event.key === "Escape") {
      this.setState({
        open: false,
      });
    }
  }

  render() {
    const conversationList = (conversationlist) => {
      return conversationlist.map((conversation, key) => {
        return (
          <CometChatConversationListItem
            key={conversation.conversationId}
            index={key}
            conversation={conversation}
            loggedInUser={this.loggedInUser}
            handleClick={this.handleClick}
            actionGenerated={this.actionHandler}
            isActiveChat={this.state.activeChatId == key ? true : false}
          />
        );
      });
    };

    let messageContainer = null;
    if (this.state.decoratorMessage.length !== 0) {
      messageContainer = (
        <div css={chatsMsgStyle()} className="chats__decorator-message">
          <p css={chatsMsgTxtStyle(theme)} className="decorator-message">
            {this.state.decoratorMessage}
          </p>
        </div>
      );
    }

    let closeBtn = (
      <div
        css={chatsHeaderCloseStyle(navigateIcon, theme)}
        className="header__close"
        onClick={this.handleMenuClose}
      ></div>
    );
    if (this.getContext() && Object.keys(this.getContext().item).length === 0) {
      closeBtn = null;
    }

    let showConfirmDialog = null;
    if (this.state.showConfirmDialog) {
      showConfirmDialog = (
        <CometChatConfirmDialog
          {...this.props}
          onClick={this.onDeleteConfirm}
          message={Translator.translate(
            "DELETE_CONFIRM",
            this.getContext().language
          )}
          confirmButtonText={Translator.translate(
            "DELETE",
            this.getContext().language
          )}
          cancelButtonText={Translator.translate(
            "CANCEL",
            this.getContext().language
          )}
        />
      );
    }

    const chatList = (
      <div css={chatsWrapperStyle(this.props, theme)} className="chats">
        <div css={chatsHeaderStyle(theme)} className="chats__header">
          {closeBtn}
          <h4
            css={chatsHeaderTitleStyle(this.props)}
            className="header__title"
            dir={Translator.getDirection(this.props.lang)}
          >
            {allWords.th.yapp}!{/* {Translator.translate("CHATS", this.props.lang)} */}
          </h4>

          <div style={{display: "flex"}}>
            {/* <div
              style={{ width: "2rem", cursor: "pointer" }}
              onClick={() => {
                this.setState({
                  ...this.state,
                  showSearchBox: !this.state.showSearchBox,
                });
              }}
            >
              <img src={searchIcon} alt="icon" />
            </div> */}
            <div
              style={{width: "2rem", cursor: "pointer", textAlign: "right"}}
              onClick={() => this.props.changeTabToUsers()}
            >
              <img src={addIcon} alt="icon" />
            </div>
            <div
              style={{
                width: "2rem",
                cursor: "pointer",
                textAlign: "right",
                color: "#b0b2b5",
              }}
              ref={this.anchorRef}
              onClick={this.handleToggle}
            >
              <MoreVertIcon fontSize="medium" />
            </div>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
                style: {
                  display: "flex",
                  flexDirection: "column",
                },
              }}
              open={this.state.open}
              anchorEl={this.anchorRef.current}
              onClose={this.handleClose}
              PaperProps={{
                style: {
                  left: "20ch",
                  background: "#F9FAFC",
                  boxShadow: "none",
                  padding: "10px",
                  marginLeft: MOBILE_VIEW ? "0px" : "-116px",
                },
              }}
            >
              <MenuItem onClick={() => this.props.changeTabToUsers()}>
                <span
                  style={{
                    fontSize: "16px",
                    lineHeight: "19px",
                    fontWeight: "normal",
                  }}
                >
                  {" "}
                  New Klub
                </span>
              </MenuItem>
              <MenuItem onClick={this.handleClose}>
                <span
                  style={{
                    fontSize: "16px",
                    lineHeight: "19px",
                    fontWeight: "normal",
                  }}
                >
                  Select chats
                </span>
              </MenuItem>
            </Menu>
          </div>
        </div>
        {messageContainer}
        {/* Search starts*/}
        <div hidden={ this.state.showSearchBox}>
          <div css={groupSearchStyle()} className="groups__search">
            <input
              type="text"
              autoComplete="off"
              css={groupSearchInputStyle(this.props)}
              className="search__input"
              placeholder="Search people, chats, klubs..."
              // placeholder={Translator.translate("SEARCH", this.props.lang)}
              onChange={this.searchGroup}
            />
            <button
              type="button"
              className="search__button"
              css={groupSearchButtonStyle(searchIcon, this.getContext())}
            />
          </div>
        </div>
        {/* Search ends*/}

        <div
          css={chatsListStyle()}
          className="chats__list"
          onScroll={this.handleScroll}
          ref={(el) => (this.chatListRef = el)}
        >
          <Box sx={{borderBottom: 1, borderColor: "divider"}}>
            <Tabs
              sx={{color: "#808080"}}
              value={this.state.tabValue}
              onChange={(e, value) => this.setState({tabValue: value})}
              TabIndicatorProps={{style: {backgroundColor: "#000000"}}}
              variant="fullWidth"
              aria-label="basic tabs "
            >
              <Tab
                value={0}
                label="Chats"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  fontSize: "16px",
                  lineHeight: "19px",
                  color: "#808080",
                  "&.Mui-selected": {
                    color: "#000000",
                    fontWeight: "bold",
                  },
                }}
              />
              <Tab
                value={1}
                label="Klubs"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "medium",
                  fontSize: "16px",
                  lineHeight: "19px",
                  color: "#808080",
                  "&.Mui-selected": {
                    color: "#000000",
                    fontWeight: "bold",
                  },
                }}
              />
            </Tabs>
          </Box>
          <TabPanel value={this.state.tabValue} index={0}>
            {conversationList(this.state.conversationlist)}
          </TabPanel>
          <TabPanel value={this.state.tabValue} index={1}>
            {conversationList(
              this.state.conversationlist.filter((item) => item.conversationType === "group")
            )}
          </TabPanel>
        </div>
        {showConfirmDialog}
        <CometChatToastNotification
          ref={(el) => (this.toastRef = el)}
          lang={this.props.lang}
        />
      </div>
    );

    let chatListWrapper = chatList;
    //if used as a standalone component, add errorboundary and context provider
    if (this.props._parent === "") {
      chatListWrapper = (
        <CometChatContextProvider ref={(el) => (this.contextProviderRef = el)}>
          {chatList}
        </CometChatContextProvider>
      );
    }

    return chatListWrapper;
  }
}

// Specifies the default values for props:
CometChatConversationList.defaultProps = {
  lang: Translator.getDefaultLanguage(),
  theme: theme,
  onItemClick: () => {},
  _parent: "",
};

CometChatConversationList.propTypes = {
  lang: PropTypes.string,
  theme: PropTypes.object,
  onItemClick: PropTypes.func,
  _parent: PropTypes.string,
};

export { CometChatConversationList };
