import React from 'react';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import "./index.css"

import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
