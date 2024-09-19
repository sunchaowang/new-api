import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import MyApp from './App';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import 'semantic-ui-offline/semantic.min.css';
import './index.css';
import { UserProvider, UserContext } from './context/User';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StatusProvider } from './context/Status';
import { AppContext, AppProvider, AppActions } from './context/App';
import { Layout, ConfigProvider, Card } from '@douyinfe/semi-ui';
import SiderBar from './components/SiderBar';
import zhCN from 'antd/lib/locale/zh_CN';
import { API, isMobile, showError } from './helpers';
import Provider from './prodiver';

// initialization

const index = ReactDOM.createRoot(document.getElementById('root'));
const { Sider, Content, Header } = Layout;

export function Index() {
  const [appState, appDispatch] = useContext(AppContext);
  const [userState, userDispatch] = useContext(UserContext);
  // 加载分组信息
  const fetchGroups = async () => {
    try {
      let res = await API.get(`/api/group/`);
      if (res === undefined) {
        return;
      }
      appDispatch({
        type: AppActions.SET_GROUPS,
        payload: res.data.data.map((group) => ({
          label: group,
          value: group,
        })),
      });
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    // if (userState.user && !appState.app.groups) {
    //   fetchGroups().finally(() => {
    //     console.log('fetch groups');
    //   });
    // }
  }, []);

  return (
    <>
      <ConfigProvider locale={zhCN}>
        <Provider>
          <Layout style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Header
              style={{
                width: '100%',
                height: '64px',
                padding: 0,
              }}
            >
              <HeaderBar></HeaderBar>
            </Header>
            <Layout>
              <Sider style={{ width: 220, height: '100%' }}>
                <SiderBar></SiderBar>
              </Sider>

              <Content
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <Card
                  bordered={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'scroll',
                    boxShadow: 'none',
                  }}
                >
                  <MyApp />
                </Card>
              </Content>
            </Layout>
            {/* <Layout.Footer
              style={{
                width: '100%',
                height: '64px',
                flex: 1,
              }}
            >
              <Footer></Footer>
            </Layout.Footer> */}
          </Layout>
        </Provider>
      </ConfigProvider>
      <ToastContainer />
    </>
  );
}

index.render(
  <React.StrictMode>
    <AppProvider>
      <StatusProvider>
        <UserProvider>
          <BrowserRouter>
            <Index></Index>
          </BrowserRouter>
        </UserProvider>
      </StatusProvider>
    </AppProvider>
  </React.StrictMode>,
);
