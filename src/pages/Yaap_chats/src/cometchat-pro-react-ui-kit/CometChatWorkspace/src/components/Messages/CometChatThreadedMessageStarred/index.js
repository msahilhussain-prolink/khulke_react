import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatContext } from "../../../util/CometChatContext";
import * as enums from "../../../util/enums.js";

import { theme } from "../../../resources/theme";
import Translator from "../../../resources/localization/translator";

import { replyCountStyle } from "./style";

const CometChatThreadedMessageStarred = (props) => {
  let [matched, setMatched] = React.useState(null);

  React.useEffect(() => {
    if (matched === null) {
      let doWork = async () => {
        try {
          const URL = `v1/fetch?receiverType=${props.message.data.entities.receiver.entityType}&receiver=${props.message.data.entities.receiver.entity.uid}`;
          let val = await CometChat.callExtension(
            "pin-message",
            "GET",
            URL,
            null
          );
          let done = true;

          for (let i = 0; i < val.pinnedMessages.length; i++) {
            if (val.pinnedMessages[i].id === props.message.id) {
              setMatched(true);
              done = false;
              break;
            }
          }

          if (done) setMatched(false);
        } catch (E) {
          setMatched(false);
        }
      };

      doWork();
    }
  }, [matched]);


  const context = React.useContext(CometChatContext);
  // const [reply, setReply] = React.useState(false);

  // const toggleReply = () => {
  // 	context.FeatureRestriction.isThreadedMessagesEnabled()
  // 		.then(response => {
  // 			if (response !== reply) {
  // 				setReply(response);
  // 			}
  // 		})
  // 		.catch(error => {
  // 			if (reply !== false) {
  // 				setReply(false);
  // 			}
  // 		});
  // };

  // React.useEffect(toggleReply);

  // const viewThread = () => {
  // 	props.actionGenerated(enums.ACTIONS["VIEW_THREADED_MESSAGE"], props.message);
  // }

  return (
    <>
      <span css={replyCountStyle(context)} className="starred">
        {matched ? <>&#9733;</> : <></>}
      </span>
    </>
  );
};

// Specifies the default values for props:
CometChatThreadedMessageStarred.defaultProps = {
  theme: theme,
  actionGenerated: () => { },
};

CometChatThreadedMessageStarred.propTypes = {
  theme: PropTypes.object,
  actionGenerated: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
};

export { CometChatThreadedMessageStarred };
