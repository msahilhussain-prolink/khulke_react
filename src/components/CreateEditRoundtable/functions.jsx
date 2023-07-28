export const keyPressHandler = (e, num) => {
  if (
    e.target.value.split(" ").length >= num &&
    (e.key === " " || e.key === "Enter")
  ) {
    e.preventDefault();
  }
};

export const clickHandler = () => {
  const tp = document.getElementById("thumbnail-parent-id");
  tp.click();
};
