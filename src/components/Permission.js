const Permission = () => {
  if (!localStorage.current_user) {
    localStorage.clear();
    window.location.replace("/");
  }
};

export default Permission;
