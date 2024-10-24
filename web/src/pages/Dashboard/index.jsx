import React, { useEffect, useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { Layout, Card, SideSheet } from '@douyinfe/semi-ui';
import SiderBar from '../../components/SiderBar';
import { useIsMobile } from '../../helpers/hooks';
import { ConfigContext } from '../../context/Config';
export default function Dashboard(children) {
  const [configState, configDispatch] = useContext(ConfigContext);
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (isMobile) {
      console.log('isMobile', isMobile);
      setShowSidebar(true);
    }
  }, [isMobile]);

  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  return (
    <>
      <Layout style={{ height: '100%', width: '100%' }}>
        {!isMobile ? (
          <Layout.Sider>
            <SiderBar />
          </Layout.Sider>
        ) : (

          <></>
        )}
        <Layout.Content style={{ padding: 16, height: '100%', overflow: 'hidden' }}>
          <div style={{ height: '100%', overflow: 'auto' }}>
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </>
  );
}
