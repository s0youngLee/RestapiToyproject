import ReactDOM from 'react-dom/client';
import React, { useEffect } from "react";
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import Bar from './Bar';
import { pageviewCount } from './func';

function Root() {
  const location = window.location.pathname;
  useEffect(() => {
    pageviewCount(location, "카테고리별 조회");
  }, [location]);
  
  return (
      <App />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Root />
);

ReactDOM.createRoot(document.getElementById('header')).render(
  <Bar />
);

reportWebVitals();