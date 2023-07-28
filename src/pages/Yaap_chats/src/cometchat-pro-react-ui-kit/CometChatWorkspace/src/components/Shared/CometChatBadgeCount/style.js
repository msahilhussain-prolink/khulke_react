export const badgeStyle = (props) => {

    return {
      display: "block",
      fontSize:"18px",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: `${props.theme.color.customOrange}`,
      color: `${props.theme.color.white}`,
      textAlign: "center",
      lineHeight: "24px",
      marginLeft: "4px",
      padding: "0",
      marginRight: "-12px",
      opacity: "1",
      transition: "opacity .1s",
    };
}