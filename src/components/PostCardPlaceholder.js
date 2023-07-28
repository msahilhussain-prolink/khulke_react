import React from "react";
import {
  RoundShape,
  TextBlock,
  RectShape,
} from "react-placeholder/lib/placeholders";

import styled from "styled-components";

const Container = styled.div``;
const PostContainer = styled.div`
  margin-top: 1rem;
  border: 1px solid lightgray;
  padding: 1rem;
`;

const PostCardHeader = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header_user__container {
    display: flex;
  }
  .hader_username_container {
    display: flex;
  }
`;

const PostCardBody = styled.div`
  margin-bottom: 60px;
`;

const PostCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PostCardPlaceholder = () => {
  const cards = [1, 2, 3, 4];
  return (
    <Container className="show-loading-animation">
      {cards.map((value) => (
        <PostContainer key={value}>
          <PostCardHeader>
            <RectShape
              color="#c5c5c5"
              style={{ width: 50, height: 50, borderRadius: 5 }}
            />
            <RoundShape
              color="#c5c5c5"
              style={{ width: 35, height: 35, marginRight: "0.5rem" }}
            />
          </PostCardHeader>

          <PostCardBody>
            <TextBlock rows={6} color="#c5c5c5" />
          </PostCardBody>

          <PostCardFooter>
            <div style={{ display: "flex" }}>
              <RoundShape
                color="#c5c5c5"
                style={{ width: 35, height: 35, marginRight: "0.5rem" }}
              />
              <RoundShape
                color="#c5c5c5"
                style={{
                  width: 35,
                  height: 35,
                  marginRight: "0.5rem",
                }}
              />
              <RoundShape
                color="#c5c5c5"
                style={{ width: 35, height: 35, marginRight: "0.5rem" }}
              />
              <RoundShape color="#c5c5c5" style={{ width: 35, height: 35 }} />
            </div>
            <RoundShape color="#c5c5c5" style={{ width: 35, height: 35 }} />
          </PostCardFooter>
        </PostContainer>
      ))}
    </Container>
  );
};

export default PostCardPlaceholder;
