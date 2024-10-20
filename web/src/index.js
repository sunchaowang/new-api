import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import HeaderBar from './components/HeaderBar';
import 'semantic-ui-offline/semantic.min.css';
import "./index.css";
import { UserProvider } from './context/User';

import 'react-toastify/dist/ReactToastify.css';
import { StatusProvider } from './context/Status';
import { Layout } from '@douyinfe/semi-ui';
import { ThemeProvider } from './context/Theme';
import FooterBar from './components/Footer';

// initialization

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <StatusProvider>
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </StatusProvider>
  </React.StrictMode>,
);
