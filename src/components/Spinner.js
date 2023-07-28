import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const Spinner = () => {
  return (
    <Container>
      <CircularProgress style={{ color: "#66B984", width: 40, height: 40 }} />
    </Container>
  );
};

export default Spinner;
