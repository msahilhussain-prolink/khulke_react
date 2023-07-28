import styled from "styled-components";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";

export const Title = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 1.1rem;
  margin-left: 0.5rem;
  margin-top: 0.5rem @media only screen and (max-width: 768px) {
    display: none;
    visibility: hidden;
  }
`;

export const ProfileImg = styled.img`
  width: 5.5rem;
  height: 5.5rem;
  // margin-top: -1.2rem
  // margin-left: -1.3rem;
`;

export const ProfileDiv = styled.div`
  width: 90%;
  position: relative;
  background-color: #fff1c4;
  border-radius: 0.938rem;
  margin: 0 auto;
  margin-top: -1.2rem;
`;

export const ProfileBadge = styled.img`
  padding-left: 0.2rem;
  margin-left: 10px;
  width: 1.3rem;
`;
export const ProfileTag = styled.p`
  padding: 0.2rem;
  font-weight: 700;
  font-size: 0.75rem;
  margin-right: -1.4rem;
  margin-top: -1.4rem;
  text-align: -webkit-center;
  display: contents;
`;

export const ProfileTitle = styled.p`
  margin-top: 0.7rem;
  font-weight: bold;
`;

export const ProfileSubTitle = styled.p`
  font-size: 0.938rem;
  color: #656565;
  margin-top: -0.9rem;
`;

export const LocationTag = styled.p`
  color: #63779c;
  font-size: 0.75rem;
  margin-left: 7rem;
  // margin-top: -2.7rem;
`;

export const EditBtn = styled.button`
  border-radius: 50px;
  font-size: 0.7rem;
  background: transparent linear-gradient(100deg, #66b984 0%, #04b10a 100%) 0%
    0% no-repeat padding-box;
  padding: 0.6rem 1.8rem;
  height: fit-content;
  color: white;
  border: transparent;
  font-size: 0.8rem;
  transition: all 300ms;
  &:hover {
    color: green;
    border: 1px solid green;
    background: white;
  }
`;

export const FollowBtn = styled.button`
  background-color: #66b984;
  border-radius: 50px !important;
  font-size: 0.7rem;
  color: white;
  padding: 0.5rem 0.8rem;
`;

export const AccountSetting = styled.button`
  background-color: #66b984;
  border-radius: 50px !important;
  border: aliceblue;
  text-transform: capitalize !important;
  color: white !important;
  font-size: 0.7rem;
  font-weight: 600;
  // margin-left: 20rem;
  width: max-content;
  height: 2rem;
  margin-top: 1.2rem;
  min-width: 5rem;
  padding: 0.5rem 1rem;
`;

export const FollowerDiv = styled.div`
  background-color: #ecf8f0;
  border-radius: 10px;
  width: 9rem;
  height: 4rem;
  padding: 0.8rem 0.8rem 4rem 0.8rem;
  @media only screen and (max-width: 500px) {
    width: 5rem;
  }
`;
export const FollowerTag = styled(Link)`
  color: #66b984;
  font-size: 0.75rem;
  text-decoration: none;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;
export const FollowerCount = styled.p`
  line-height: 1;
  font-size: 1.4rem;
  font-weight: bolder;
  font-family: "Work Sans";
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 0.5rem;
`;

export const MenuContainer = styled(IconButton)`
  width: 40px !important;
  height: 40px !important;
  border-radius: 50px !important;
`;

export const Menu = styled(Avatar)`
  width: 30px !important;
  height: 30px !important;
`;
