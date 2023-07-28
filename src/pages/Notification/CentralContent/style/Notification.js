import { MOBILE_VIEW } from "../../../../constants/env";
import UserDefault from "../../../../assets/images/default_user.png";

export const Notification = (actionPic, isRead = false) => ({
  mainContainer: {
    padding: "0.5rem",
    background: isRead ? "white" : "#FFEEE6 0% 0% no-repeat padding-box",
    opacity: 1,
  },
  profilePic: {
    backgroundImage: `url("${actionPic ? actionPic : UserDefault}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    borderRadius: "50%",
    height: MOBILE_VIEW ? "2.5rem" : "3.5rem",
    width: MOBILE_VIEW ? "2.5rem" : "3.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  cabProfilePic: {
    container: {
      position: "relative",
      borderRadius: "50%",
    },
    img1: {
      position: "absolute",
      zIndex: 1,
      width: MOBILE_VIEW ? "35px" : "50px",
      top: 0,
      left: 0,
      borderRadius: "50%",
    },
    img2: {
      position: "absolute",
      zIndex: 2,
      width: MOBILE_VIEW ? "35px" : "50px",
      top: MOBILE_VIEW ? "8px" : "15px",
      left: MOBILE_VIEW ? "8px" : "15px",
      borderRadius: "50%",
    },
    img3: {
      position: "absolute",
      zIndex: 3,
      width: MOBILE_VIEW ? "2px" : "35px",
      top: MOBILE_VIEW ? "16px" : "40px",
      left: MOBILE_VIEW ? "16px" : "40px",
      borderRadius: "50%",
    },
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  isReadGrid: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "max-content",
  },
  isRead: {
    width: MOBILE_VIEW ? "2px" : "8px",
    height: MOBILE_VIEW ? "2px" : "8px",
    backgroundColor: "#FFBC00",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  actionIcon: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  postText: {
    background: "white",
    width: "90%",
    padding: MOBILE_VIEW ? "0.2rem" : "0.4rem",
    borderRadius: "10px",
    font: MOBILE_VIEW
      ? "normal normal normal 10px/14px Work Sans"
      : "normal normal normal 14px/22px Work Sans",
    border: "1px solid #E4E9F0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: "1rem",
    maxHeight: "2.5rem",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto",
    // whiteSpace: "nowrap"
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  boldFont: MOBILE_VIEW
    ? { font: "normal normal 900 12px/14px Work Sans bold" }
    : { font: "normal normal 900 16px/19px Work Sans bold" },
  normalFont: MOBILE_VIEW
    ? { font: "normal normal normal 12px/14px Work Sans" }
    : { font: "normal normal normal 16px/19px Work Sans" },
  smallFont: MOBILE_VIEW
    ? { font: "normal normal normal 10px/14px Work Sans" }
    : { font: "normal normal normal 12px/14px Work Sans" },
  dateGrid: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#6A779B",
  },
  threeDot: MOBILE_VIEW ? { height: 15, width: 15 } : { height: 25, width: 25 },
  quoteNComment: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: "1rem",
    maxHeight: "2.5rem",
    hyphens: "auto",
    margin: "4px 0",
    whiteSpace: "nowrap",
  },
});
