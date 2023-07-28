import { MOBILE_VIEW } from "../../../../../constants/env";

export const ThumbnailIcon = (actionPic) => ({
    thumbnailPic: {
      backgroundImage: `url("${actionPic}")`,
      backgroundPosition:"center",
      backgroundSize:"cover",
      backgroundRepeat:"no-repeat",
      borderRadius: MOBILE_VIEW ?"0.2rem":"0.75rem",
      height: MOBILE_VIEW ?"3.5rem":"5rem",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    icon: { display: "flex", flexDirection: "column", justifyContent: "center", color: "white" },
    audioIcon:{color:"black", background: "white", padding: "1px", borderRadius: "50%"},
    thumbUpperPic: { display: "flex", flexDirection: "column", justifyContent: "flex-start" }
})