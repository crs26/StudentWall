import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"
import store from './app/store'
import { Provider } from 'react-redux'
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
