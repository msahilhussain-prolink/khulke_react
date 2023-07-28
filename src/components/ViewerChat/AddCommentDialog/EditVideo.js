import React, { useEffect } from "react";
import styled from "styled-components";
import { allWords } from "../../../App"
const Container = styled.div`
  width: 100%;
  .controls {
    width: 100%;
    display: flex;
    margin-top: 1rem;

    .start_time {
      margin-right: 1rem;
    }
    .end_time {
      margin-right: 1rem;
    }
  }
`;
const VideoContainer = styled.video`
  width: 100%;
  border-radius: 5px;
`;
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`;

const Button = styled.button`
  width: 200px;
  height: 50px;
  outline: none;
  border-radius: 5px;
  color: ${(props) => (props.primary ? props.theme.color.primary : "white")};
  background-color: ${(props) =>
    props.bgColor ? props.theme.color.secondary : "white"};
  border: 2px solid
    ${(props) =>
    props.primary ? props.theme.color.primary : props.theme.color.secondary};
`;

const EditVideo = ({ setEditVideo, setDialogTitle }) => {
  useEffect(() => {
    setDialogTitle("Trim Video");
  }, []);

  return (
    <Container>
      <VideoContainer
        controls
        src={"https://gutrgoo.com/post-media/media/61518880048463292473669a"}
      />
      <div className="controls">
        <div className="start_time">
          <p>{allWords.misc.review.Starttm}</p>
          <div style={{ display: "flex" }}>
            <input
              type="number"
              placeholder="00"
              style={{ width: 40, border: "none", outline: "none" }}
              maxLength={2}
            />
            <span style={{ fontSize: 25 }}>:</span>
            <input
              type="number"
              placeholder="00"
              style={{ width: 40, border: "none", outline: "none" }}
              maxLength={2}
            />
          </div>
        </div>
        <div className="end_time">
          <p>End time</p>
          <div style={{ display: "flex" }}>
            <input
              type="number"
              placeholder="00"
              style={{ width: 40, border: "none", outline: "none" }}
              max={2}
            />
            <span style={{ fontSize: 25 }}>:</span>
            <input
              type="number"
              placeholder="00"
              style={{ width: 40, border: "none", outline: "none" }}
            />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <range />
        </div>
      </div>
      <Footer>
        <Button primary onClick={() => setEditVideo(false)}>
        {allWords.misc.cancel}
        </Button>
        <Button bgColor onClick={() => { }}>
        {allWords.misc.save}
        </Button>
      </Footer>
    </Container>
  );
};

export default EditVideo;
