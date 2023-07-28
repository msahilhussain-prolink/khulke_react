import React, { Suspense } from "react";
import { render } from "react-dom";
import App from "./App";
import FallBackSpinner from "./components/FallBackSpinner";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import "./global_styles/khulke-global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClearIcon from "@mui/icons-material/Clear";

// ** Redux
import { Provider } from "react-redux";
import store from "./redux/store";

const rootElement = document.getElementById("root");

const CloseButton = ({ closeToast }) => (
  <ClearIcon onClick={closeToast} style={{ alignSelf: "center" }} />
);

render(
  <Provider store={store}>
    <Suspense fallback={<FallBackSpinner />}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
        <ToastContainer
          hideProgressBar
          newestOnTop={true}
          autoClose={3000}
          closeButton={CloseButton}
          style={{
            width: "fit-content",
            alignItems: "center",
          }}
        />
      </BrowserRouter>
    </Suspense>
  </Provider>,
  rootElement
);
