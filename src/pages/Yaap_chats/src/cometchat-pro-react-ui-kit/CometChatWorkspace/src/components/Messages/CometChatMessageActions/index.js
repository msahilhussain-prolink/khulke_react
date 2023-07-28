import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import * as enums from "../../../util/enums.js";
import { CometChatContext } from "../../../util/CometChatContext";

import { theme } from "../../../resources/theme";
import Translator from "../../../resources/localization/translator";

import {
  messageActionStyle,
  actionGroupStyle,
  groupButtonStyle,
} from "./style";

import startThreadIcon from "./resources/threaded-message.svg";
import deleteIcon from "./resources/delete.svg";
import editIcon from "./resources/edit.svg";
import reactIcon from "./resources/reactions.svg";
import translateIcon from "./resources/message-translate.svg";
import sendMessageInPrivateIcon from "./resources/send-message-in-private.svg";
import pinMessageIcon from "./resources/pin.svg";
import unpinMessageIcon from "./resources/unpin.svg";
import copyIcon from "./resources/copy.svg";
import reportIcon from "./resources/report.svg";
import likeIcon from "./resources/like.svg";
import dislikeIcon from "./resources/dislike.svg";
import logger from "../../../../../../../../../logger/index.js";

let CometChatMessageActions = (props) => {
  const context = React.useContext(CometChatContext);

  const [loggedInUser, setLoggedInUser] = React.useState(null);

  // make true false in state, to enable/disable the message actions

  const [state, setState] = React.useState({
    message: props.message,
    matched: null,
    enableMessageReaction: true,
    enableThreadedChats: false,
    enableDeleteMessage: true,
    enableEditMessage: true,
    enableTranslateMessage: false,
    enableMessageInPrivate: false,
    enableDeleteMessageForModerator: false,
  });

  React.useEffect(() => {
    context
      .getLoggedinUser()
      .then((user) => {
        setLoggedInUser(user);
      })
      .then(() => {
        do__enableMessageReaction();
        do__enableThreadedChats();
        do__enableDeleteMessage();
        do__enableDeleteMessageForModerator();
        do__enableEditMessage();
        do__enableTranslateMessage();
        do__enableMessageInPrivate();
      });
  }, []);

  React.useEffect(() => {
    let doWork = async () => {
      try {
        const URL = `v1/fetch?receiverType=${state.message.data.entities.receiver.entityType}&receiver=${state.message.data.entities.receiver.entity.uid}`;
        let val = await CometChat.callExtension(
          "pin-message",
          "GET",
          URL,
          null
        );
        let done = true;
        for (let i = 0; i < val.pinnedMessages.length; i++) {
          if (val.pinnedMessages[i].id === state.message.id) {
            setState({ ...state, matched: true });
            done = false;
            break;
          }
        }
        if (done) setState({ ...state, matched: false });
      } catch (E) {
        setState({ ...state, matched: false });
      }
    };
    doWork();
  }, []);

  let do__toggleTooltip = (event, flag) => {
    const elem = event.target;
    if (flag) {
      elem.setAttribute("title", elem.dataset.title);
    } else {
      elem.removeAttribute("title");
    }
  };
  let do__enableMessageReaction = () => {
    context.FeatureRestriction.isReactionsEnabled()
      .then((response) => {
        if (response === true) {
          setState({ ...state, enableMessageReaction: true });
        } else {
          setState({ ...state, enableMessageReaction: false });
        }
      })
      .catch((error) => {
        setState({ ...state, enableMessageReaction: false });
      });
  };
  let do__enableThreadedChats = () => {
    if (props.message.hasOwnProperty("parentMessageId") === true) {
      return false;
    }
    context.FeatureRestriction.isThreadedMessagesEnabled()
      .then((response) => {
        if (response === true) {
          setState({ ...state, enableThreadedChats: true });
        } else {
          setState({ ...state, enableThreadedChats: false });
        }
      })
      .catch((error) => {
        setState({ ...state, enableThreadedChats: false });
      });
  };
  let do__enableDeleteMessage = () => {
    context.FeatureRestriction.isDeleteMessageEnabled()
      .then((response) => {
        if (response === true) {
          setState({ ...state, enableDeleteMessage: true });
        } else {
          setState({ ...state, enableDeleteMessage: false });
        }
      })
      .catch((error) => {
        setState({ ...state, enableDeleteMessage: false });
      });
  };
  let do__enableDeleteMessageForModerator = () => {
    context.FeatureRestriction.isDeleteMemberMessageEnabled()
      .then((response) => {
        if (response === true) {
          setState({ ...state, enableDeleteMessageForModerator: true });
        } else {
          setState({ ...state, enableDeleteMessageForModerator: false });
        }
      })
      .catch((error) => {
        setState({ ...state, enableDeleteMessageForModerator: false });
      });
  };
  logger.info(
    JSON.parse(localStorage.current_user),
    props.message.sender?.uid,
    "uid"
  );

  let do__enableEditMessage = () => {
    if (
      props.message.sender?.uid !== loggedInUser?.uid ||
      props.message.type !== CometChat.MESSAGE_TYPE.TEXT
    ) {
      return false;
    }
    context.FeatureRestriction.isEditMessageEnabled()
      .then((response) => {
        if (response === true) {
          setState({ ...state, enableEditMessage: true });
        } else {
          setState({ ...state, enableEditMessage: false });
        }
      })
      .catch((error) => {
        setState({ ...state, enableEditMessage: false });
      });
  };
  let do__enableTranslateMessage = () => {
    if (props.message.type !== CometChat.MESSAGE_TYPE.TEXT) {
      return false;
    }
    context.FeatureRestriction.isMessageTranslationEnabled()
      .then((response) => {
        if (response === true) {
          setState({ ...state, enableTranslateMessage: true });
        } else {
          setState({ ...state, enableTranslateMessage: false });
        }
      })
      .catch((error) => {
        setState({ ...state, enableTranslateMessage: false });
      });
  };

  let do__enableMessageInPrivate = () => {
    context.FeatureRestriction.isMessageInPrivateEnabled()
      .then((response) => {
        if (response === true) {
          setState({ ...state, enableMessageInPrivate: true });
        } else {
          setState({ ...state, enableMessageInPrivate: false });
        }
      })
      .catch((error) => {
        setState({ ...state, enableMessageInPrivate: false });
      });
  };
  let do__sendMessageInPrivate = () => {
    const item = props.message?.sender;
    const type = CometChat.ACTION_TYPE.TYPE_USER;
    context.setTypeAndItem(type, item);
  };
  let do__reactToMessage = () => {
    props.actionGenerated(enums.ACTIONS["REACT_TO_MESSAGE"], props.message);
  };
  let do__viewThread = () => {
    props.actionGenerated(
      enums.ACTIONS["VIEW_THREADED_MESSAGE"],
      props.message
    );
  };
  let do__deleteMessage = () => {
    props.actionGenerated(enums.ACTIONS["DELETE_MESSAGE"], props.message);
  };
  let do__editMessage = () => {
    props.actionGenerated(enums.ACTIONS["EDIT_MESSAGE"], props.message);
  };
  let do__pinMessage = () => {
    props.actionGenerated(enums.ACTIONS["PIN_MESSAGE"], props.message);
  };

  let do__unpinMessage = () => {
    CometChat.callExtension("pin-message", "DELETE", "v1/unpin", {
      msgId: state.message.id,
      receiverType: state.message.data.entities.receiver.entityType,
      receiver: state.message.data.entities.receiver.entity.uid,
    })
      .then((response) => {})
      .catch((error) => {});
  };

  let do__copyMessage = () => {
    navigator.clipboard.writeText(state.message.text);
  };

  let do_reportMessage = async () => {
    CometChat.callExtension("report-message", "POST", "v1/report", {
      msgId: state.message.id,
      reason: "Contains slang",
    })
      .then((response) => {
        logger.info(response);
      })
      .catch((error) => {
        logger.error(error);
      });
  };

  let do_likeMessage = () => {
    CometChat.callExtension("reactions", "POST", "v1/react", {
      msgId: state.message.id,
      emoji: ":+1:",
    })
      .then((response) => {
        logger.info(response);
      })
      .catch((error) => {
        logger.error(error);
      });
  };

  let do_dislikeMessage = () => {
    CometChat.callExtension("reactions", "POST", "v1/react", {
      msgId: state.message.id,
      emoji: ":-1:",
    })
      .then((response) => {
        logger.info(response);
      })
      .catch((error) => {
        logger.error(error);
      });
  };

  let do__translateMessage = () => {
    props.actionGenerated(enums.ACTIONS["TRANSLATE_MESSAGE"], props.message);
  };

  if (props.message.hasOwnProperty("sentAt") === false) {
    return false;
  }

  let reactToMessage = null;
  if (state.enableMessageReaction) {
    reactToMessage = (
      <li css={actionGroupStyle()} className="action__group">
        <button
          type="button"
          onMouseEnter={(event) => do__toggleTooltip(event, true)}
          onMouseLeave={(event) => do__toggleTooltip(event, false)}
          css={groupButtonStyle(reactIcon, context)}
          className="group__button button__reacttomessage"
          data-title={Translator.translate("ADD_REACTION", context.language)}
          onClick={do__reactToMessage}
        ></button>
      </li>
    );
  }

  let threadedChats = null;
  if (state.enableThreadedChats) {
    threadedChats = (
      <li css={actionGroupStyle()} className="action__group">
        <button
          type="button"
          onMouseEnter={(event) => do__toggleTooltip(event, true)}
          onMouseLeave={(event) => do__toggleTooltip(event, false)}
          css={groupButtonStyle(startThreadIcon, context)}
          className="group__button button__threadedchats"
          data-title={
            props.message.replyCount
              ? Translator.translate("REPLY_TO_THREAD", context.language)
              : Translator.translate("REPLY_IN_THREAD", context.language)
          }
          onClick={do__viewThread}
        ></button>
      </li>
    );
  }

  let deleteMessage = null;
  if (
    (props.message.sender?.uid === loggedInUser?.uid &&
      state.enableDeleteMessage) ||
    (context.type === CometChat.ACTION_TYPE.TYPE_GROUP &&
      props.message.sender?.uid !== loggedInUser?.uid &&
      context.item.hasOwnProperty("scope") &&
      context.item.scope !== CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT &&
      state.enableDeleteMessageForModerator &&
      state.enableDeleteMessage)
  ) {
    deleteMessage = (
      <li css={actionGroupStyle()} className="action__group">
        <button
          type="button"
          onMouseEnter={(event) => do__toggleTooltip(event, true)}
          onMouseLeave={(event) => do__toggleTooltip(event, false)}
          css={groupButtonStyle(deleteIcon, context, 1)}
          className="group__button button__delete"
          data-title={Translator.translate("DELETE_MESSAGE", context.language)}
          onClick={do__deleteMessage}
        ></button>
      </li>
    );
  }

  let editMessage = null;
  if (state.enableEditMessage) {
    editMessage = (
      <li css={actionGroupStyle()} className="action__group">
        <button
          type="button"
          onMouseEnter={(event) => do__toggleTooltip(event, true)}
          onMouseLeave={(event) => do__toggleTooltip(event, false)}
          css={groupButtonStyle(editIcon, context)}
          className="group__button button__edit"
          data-title={Translator.translate("EDIT_MESSAGE", context.language)}
          onClick={do__editMessage}
        ></button>
      </li>
    );
  }

  let pinMessage = null;
  if (true) {
    pinMessage = (
      <li css={actionGroupStyle()} className="action__group">
        <button
          type="button"
          onMouseEnter={(event) => do__toggleTooltip(event, true)}
          onMouseLeave={(event) => do__toggleTooltip(event, false)}
          css={groupButtonStyle(pinMessageIcon, context)}
          className="group__button button__edit"
          data-title={Translator.translate("PIN_USER", context.language)}
          onClick={do__pinMessage}
        ></button>
      </li>
    );
  }

  let unpinMessage = null;
  if (true) {
    unpinMessage = (
      <li css={actionGroupStyle()} className="action__group">
        <button
          type="button"
          onMouseEnter={(event) => do__toggleTooltip(event, true)}
          onMouseLeave={(event) => do__toggleTooltip(event, false)}
          css={groupButtonStyle(unpinMessageIcon, context)}
          className="group__button button__edit"
          onClick={do__unpinMessage}
          data-title="Un Pin Message"
        ></button>
      </li>
    );
  }

  let copyMessage = null;
  let reportMessage = null;
  let likeMessage = null;
  let dislikeMessage = null;
  if (state.message.type === "text") {
    copyMessage = (
      <li css={actionGroupStyle()} className="action__group">
        <button
          type="button"
          onMouseEnter={(event) => do__toggleTooltip(event, true)}
          onMouseLeave={(event) => do__toggleTooltip(event, false)}
          css={groupButtonStyle(copyIcon, context)}
          className="group__button button__edit"
          onClick={do__copyMessage}
          data-title="Copy Message"
        ></button>
      </li>
    );

    // reportMessage = (
    //   <li css={actionGroupStyle()} className="action__group">
    //     <button
    //       type="button"
    //       onMouseEnter={(event) => do__toggleTooltip(event, true)}
    //       onMouseLeave={(event) => do__toggleTooltip(event, false)}
    //       css={groupButtonStyle(reportIcon, context, true)}
    //       className="group__button button__edit"
    //       onClick={do_reportMessage}
    //       data-title="Report Message"
    //     ></button>
    //   </li>
    // );

    // likeMessage = (
    //   <li css={actionGroupStyle()} className="action__group">
    //     <button
    //       type="button"
    //       onMouseEnter={(event) => do__toggleTooltip(event, true)}
    //       onMouseLeave={(event) => do__toggleTooltip(event, false)}
    //       css={groupButtonStyle(likeIcon, context)}
    //       className="group__button button__edit"
    //       onClick={do_likeMessage}
    //       data-title="Like Message"
    //     ></button>
    //   </li>
    // );

    // dislikeMessage = (
    //   <li css={actionGroupStyle()} className="action__group">
    //     <button
    //       type="button"
    //       onMouseEnter={(event) => do__toggleTooltip(event, true)}
    //       onMouseLeave={(event) => do__toggleTooltip(event, false)}
    //       css={groupButtonStyle(dislikeIcon, context)}
    //       className="group__button button__edit"
    //       onClick={do_dislikeMessage}
    //       data-title="Dislike Message"
    //     ></button>
    //   </li>
    // );
  }

  let translateMessage = null;
  if (state.enableTranslateMessage) {
    translateMessage = (
      <li css={actionGroupStyle()} className="action__group">
        <button
          type="button"
          onMouseEnter={(event) => do__toggleTooltip(event, true)}
          onMouseLeave={(event) => do__toggleTooltip(event, false)}
          css={groupButtonStyle(translateIcon, context)}
          className="group__button button__translate"
          data-title={Translator.translate(
            "TRANSLATE_MESSAGE",
            context.language
          )}
          onClick={do__translateMessage}
        ></button>
      </li>
    );
  }

  let messageInPrivate = null;
  if (
    state.enableMessageInPrivate === true &&
    context.type === CometChat.ACTION_TYPE.TYPE_GROUP &&
    props.message?.sender?.uid !== loggedInUser?.uid
  ) {
    messageInPrivate = (
      <li>
        <button
          type="button"
          onMouseEnter={(event) => do__toggleTooltip(event, true)}
          onMouseLeave={(event) => do__toggleTooltip(event, false)}
          css={groupButtonStyle(sendMessageInPrivateIcon, context)}
          className="group__button button__translate"
          data-title={Translator.translate(
            "SEND_MESSAGE_IN_PRIVATE",
            context.language
          )}
          onClick={do__sendMessageInPrivate}
        ></button>
      </li>
    );
  }

  if (
    threadedChats === null &&
    deleteMessage === null &&
    editMessage === null &&
    reactToMessage === null &&
    translateMessage === null &&
    messageInPrivate === null
  ) {
    return null;
  }

  return (
    <>
      {state.matched === null ? null : state.matched === true ? (
        <ul
          css={messageActionStyle(props, context, loggedInUser)}
          className="message__actions"
        >
          {JSON.parse(localStorage.current_user).user_id ===
          props.message.sender?.uid
            ? editMessage
            : null}
          {JSON.parse(localStorage.current_user).user_id !==
          props.message.sender?.uid
            ? reactToMessage
            : null}
          {threadedChats}
          {unpinMessage}
          {copyMessage}
          {deleteMessage}
          {reportMessage}
          {likeMessage}
          {dislikeMessage}
          {messageInPrivate}
          {translateMessage}
        </ul>
      ) : (
        <ul
          css={messageActionStyle(props, context, loggedInUser)}
          className="message__actions"
        >
          {JSON.parse(localStorage.current_user).user_id ===
          props.message.sender?.uid
            ? editMessage
            : null}
          {JSON.parse(localStorage.current_user).user_id !==
          props.message.sender?.uid
            ? reactToMessage
            : null}
          {threadedChats}
          {pinMessage}
          {copyMessage}
          {deleteMessage}
          {/* {reportMessage} */}
          {likeMessage}
          {dislikeMessage}
          {messageInPrivate}
          {translateMessage}
        </ul>
      )}
    </>
  );
};

// Specifies the default values for props:
CometChatMessageActions.defaultProps = {
  theme: theme,
  actionGenerated: () => {},
};

CometChatMessageActions.propTypes = {
  theme: PropTypes.object.isRequired,
  actionGenerated: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
};

export { CometChatMessageActions };
