import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'semantic-ui-offline/semantic.min.css';
import './index.css';
import { UserProvider } from './context/User';

import 'react-toastify/dist/ReactToastify.css';
import { StatusProvider } from './context/Status';
import { ConfigProvider } from './context/Config';
import { ThemeProvider } from './context/Theme';
import { StyleProvider } from './context/Style/index.js';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
import './i18n/i18n.js';

// initialization

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ConfigProvider>
      <StatusProvider>
        <UserProvider>
          <ThemeProvider>
            <StyleProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </StyleProvider>
          </ThemeProvider>
        </UserProvider>
      </StatusProvider>
    </ConfigProvider>
  </React.StrictMode>
);
