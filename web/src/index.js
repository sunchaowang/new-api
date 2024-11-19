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
import { ConfigProvider } from './context/Config';
import { Layout } from '@douyinfe/semi-ui';
import { ThemeProvider } from './context/Theme';
import FooterBar from './components/Footer';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

// initialization

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ConfigProvider>
      <StatusProvider>
        <UserProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </UserProvider>
      </StatusProvider>
    </ConfigProvider>
  </React.StrictMode>
);
