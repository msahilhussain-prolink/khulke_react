import styled from "styled-components";

export const MyContentCard = styled.div`
  width: 100%;
  height: 290px;
  padding: 0.1rem;
  overflow: hidden;

  .event_container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
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
