import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PrivateRouteComponent = (props) => {
  const currentUser = localStorage.getItem("current_user");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate("/roundtable/all");
  }, []);
  // if (!currentUser)
  //   return (
  //     <Route path={path} element={<Navigate replace to="/roundtable/all" />} />
  //   );

  // if (localStorage.getItem("anonymous_user"))
  //   return (
  //     <Route path={path} element={<Navigate replace to="/roundtable/all" />} />
  //   );

  return <> {props.children} </>;
};
