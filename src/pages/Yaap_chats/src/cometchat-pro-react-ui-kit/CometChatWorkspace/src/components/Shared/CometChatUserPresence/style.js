export const presenceStyle = (props) => {
  let presenceStatus = {
    backgroundColor: "#C4C4C4",
  };

  if (props.status === "online" || props.status === "available") {
    presenceStatus = {
      backgroundColor: "#3BDF2F",
    };
  }

  return {
    width: "14px",
    height: "14px",
    top: "-14px",
    float: "right",
    position: "relative",
    ...presenceStatus,
    border: "5px solid white",
  };
};
