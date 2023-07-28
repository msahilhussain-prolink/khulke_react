import styled from "styled-components";

export const HrLine = styled.hr`
  bordertop: #e4e9f0;
  margintop: ${(props) => (props.label3 === "record" ? "1rem" : 0)};

  @media only screen and (max-width: 768px) {
    width: 23rem;
  }
`;

export const participantMenu = {
  width: 40,
  height: 40,
  marginTop: "-10px",
};

export const participateAvatar = { width: 30, height: 30 };
