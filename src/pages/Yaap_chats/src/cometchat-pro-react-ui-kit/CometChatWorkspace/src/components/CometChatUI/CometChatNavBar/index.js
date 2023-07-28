import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import PropTypes from "prop-types";

import { CometChatUserList } from "../../Users";
import { CometChatCreateGroup, CometChatGroupList } from "../../Groups";
import { CometChatConversationList } from "../../Chats";
import { CometChatUserProfile } from "../../UserProfile";

import * as enums from "../../../util/enums.js";
import { CometChatContext } from "../../../util/CometChatContext";

import Translator from "../../../resources/localization/translator";
import { theme } from "../../../resources/theme";
import tabs from "../../../resources/tabs.json";

import {
  footerStyle,
  navbarStyle,
  itemStyle,
  itemLinkStyle,
  itemLinkTextStyle,
  parentMainDiv,
  createKlubDiv,
  createKlubImage,
  addGroupName,
} from "./style";

import chatGreyIcon from "./resources/chats.svg";
import contactGreyIcon from "./resources/users.svg";
import groupGreyIcon from "./resources/groups.svg";
import arrowIcon from "./resources/arrow.svg";
import backIcon from "./resources/back.svg";
import groupIcon from "./resources/add_group.svg";

import { CometChat } from "@cometchat-pro/chat";
import {
  chatsHeaderStyle,
  chatsHeaderTitleStyle,
} from "../../Chats/CometChatConversationList/style";
import ButtonYapp from "../../Button/ButtonYapp";

import { CometChatAvatar } from "../../Shared";
import moreGreyIcon from "./resources/more.svg";
import axios from "axios";
import { REACT_APP_BASE_URL } from "../../../../../../../../../constants/env";
import logger from "../../../../../../../../../logger";
import { allWords } from "../../../../../../../../../App";

export class CometChatNavBar extends React.Component {
  static contextType = CometChatContext;

  tabListKeys = [];
  constructor(props) {
    super(props);

    this.state = {
      activeTab: null,
      tabList: [],
      groupName: "",
      imageForGroup: groupIcon,
      groupFile: null,
    };

    this.imageRef = React.createRef;
  }

  componentDidMount() {
    let tabList = [...this.context.UIKitSettings.tabs, "create_group"];
    let usersListForGroup = [];

    tabList.forEach((tabName) => {
      for (const t in tabs) {
        if (tabName === tabs[t]) {
          this.tabListKeys.push(t);
        }
      }
    });

    this.getFilteredTabs().then((filteredTabs) => {
      this.setState({
        tabList: [...filteredTabs, "CREATE_GROUP_FOR_USERS"],
        activeTab: filteredTabs[0],
        groupName: "",
        imageForGroup: groupIcon,
      });
    });
  }

  getFilteredTabs = () => {
    return new Promise((resolve) => {
      const filteredTabs = [];
      const promises = [
        this.enableChats(),
        this.enableUsers(),
        this.enableGroups(),
        this.enableSettings(),
      ];
      Promise.allSettled(promises).then((results) => {
        this.tabListKeys.forEach((eachTabKey) => {
          results.forEach((result) => {
            const tabKey = result.value[0];
            const tabEnabled = result.value[1];

            if (eachTabKey === tabKey && tabEnabled === true) {
              filteredTabs.push(eachTabKey);
            }
          });
        });
        resolve(filteredTabs);
      });
    });
  };

  enableChats = () => {
    return new Promise((resolve) => {
      this.context.FeatureRestriction.isRecentChatListEnabled()
        .then((response) => resolve(["SIDEBAR_CHATS", response]))
        .catch((error) => resolve(["SIDEBAR_CHATS", false]));
    });
  };

  enableUsers = () => {
    return new Promise((resolve) => {
      this.context.FeatureRestriction.isUserListEnabled()
        .then((response) => resolve(["SIDEBAR_USERS", response]))
        .catch((error) => resolve(["SIDEBAR_USERS", false]));
    });
  };

  enableGroups = () => {
    return new Promise((resolve) => {
      this.context.FeatureRestriction.isGroupListEnabled()
        .then((response) => resolve(["SIDEBAR_GROUPS", response]))
        .catch((error) => resolve(["SIDEBAR_GROUPS", false]));
    });
  };

  enableSettings = () => {
    return new Promise((resolve) => {
      this.context.FeatureRestriction.isUserSettingsEnabled()
        .then((response) => resolve(["SIDEBAR_MOREINFO", response]))
        .catch((error) => resolve(["SIDEBAR_MOREINFO", false]));
    });
  };

  tabChanged = (tab) => {
    this.setState({ activeTab: tab });
  };

  openChatOfUser = (item, type) => {
    this.props.actionGenerated(enums.ACTIONS["ITEM_CLICKED"], type, item);
  };

  // ====================

  addMembersInGroup = (groupId) => {
    const guid = groupId;

    // add uid of users to add them to group
    const membersList = [];

    this.usersListForGroup.forEach((newmember) => {
      const newMember = new CometChat.GroupMember(
        newmember.uid,
        CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT
      );
      membersList.push(newMember);

      newmember["type"] = "add";
    });

    const membersToAdd = [];
    CometChat.addMembersToGroup(guid, membersList, [])
      .then((response) => {
        if (Object.keys(response).length) {
          // for (const member in response) {
          //   if (response[member] === "success") {
          //     const found = this.state.userlist.find(
          //       (user) => user.uid === member
          //     );
          //     found["scope"] = CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT;
          //     membersToAdd.push(found);
          //   }
          // }
          // this.props.actionGenerated(
          //   enums.ACTIONS["ADD_GROUP_MEMBER_SUCCESS"],
          //   membersToAdd
          // );
        }
      })
      .catch((error) => {
        logger.error("()()", error);
        this.setState({
          addingMembers: false,
          errorMessage: Translator.translate(
            "SOMETHING_WRONG",
            this.context.language
          ),
        });
      });
  };

  createGroupHandler = () => {
    const guid = "group_" + new Date().getTime();
    const name = this.state.groupName;
    const type = "private";
    const password = "";

    if (name.length < 1) return;

    const group = new CometChat.Group(guid, name, type, password);
    CometChat.createGroup(group)
      .then((newGroup) => {
        this.setState({ creatingGroup: false });

        if (typeof newGroup === "object" && Object.keys(newGroup).length) {
          this.context.setToastMessage("success", "GROUP_CREATION_SUCCESS");
          this.setState({
            name: "",
            type: "",
            password: "",
            passwordInput: "",
          });
          this.props.actionGenerated(enums.ACTIONS["GROUP_CREATED"], newGroup);

          let groupId = newGroup.guid;

          this.addMembersInGroup(groupId);
        } else {
          this.setState({
            errorMessage: Translator.translate(
              "SOMETHING_WRONG",
              this.context.language
            ),
          });
        }

        // FOR ADDING GROUP ICON

        let participantsList = this.usersListForGroup.map((el) => {
          return {
            user_id: el.uid,
          };
        });

        let { guid, membersCount, owner, name } = newGroup;

        const tempData = {
          guid,
          name,
          member_count: membersCount,
          owner: [{ user_id: owner }],
          participants: participantsList,
        };

        const data = new FormData();
        data.append("image", this.state.groupFile);
        data.append("data", JSON.stringify(tempData));

        let config = {
          method: "post",
          url: `${REACT_APP_BASE_URL}/user/yapp-user-group/`,
          headers: {
            Authorization: `Bearer ${localStorage.access}`,
            "Content-Type": "multipart/form-data",
          },
          data,
        };

        axios(config)
          .then((res) => logger.info({ success: res }))
          .catch((err) => logger.error({ error: err }));
      })
      .catch((error) => {
        logger.error("()()", error);
        this.setState({
          creatingGroup: false,
          errorMessage: Translator.translate(
            "SOMETHING_WRONG",
            this.context.language
          ),
        });
      });

    this.tabChanged("SIDEBAR_CHATS");
  };

  listOfUsersDiv = () => {
    let listOfusersListForGroup;

    if (this.usersListForGroup)
      listOfusersListForGroup = this.usersListForGroup.map((el) => (
        <div
          style={{ margin: "0 0.5rem", width: "50%" }}
          className="user_details"
        >
          <div
            style={{ width: "2rem", marginBottom: "0.5rem" }}
            className="user_image"
          >
            <CometChatAvatar user={el} />
          </div>
          <p className="users_name">{el.name}</p>
        </div>
      ));

    return listOfusersListForGroup;
  };

  closeBtn = () => (
    <img
      style={{ marginRight: "0.5rem", width: "1.25rem", cursor: "pointer" }}
      src={backIcon}
      alt="back"
      onClick={() => this.tabChanged("SIDEBAR_USERS")}
    />
  );

  createGroupForUsers = () => (
    <div style={parentMainDiv()} className="create_klub_page">
      <div css={chatsHeaderStyle(theme)} className="chats__header">
        {this.closeBtn()}
        <h4
          css={chatsHeaderTitleStyle(this.props)}
          className="header__title"
          dir={Translator.getDirection(this.props.lang)}
        >
          {allWords.yapp.newKlub}
          {/* {Translator.translate("CHATS", this.props.lang)} */}
        </h4>
      </div>
      <div style={createKlubDiv()} className="create_klub_div">
        <input
          type="file"
          id="group_image"
          name="group_image"
          style={{ display: "none" }}
          ref={(input) => (this.imageRef = input)}
          onChange={(e) =>
            this.setState({
              ...this.state,
              imageForGroup: URL.createObjectURL(e.target.files[0]),
              groupFile: e.target.files[0],
            })
          }
        />
        <img
          src={this.state.imageForGroup}
          alt="group_image"
          onClick={() => this.imageRef.click()}
          style={createKlubImage()}
        />
        <p style={{ opacity: "0.5" }}>
          {this.state.groupName.length > 1 ? "Klub Name" : null}
        </p>
        <div className="text__group--name">
          <input
            type="text"
            style={addGroupName()}
            onChange={(e) =>
              this.setState({ ...this.state, groupName: e.target.value })
            }
            maxLength={25}
            placeholder={allWords.yapp.klubName}
          />
          <span
            style={{
              position: "absolute",
              right: "2.5rem",
              fontWeight: 600,
            }}
          >
            {this.state.groupName.length}
          </span>
        </div>
        {this.state.groupName.length < 1 && (
          <span style={{ color: "red", fontSize: "small" }}>
            Please enter klub name
          </span>
        )}

        <div style={{ margin: "3rem 0 1.5rem 0" }}>
          <h4>
            {allWords.misc.livert.Participants} {this.usersListForGroup?.length}
          </h4>
        </div>
        <div style={{ display: "flex", overflowY: "scroll" }}>
          {this.listOfUsersDiv()}
        </div>

        <ButtonYapp
          propStyles={{ marginTop: "2rem" }}
          btnText={allWords.yapp.createKlub}
          btnIcon={arrowIcon}
          btnFunction={this.createGroupHandler}
        />
      </div>
    </div>
  );
  handleChangeActiveTab = (newTab) => {
    this.setState({ activeTab: newTab });
  };

  getActiveTab = () => {
    switch (this.state.activeTab) {
      case "SIDEBAR_CALLS":
        return null;
      case "SIDEBAR_CHATS":
        return (
          <CometChatConversationList
            theme={this.props.theme}
            lang={this.context.language}
            _parent="unified"
            actionGenerated={this.props.actionGenerated}
            onItemClick={(item, type) => this.openChatOfUser(item, type)}
            changeTabToUsers={() => this.tabChanged("SIDEBAR_USERS")}
            handleChangeActiveTab={this.handleChangeActiveTab}
            // when user click in new chat list on user, to navigate and open list on conversation list tab
          />
        );
      case "SIDEBAR_GROUPS":
        return (
          <CometChatGroupList
            theme={this.props.theme}
            lang={this.context.language}
            _parent="unified"
            actionGenerated={this.props.actionGenerated}
            onItemClick={(item, type) =>
              this.props.actionGenerated(
                enums.ACTIONS["ITEM_CLICKED"],
                type,
                item
              )
            }
          />
        );
      case "SIDEBAR_USERS":
        return (
          <CometChatUserList
            theme={this.props.theme}
            lang={this.context.language}
            _parent="unified"
            actionGenerated={this.props.actionGenerated}
            onItemClick={(item, type) =>
              this.props.actionGenerated(
                enums.ACTIONS["ITEM_CLICKED"],
                type,
                item
              )
            }
            changeTabToCreateGroup={(val) => {
              this.tabChanged("CREATE_GROUP_FOR_USERS");
              this.usersListForGroup = val;
            }}
            changeTabToConversations={() => {
              this.tabChanged("SIDEBAR_CHATS");
            }}
          />
        );
      case "CREATE_GROUP_FOR_USERS":
        return this.createGroupForUsers();
      case "SIDEBAR_MOREINFO":
        return (
          <CometChatUserProfile
            theme={this.props.theme}
            lang={this.context.language}
            onItemClick={(item, type) =>
              this.props.actionGenerated(
                enums.ACTIONS["ITEM_CLICKED"],
                type,
                item
              )
            }
          />
        );
      default:
        return null;
    }
  };

  getTabList = () => {
    const chatsTabActive =
      this.state.activeTab === "SIDEBAR_CHATS" ? true : false;
    const groupsTabActive =
      this.state.activeTab === "SIDEBAR_GROUPS" ? true : false;
    const userTabActive =
      this.state.activeTab === "SIDEBAR_USERS" ? true : false;
    const userTabActive2 =
      this.state.activeTab === "CREATE_GROUP_FOR_USERS" ? true : false;
    //const moreTabActive = this.state.activeTab === "SIDEBAR_MOREINFO" ? true : false;

    const tabList = [...this.state.tabList];

    return tabList.map((tab) => {
      switch (tab) {
        case "SIDEBAR_CHATS":
          return (
            <div
              key={tab}
              css={itemStyle(this.props)}
              className="navbar__item"
              onClick={() => this.tabChanged("SIDEBAR_CHATS")}
            >
              <div
                css={itemLinkStyle(chatGreyIcon, chatsTabActive, this.context)}
                className="item__link item__link__chats"
                title={Translator.translate("CHATS", this.context.language)}
              ></div>
              <div
                css={itemLinkTextStyle(chatsTabActive, this.context)}
                className="item__label"
              >
                {Translator.translate("CHATS", this.context.language)}
              </div>
            </div>
          );
        case "SIDEBAR_GROUPS":
          return (
            <div
              key={tab}
              css={itemStyle(this.props)}
              className="navbar__item"
              onClick={() => this.tabChanged("SIDEBAR_GROUPS")}
            >
              <div
                css={itemLinkStyle(
                  groupGreyIcon,
                  groupsTabActive,
                  this.context
                )}
                className="item__link item__link__groups"
                title={Translator.translate("GROUPS", this.context.language)}
              ></div>
              <div
                css={itemLinkTextStyle(groupsTabActive, this.context)}
                className="item__label"
              >
                {Translator.translate("GROUPS", this.context.language)}
              </div>
            </div>
          );
        case "SIDEBAR_USERS":
          return (
            <div
              key={tab}
              css={itemStyle(this.props)}
              className="navbar__item"
              onClick={() => this.tabChanged("SIDEBAR_USERS")}
            >
              <div
                css={itemLinkStyle(
                  contactGreyIcon,
                  userTabActive,
                  this.context
                )}
                className="item__link item__link__contacts"
                title={Translator.translate("USERS", this.context.language)}
              ></div>
              <div
                css={itemLinkTextStyle(userTabActive, this.context)}
                className="item__label"
              >
                {Translator.translate("USERS", this.context.language)}
              </div>
            </div>
          );
        case "CREATE_GROUP_FOR_USERS":
          return (
            <div
              key={tab}
              css={itemStyle(this.props)}
              className="navbar__item"
              onClick={() => this.tabChanged("CREATE_GROUP_FOR_USERS")}
            >
              {/* <div
                css={itemLinkStyle(
                  contactGreyIcon,
                  userTabActive2,
                  this.context
                )}
                className="item__link item__link__contacts"
                title={Translator.translate("USERS", this.context.language)}
              ></div>
              <div
                css={itemLinkTextStyle(userTabActive2, this.context)}
                className="item__label"
              >
                {Translator.translate("USERS", this.context.language)}
              </div> */}
              hehlo
            </div>
          );

        //   GROUPS ICON - BOTTOM BAR

        //case "SIDEBAR_MOREINFO":
        //	return (
        //		<div key={tab} css={itemStyle(this.props)} className="navbar__item" onClick={() => this.tabChanged("SIDEBAR_MOREINFO")}>
        //			<div css={itemLinkStyle(moreGreyIcon, moreTabActive, this.context)} className="item__link item__link__info" title={Translator.translate("MORE", this.context.language)}></div>
        //			<div css={itemLinkTextStyle(moreTabActive, this.context)} className="item__label">{Translator.translate("MORE", this.context.language)}</div>
        //		</div>
        //	);
        default:
          return null;
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.getActiveTab()}
        <div css={footerStyle()} className="sidebar__footer">
          <div css={navbarStyle()} className="footer__navbar">
            {this.getTabList()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// Specifies the default values for props:
CometChatNavBar.defaultProps = {
  theme: theme,
};

CometChatNavBar.propTypes = {
  theme: PropTypes.object,
};
