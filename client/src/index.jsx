import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';

export const PROJECT_URL = "https://github.com/ikhsanddy/pixies";
export const RELEASES_URL = PROJECT_URL + "/releases/latest";
export const DOCS_URL = PROJECT_URL + "/blob/master/docs/en";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
