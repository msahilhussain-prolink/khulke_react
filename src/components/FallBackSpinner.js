import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FallBackSpinner = () => {
  return (
    <Container>
      <CircularProgress style={{ color: "#66B984", width: 60, height: 60 }} />
    </Container>
  );
};

export default FallBackSpinner;
