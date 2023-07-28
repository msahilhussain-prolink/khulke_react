import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatNavBar } from "./CometChatNavBar";
import CometChatSubNavBar from "./CometChatSubNavBar";
import { CometChatMessages } from "../Messages";
import { CometChatIncomingCall, CometChatIncomingDirectCall } from "../Calls";

import { CometChatContextProvider } from "../../util/CometChatContext";
import * as enums from "../../util/enums.js";
import { theme } from "../../resources/theme";
import Translator from "../../resources/localization/translator";
import Lottie from "react-lottie";
import * as yapImage from "../../resources/yap-img.json";

import {
  unifiedStyle,
  unifiedSidebarStyle,
  unifiedSubSidebarStyle,
  unifiedMainStyle,
  yappImageStyleDiv,
  yappImageStyle,
} from "./style";
import { MainDiv } from "./style";
import { CenterDiv } from "../../../../../../../../global_styles/global_style";
import LeftSideBar from "../../../../../../../../components/LeftSideBar";
import Header from "../../../../../../../../components/Header";
import { globalImages } from "../../../../../../../../assets/imagesPath/images";

class CometChatUI extends React.Component {
  loggedInUser = null;

  constructor(props) {
    super(props);
    this.state = {
      sidebarview: false,
      isChatSelected: false,
    };

    this.navBarRef = React.createRef();
    this.contextProviderRef = React.createRef();
  }

  componentDidMount() {
    if (
      this.props.chatWithUser.length === 0 &&
      this.props.chatWithGroup.length === 0
    ) {
      this.toggleSideBar();
    }
  }

  navBarAction = (action, type, item) => {
    if (!this.state.isChatSelected) this.setState({ isChatSelected: true });

    switch (action) {
      case enums.ACTIONS["ITEM_CLICKED"]:
        this.itemClicked(item, type);
        break;
      case enums.ACTIONS["TOGGLE_SIDEBAR"]:
        this.toggleSideBar();
        break;
      default:
        break;
    }
  };

  itemClicked = (item, type) => {
    this.contextProviderRef.setTypeAndItem(type, item);
    this.toggleSideBar();
  };

  actionHandler = (action, item, count, ...otherProps) => {
    switch (action) {
      case enums.ACTIONS["TOGGLE_SIDEBAR"]:
        this.toggleSideBar();
        break;
      case enums.GROUP_MEMBER_SCOPE_CHANGED:
      case enums.GROUP_MEMBER_KICKED:
      case enums.GROUP_MEMBER_BANNED:
        this.groupUpdated(action, item, count, ...otherProps);
        break;
      default:
        break;
    }
  };

  toggleSideBar = () => {
    const sidebarview = this.state.sidebarview;
    this.setState({ sidebarview: !sidebarview });
  };

  /**
	 If the logged in user is banned, kicked or scope changed, update the chat window accordingly
	 */
  groupUpdated = (key, message, group, options) => {
    switch (key) {
      case enums.GROUP_MEMBER_BANNED:
      case enums.GROUP_MEMBER_KICKED: {
        if (
          this.contextProviderRef.state.type ===
            CometChat.ACTION_TYPE.TYPE_GROUP &&
          this.contextProviderRef.state.item.guid === group.guid &&
          options.user.uid === this.loggedInUser.uid
        ) {
          this.contextProviderRef.setItem({});
          this.contextProviderRef.setType("");
        }
        break;
      }
      case enums.GROUP_MEMBER_SCOPE_CHANGED: {
        if (
          this.contextProviderRef.state.type ===
            CometChat.ACTION_TYPE.TYPE_GROUP &&
          this.contextProviderRef.state.item.guid === group.guid &&
          options.user.uid === this.loggedInUser.uid
        ) {
          const newObject = Object.assign(
            {},
            this.contextProviderRef.state.item,
            { scope: options["scope"] }
          );
          this.contextProviderRef.setItem(newObject);
          this.contextProviderRef.setType(CometChat.ACTION_TYPE.TYPE_GROUP);
        }
        break;
      }
      default:
        break;
    }
  };

  render() {
    let messageScreen;
    this.state.isChatSelected
      ? (messageScreen = (
          <CometChatMessages
            theme={this.props.theme}
            lang={this.props.lang}
            _parent="unified"
            actionGenerated={this.actionHandler}
          />
        ))
      : (messageScreen = (
          <div css={yappImageStyleDiv}>
            {/* <img
              css={yappImageStyle}
              className="yapp-image"
              src={globalImages.si_yapp_empty}
              alt="yapp_image"
            /> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "72px",
              }}
            >
              <span
                style={{
                  fontFamily: "Work Sans",
                  fontSize: "56px",
                  lineHeight: "86px",
                  fontWeight: "bold",
                }}
              >
                Welcome to Yapp!
              </span>
              <span
                style={{
                  fontSize: "25px",
                  lineHeight: "31px",
                  fontWeight: "normal",
                  textAlign: "center",
                }}
              >
                Drop a line, share Posts and more with private conversations between you and
                others on Khul ke.
              </span>
            <div>
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: yapImage.default,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={362}
                  width={452}
                  speed={1}
                ></Lottie>
              </div>
            </div>
          </div>
        ));

    return (
      <>
        <Header />
        <MainDiv>
          {/* <LeftDiv> */}
          {/* <div
          style={{
            marginLeft: "3rem",
            marginRight: "20px",
          }}
        > */}
          {/* <LeftSideBar /> */}
          {/* </div> */}
          {/* </LeftDiv> */}
          <CenterDiv
            style={{
              overflowY: "clip",
              // maxWidth: "1150px",
              // width: "921px",
              marginRight: 0,
              marginLeft: 0,
              overflowX: "unset",
              maxWidth: "unset",
            }}
            id={"margin0"}
          >
            <CometChatContextProvider
              ref={(el) => (this.contextProviderRef = el)}
              user={this.props.chatWithUser}
              group={this.props.chatWithGroup}
              language={this.props.lang}
            >
              <div
                css={unifiedStyle(this.props)}
                className="cometchat cometchat--unified"
                dir={Translator.getDirection(this.props.lang)}
              >
                {/* <div css={unifiedSubSidebarStyle(this.state, this.props)} className="unified__sidebar">
						<CometChatSubNavBar
            ref={el => this.navBarRef = el}
            theme={this.props.theme}
            actionGenerated={this.navBarAction} />
					</div> */}
                <div
                  css={unifiedSidebarStyle(this.state, this.props)}
                  className="unified__sidebar"
                >
                  <CometChatNavBar
                    ref={(el) => (this.navBarRef = el)}
                    theme={this.props.theme}
                    actionGenerated={this.navBarAction}
                  />
                </div>
                <div
                  css={unifiedMainStyle(this.state, this.props)}
                  className="unified__main"
                >
                  {messageScreen}
                </div>
                <CometChatIncomingCall
                  theme={this.props.theme}
                  lang={this.props.lang}
                  actionGenerated={this.actionHandler}
                />
                <CometChatIncomingDirectCall
                  theme={this.props.theme}
                  lang={this.props.lang}
                  actionGenerated={this.actionHandler}
                />
              </div>
            </CometChatContextProvider>
          </CenterDiv>
        </MainDiv>
      </>
    );
  }
}

// Specifies the default values for props:
CometChatUI.defaultProps = {
  lang: Translator.getDefaultLanguage(),
  theme: theme,
  chatWithUser: "",
  chatWithGroup: "",
};

CometChatUI.propTypes = {
  lang: PropTypes.string,
  theme: PropTypes.object,
  chatWithUser: PropTypes.string,
  chatWithGroup: PropTypes.string,
};

export { CometChatUI };
