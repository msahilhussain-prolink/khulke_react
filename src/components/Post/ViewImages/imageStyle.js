import { MOBILE_VIEW } from "../../../constants/env"

export const imageStyle = (imgIndex, length) => {
    return {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    iconPreview: { marginRight: "1rem", color: imgIndex === 0 ? "black" : "white" },
    image: {
        width: "100%",
        height: "auto",
        borderRadius: 8,
        height: "80vh",
        width: MOBILE_VIEW ? "40vh" : "70vh",
        objectFit: "contain",
    },
    iconNext: { marginLeft: "1rem", color: imgIndex === (length - 1) ? "black" : "white" },
    caption: {
        padding: 8,
        marginTop: "-50px",
        color: "white",
        fontSize: 18,
      }
}
}