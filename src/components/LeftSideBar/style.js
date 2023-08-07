import styled from "styled-components";

export const LeftSideBarDiv = styled.div`
  // width: 20%;
  height: 100vh;
  max-width: auto;
  /* padding: 1rem; */
  /* max-width: 500px; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 1rem;
  padding-right:0.5rem;
  border-right: 1px solid #e4e9f0;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 3px;
  }

  @media (min-width: 968px) and (max-width: 1268px) {
    padding-left: 0.5rem;
    margin-left: 0rem;
  }

  @media screen and (min-width: 1980px) {
    justify-content: flex-start;
  }

  .myIcon {
    :hover {
      color: red;
      cursor: pointer;
    }
  }
`;

export const Div = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 481px) and (max-width: 820px) {
    align-items: flex-end;
  }
  @media (min-width: 768px) and (max-width: 968px) {
    align-items: flex-end;
  }
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
