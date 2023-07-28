import { Action } from "../../../../utils/Constant/action";
import LikedIConComp from "../../../../components/IconsComponents/LikedComponent";
import DislikeComponent from "../../../../components/IconsComponents/DislikeComponent";
import RepliedIconComp from "../../../../components/IconsComponents/RepliedIconComponent";
import ReTweetIcon from "../../../../components/IconsComponents/ReTweetIcon";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import React from "react";

const ActionTypeIcon = ({actionType = ""}) =>{
  switch(actionType){
  case Action.LIKE: 
    return <LikedIConComp style={{ background: "white", borderRadius: "50%" }} />;
  case Action.DISLIKE:
    return <DislikeComponent style={{ background: "white", borderRadius: "50%" }}/>;
  case Action.REPLIED:
  case Action.COMMENT:
    return <RepliedIconComp style={{ background: "white", borderRadius: "50%" }}/>;
  case Action.CIRCULATED:
    return <ReTweetIcon style={{ background: "white", borderRadius: "50%", color: "#F1795D" }}/>;
  case Action.MENTIONED:
    return <AlternateEmailIcon style={{ background: "white", borderRadius: "50%", color: "#009AD3" }}/>;
  case Action.QUOTED:
    return <FormatQuoteIcon style={{ background: "white", borderRadius: "50%", color:"#6D50B6" }}/>;
  default:
    return <></>;
  }
};

export default ActionTypeIcon;