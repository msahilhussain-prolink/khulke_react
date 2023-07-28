import React from "react";
import twitter_logo from "../../assets/icons/twitter_logo.svg";
import "./style.css";
export const AvatarBadge = ({ img_src, img_alt, badge, style }) => {
  return (
    <div className="avatar-badge">
      <img src={img_src} alt={`.`} className="avatar" style={style} />
      {badge ? <img className="icon-badge" src={twitter_logo} /> : ""}
    </div>
  );
};
