import React from "react";
import {ReactComponent as H_ICON} from './icons/h.svg'
import {ReactComponent as ROUND_ICON} from './icons/round.svg'
import {ReactComponent as BELL_ICON} from './icons/bell.svg'
import {ReactComponent as PLUS_ICON} from './icons/plus.svg'
import { CometChat } from "@cometchat-pro/chat";
import "./style.css";
import { CometChatAvatar } from "../../Shared";

const CometChatSubNavBar = () => {

    let [user,setUser] = React.useState(null);

    React.useEffect(()=>{
		CometChat.getLoggedinUser().then(user => {
			setUser(user);
		}).catch();
    },[])

  return (
    <div className="sub_sidebar">
      <div className="container" id="navbar">
        <nav className="nav">
          <div className="part--1">
            <div className="nav_brand">
                <img src="https://www.khulke.com/static/media/KhulKe_logo.b9b0e8fd.svg" alt="Main Logo" className="main_logo" />
            </div>
          </div>
          <ul className="part--2">
            <li>
              <div className="nav_link">
                <div className="nav_icon"><H_ICON /></div>
                <span className="nav_name">Town hall</span>
              </div>
            </li>
            <li>
              <div className="nav_link">
                <div className="nav_icon"><ROUND_ICON /></div>
                <span className="nav_name">Round Table</span>
              </div>  
            </li>        
            <li>
              <div className="nav_link">
                <div className="nav_icon"><BELL_ICON /></div>
                <span className="nav_name" style={{flexGrow: 1}}>Notifications</span>
                <div className="nav_count">9</div>
              </div>
            </li>
            <li>
              <div className="nav_link nav_special">
                <div className="nav_icon"><PLUS_ICON /></div>
                <span className="nav_name">New Post</span>
              </div>
            </li>
          </ul>
          <div className="nav_link part--3">
            <div className="nav_icon">
                {user?<CometChatAvatar user={user} />:null}
            </div>
                {user?<span className="nav_name">{user.name}</span>:null}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default CometChatSubNavBar;