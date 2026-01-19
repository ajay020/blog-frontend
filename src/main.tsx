import React from 'react';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import "./index.css"

import ReactDOM from "react-dom/client";
import App2 from './App2';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App2 />
    </Provider>
  </React.StrictMode>
);
