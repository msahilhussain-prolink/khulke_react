import styled from "styled-components";

export const CommentsIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 0.4rem;
  // margin-top: -1rem;
`;
export const UpBtn = styled.button`
  background-color: aliceblue;
  border-radius: 50px !important;
  border: aliceblue;
  padding: 0.3rem;
  text-transform: capitalize !important;
  color: ${(props) => props.theme.color.primary} !important;
  font-size: 0.813rem;
  font-weight: 600;
  margin-left: auto;
  width: 6rem;
`;

export const LiveBtn = styled.button`
  background-color: #f5cece;
  border-radius: 50px !important;
  border: aliceblue;
  padding: 0.3rem;
  text-transform: capitalize !important;
  color: #d53512 !important;
  font-size: 0.813rem;
  font-weight: 600;
  margin-left: auto;
  width: 6rem;
`;

export const PastBtn = styled.button`
  background-color: #f0f6ff;
  border-radius: 50px !important;
  border: aliceblue;
  padding: 0.3rem;
  text-transform: capitalize !important;
  color: #63779c !important;
  font-size: 0.813rem;
  font-weight: 600;
  margin-left: auto;
  width: 6rem;
`;

export const MainDiv = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;

  @media screen and (min-width: 1400px) {
    justify-content: left;
  }
`;

export const LeftDiv = styled.div`
  /* padding-left: 1rem; */
  @media screen and (max-width: 960px) {
    display: none;
  }
`;
export const CenterDiv = styled.div`
  flex: 1;
  margin-left: 1.875rem;
  margin-right: 10px;
  margin-top: 1rem;
  // overflow-y: clip;
  // min-width: 624px;
  // max-width: 624px;
  scroll-behavior: smooth;
  padding-right: 30px;
  // -ms-overflow-style: none; /* IE and Edge */
  // scrollbar-width: none; /* Firefox */
  overflow: ${(props) => (props.label == "rt_noti" ? "" : "auto !important")};

  ::-webkit-scrollbar {
    width: 5px;
    padding-left: 5px;
    color: #141414;
  }

  @media screen and (max-width: 960px) {
    min-width: 100%;
    max-width: 100%;
    margin-left: 1rem;
    margin-right: 0rem;
    padding-right: 30px;
  }

  @media only screen and (min-width: 1200px) {
    min-width: 600px;
    max-width: 600px;
  }

  @media only screen and (min-width: 1400px) {
    max-width: 100%;
    padding-right: 30px;
  }

  @media only screen and (min-width: 1200px) {
    min-width: 600px;
    max-width: 600px;
  }

  @media only screen and (min-width: 1400px) {
    /* min-width: 650px; */
    max-width: 100%;
  }

  @media only screen and (min-width: 1700px) {
    min-width: 768px;
    max-width: 768px;
  }

  @media only screen and (min-width: 1200px) {
    min-width: 600px;
    max-width: 600px;
  }

  @media only screen and (min-width: 1400px) {
    /* min-width: 650px; */
    max-width: 100%;
  }

  @media only screen and (min-width: 1700px) {
    min-width: 768px;
    max-width: 768px;
  }
`;

export const RightDiv = styled.div`
  margin-top: 1rem;
  /* min-width: 260px; */
  /* max-width: 320px; */
  max-width: 350px;
  width: 100%;

  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

export const Title = styled.p`
  font-weight: bold;
  font-size: 1.875rem;
`;

export const SearchContainer = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  border: 1px solid #e4e9f0;
  padding: 0.8rem;
  border-radius: 10px;
  background-color: transparent;
  margin-top: 1rem;
`;
export const CustomSearchInput = styled.input`
  width: 100%;
  height: 45px;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0.8rem;
  font-weight: medium;
  background-color: transparent;
`;

export const Wrapper = styled.div`
  // border: 1px solid grey;
  background-color: white;
  box-shadow: 0px 20px 40px rgba(255, 255, 255, 0.25),
    0px 1px 5px rgba(0, 0, 0, 0.1), inset 0 0 0 0.5px rgba(255, 255, 255, 0.4);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  padding: 20px 20px;
  position: absolute;
  z-index: 999999;
  // margin-left: 0.3rem;
  width: 90%;
  height: 33%;
  margin-top: -1rem;
`;
