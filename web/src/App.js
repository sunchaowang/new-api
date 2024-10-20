import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { getLogo, getSystemName } from './helpers';
import { UserContext } from './context/User';
import { ThemeProvider } from './context/Theme';
import { Layout } from '@douyinfe/semi-ui';
import { ToastContainer } from 'react-toastify';
import HeaderBar from './components/HeaderBar';
import FooterBar from './components/Footer';

import Routes from './routes';

function App() {
  const { Sider, Content, Header, Footer } = Layout;

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
