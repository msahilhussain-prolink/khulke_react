import styled from "styled-components";

export const CardContainer = styled.div`
  width: auto;
  height: 30vh;
  border-radius: 10px;
  border: 1px solid #e4e9f0;
  padding: 12px 0px 12px 12px;
  margin-top: 1rem;
  overflow: hidden;

  .user_suggestion_container {
    width: 100%;
    height: 92%;
    padding: 0.5rem;
    overflow-y: scroll;
    margin-left: auto;
    margin-right: auto;

    ::-webkit-scrollbar {
      width: 0.3em;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    ::-webkit-scrollbar-thumb {
      background-color: darkgrey;
      outline: 1px solid lightgray;
    }
  }

  .follow-suggestion-button {
    @media screen and (min-width: 320px) and (max-width: 968px) {
      margin-top: 1rem;
    } 
  }
`;
export const SuggestionTitle = styled.h6`
  font-weight: 600;
  color: ${(props) => props.theme.color.bigStone};
`;
