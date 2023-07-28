import React from "react";
import vip_tier1 from "../assets/icons/vip_tier1.svg";
import vip_tier2 from "../assets/icons/vip_tier2.svg";
import vip_tier3 from "../assets/icons/vip_tier3.svg";
import vip_tier4 from "../assets/icons/vip_tier4.svg";
import vip_tier5 from "../assets/icons/vip_tier5.svg";
import vip_tier6 from "../assets/icons/vip_tier6.svg";

export default function VIPComp({ user_type, overrideVipStyle }) {
  const userType = user_type?.toLowerCase();

  const defStylee = overrideVipStyle
    ? {
        width: 18,
        height: 18,
        marginLeft: "4px",
        marginBottom: "4px",
        ...overrideVipStyle,
      }
    : {
        width: 18,
        height: 18,
        marginLeft: "4px",
        marginBottom: "4px",
      };
  return (
    <span>
      {userType == "respected" && (
        <img src={vip_tier1} alt="" style={defStylee} />
      )}
      {userType == "vip" && <img src={vip_tier2} alt="" style={defStylee} />}
      {userType == "celebrity" && (
        <img src={vip_tier3} alt="" style={defStylee} />
      )}
      {userType == "top" && <img src={vip_tier4} alt="" style={defStylee} />}
      {userType == "normal" && <img src={vip_tier5} alt="" style={defStylee} />}
      {userType == "company" && (
        <img src={vip_tier6} alt="" style={defStylee} />
      )}
      {/* {userType == "default" && (
        <img src={vip_tier6} alt="" style={defStylee} />
      )} */}
    </span>
  );
}
``;
