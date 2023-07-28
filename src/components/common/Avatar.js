import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";

const AvatarContainer = styled(Avatar)`

  border-radius: 0.5rem !important;
  margin-right: 0.5rem !important;
`;

const UserAvatar = ({ ...props }) => {
  return <AvatarContainer {...props} />;
};

export default UserAvatar;
