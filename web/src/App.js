import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { getLogo, getSystemName } from './helpers';
import { UserContext } from './context/User';
import { ThemeProvider } from './context/Theme';
import { Layout, SideSheet } from '@douyinfe/semi-ui';
import { ToastContainer } from 'react-toastify';
import HeaderBar from './components/HeaderBar';
import FooterBar from './components/Footer';

import Routes from './routes';
import { ConfigContext } from './context/Config/index.js';
import SiderBar from './components/SiderBar.js';
import { useIsMobile } from './helpers/hooks.js';

function App() {
  const { Sider, Content, Header, Footer } = Layout;

  const [configState, configDispatch] = useContext(ConfigContext);
  const [userState, userDispatch] = useContext(UserContext);
  // const [statusState, statusDispatch] = useContext(StatusContext);

  const loadUser = () => {
    let user = localStorage.getItem('user');
    if (user) {
      let data = JSON.parse(user);
      userDispatch({ type: 'login', payload: data });
    }
  };

  useEffect(() => {
    loadUser();
    let systemName = getSystemName();
    if (systemName) {
      document.title = systemName;
    }
    let logo = getLogo();
    if (logo) {
      let linkElement = document.querySelector("link[rel~='icon']");
      if (linkElement) {
        linkElement.href = logo;
      }
    }
  }, []);

  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (isMobile) {
      console.log('isMobile', isMobile);
      setShowSidebar(true);
    }
  }, [isMobile]);

  return (
    <>
      <ThemeProvider>
        <Layout
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Header>
            <HeaderBar />
          </Header>
          <Layout style={{ flex: 1, overflow: 'hidden' }}>
            {!isMobile ? (
              <></>
            ) : (
              // <Layout.Sider>
              //   <SiderBar />
              // </Layout.Sider>
              <SideSheet
                visible={configState.config.isCollapse}
                onCancel={() => configDispatch({ type: 'set', payload: { isCollapse: false } })}
                placement="left"
                width={240}
                bodyStyle={{ padding: 0 }}
              >
                <SiderBar />
              </SideSheet>
            )}
            <Layout style={{ height: '100%', overflow: 'auto' }}>
              <Content style={{ overflowY: 'auto' }}>
                <Routes></Routes>
              </Content>
              <Layout.Footer>
                <FooterBar></FooterBar>
              </Layout.Footer>
            </Layout>
          </Layout>
          <ToastContainer />
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default App;
