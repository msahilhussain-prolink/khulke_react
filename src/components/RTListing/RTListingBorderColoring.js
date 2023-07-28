const RTListingBorderColoring = (type) => {
  switch (type) {
    case "OWNER":
      return {
        borderLeft: "1px #C69320 solid",
        borderRight: "1px #FCC201 solid",
        borderBottom: "1px #FCC201 solid",
        borderTop: "1px #C69320 solid",
        borderRadius: "19px",
        opacity: 1,
      };
    case "MODERATOR":
      return {
        borderLeft: "1px #7AB788 solid",
        borderRight: "1px #009BFF solid",
        borderBottom: "1px #009BFF solid",
        borderTop: "1px #7AB788 solid",
        borderRadius: "19px",
        opacity: 1,
      };
    case "SPEAKER":
      return {
        borderLeft: "1px #FFC200 solid",
        borderRight: "1px #F15B29 solid",
        borderBottom: "1px #F15B29 solid",
        borderTop: "1px #FFC200 solid",
        borderRadius: "19px",
        opacity: 1,
      };
    case "AUDIENCE":
      return {
        borderLeft: "1px #000000 solid",
        borderRight: "1px #63779C solid",
        borderBottom: "1px #63779C solid",
        borderTop: "1px #000000 solid",
        borderRadius: "19px",
        opacity: 1,
      };
    default:
      return { border: "1px solid #E4E9F0" };
  }
};

export default RTListingBorderColoring;
