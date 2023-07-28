import {  applyMiddleware, createStore } from "redux";
import rootReducer from "./reducers/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import Thunk from "redux-thunk";
import initialState from "./reducers/initialState";


const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(Thunk))
);
export default store;
