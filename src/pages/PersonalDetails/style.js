import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import MobileDatePicker from '@mui/lab/MobileDatePicker';

export const TxtField = styled(TextField)`
    margin-top: 15rem
`;

export const MainDiv = styled.div`
  width: 96vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  overflow: hidden;

  @media screen and (min-width: 1400px) {
    justify-content: center;
  }
  @media screen and (min-width: 1600px) {
    justify-content: center;
  }
  @media screen and (min-width: 1980px) {
    justify-content: center;
  }
`;

export const LeftDiv = styled.div`
  @media screen and (max-width: 960px) {
    display: none;
  }
`;
export const CenterDiv = styled.div`
  flex: 1;
  margin-left: 3rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const RightDiv = styled.div`
  margin-top: 1rem;
  min-width: 260px;
  max-width: 320px;

  @media screen and (max-width: 968px) {
    display: none;
  }
`;

export const DatePicker = styled(MobileDatePicker)`
  width: 100%;
  border: 1px solid #d3d6db;
  padding: 0.7rem 0.6rem;
`;

export const MyContentCard = styled.div`
  width: 100%;
  height: 290px;
  padding: 0.1rem;
  overflow: hidden;

  .event_container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    ::-webkit-scrollbar {
      width: 0.3em;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 15px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 15px;
      background-color: darkgrey;
      outline: 1px solid lightgray;
    }
  }
`;
