import styled from "styled-components";

export const LeftSideBarDiv = styled.div`
  width: 100%;
  height: 100vh;
  border-right: 1px solid ${(props) => props.theme.color.lightGray};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media screen and (min-width: 1980px) {
    justify-content: flex-start;
  }
`;

export const Div = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Cross = styled.img`
  height: 40px;
  width: 30px;
  margin-top: 10px;

  @media only screen and (min-width: 769px) {
    display: none;
    visibility: hidden;
  }
`;
