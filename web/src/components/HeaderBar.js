import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/User";
import { StatusContext } from "../context/Status";
import { ConfigContext } from '../context/Config';
import { useSetTheme, useTheme } from "../context/Theme";

import { API, getLogo, getSystemName, showSuccess, isAdmin, showError } from '../helpers';
import '../index.css';

import fireworks from 'react-fireworks';

import { IconHelpCircle, IconKey, IconMenu, IconUser } from '@douyinfe/semi-icons';
import { IconIntro, IconLayout, IconTag } from '@douyinfe/semi-icons-lab';

import { Avatar, Dropdown, Layout, Nav, Switch, Modal, Button } from '@douyinfe/semi-ui';
import { stringToColor } from '../helpers/render';
import { setStatusData } from '../helpers/data.js';
import CheckInModal from './CheckInModal.js';
import { useIsMobile } from '../helpers/hooks.js';

// HeaderBar Buttons
let headerButtons = [
  {
    text: '关于',
    itemKey: 'about',
    to: '/about',
    icon: <IconHelpCircle />,
  },
];

if (localStorage.getItem('chat_link')) {
  headerButtons.splice(1, 0, {
    name: '聊天',
    to: '/chat',
    icon: 'comments',
  });
}

const HeaderBar = () => {
  const [statusState, statusDispatch] = useContext(StatusContext);
  const [configState, configDispatch] = useContext(ConfigContext);
  const [checkinModalVisible, setCheckinModalVisible] = useState(false);
  const isMobile = useIsMobile();
  const [isLoginExpired, setIsLoginExpired] = useState(false);

  const loadStatus = async () => {
    const res = await API.get('/api/status');
    if (res === undefined) {
      return;
    }
    const { success, data } = res.data;
    if (success) {
      statusDispatch({ type: 'set', payload: data });
      setStatusData(data);
    } else {
      showError('无法正常连接至服务器！');
    }
  };

  let buttons = useMemo(
    () => [
      {
        text: '首页',
        itemKey: 'home',
        to: '/',
        icon: isMobile ? null : <IconIntro />,
      },
      {
        text: '工作台',
        itemKey: 'dashboard',
        to: '/dashboard/home',
        icon: isMobile ? null : <IconLayout />,
      },
      {
        text: '模型价格',
        itemKey: 'pricing',
        to: '/pricing',
        icon: isMobile ? null : <IconTag />,
      },
    ],
    [
      localStorage.getItem('enable_data_export'),
      localStorage.getItem('enable_drawing'),
      localStorage.getItem('enable_task'),
      localStorage.getItem('chat_link'),
      isAdmin(),
      isMobile,
    ],
  );

  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const systemName = getSystemName();
  const logo = getLogo();
  const currentDate = new Date();
  // enable fireworks on new year(1.1 and 2.9-2.24)
  const isNewYear =
    (currentDate.getMonth() === 0 && currentDate.getDate() === 1) ||
    (currentDate.getMonth() === 1 && currentDate.getDate() >= 9 && currentDate.getDate() <= 24);

  async function logout() {
    setShowSidebar(false);
    await API.get('/api/user/logout');
    showSuccess('注销成功!');
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  }

  async function checkin() {
    setCheckinModalVisible(true);
  }

  const handleNewYearClick = () => {
    fireworks.init('root', {});
    fireworks.start();
    setTimeout(() => {
      fireworks.stop();
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    }, 3000);
  };

  const toggleSidebar = () => {
    configDispatch({ type: 'set', payload: { isCollapse: !configState.config.isCollapse } });
  };

  const theme = useTheme();
  const setTheme = useSetTheme();

  useEffect(() => {
    loadStatus().then(() => {});

    if (theme === 'dark') {
      document.body.setAttribute('theme-mode', 'dark');
    }

    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.is_login_expired) {
        setIsLoginExpired(true);
      }
      console.log('isLoginExpired', isLoginExpired);
    }

    if (isNewYear) {
      console.log('Happy New Year!');
    }
  }, []);

  const [userInfo, setUserInfo] = useState(null)
  useEffect(() => {
    if (userState?.user) {
      setUserInfo(userState.user)
      return
    }
    setUserInfo(null)
  }, [userState])

  return (
    <>
      <Layout>
        <div style={{ width: '100%' }}>
          <Nav
            mode={'horizontal'}
            className={isMobile ? 'header-bar-nav' : ''}
            renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
              const routerMap = {
                login: '/login',
                register: '/register',
                home: '/',
                dashboard: '/dashboard/home',
                pricing: '/pricing',
              };
              return (
                <Link style={{ textDecoration: 'none' }} to={routerMap[props.itemKey]}>
                  {itemElement}
                </Link>
              );
            }}
            selectedKeys={[]}
            // items={headerButtons}
            onSelect={(key) => {}}
            header={
              isMobile
                ? !isLoginExpired
                  ? {
                      text: <Button onClick={() => toggleSidebar()} icon={<IconMenu />}></Button>,
                    }
                  : null
                : {
                    logo: <img src={logo} alt="logo" />,
                    text: systemName,
                  }
            }
          >
            {buttons.map((button) => (
              <Nav.Item itemKey={button.itemKey} text={button.text} icon={button.icon} onClick={() => navigate(button.to)}>
              </Nav.Item>
            ))}

            <Nav.Footer style={{paddingLeft: 0, paddingRight: 0, paddingTop: 16, paddingBottom: 16}}>
              <>
                {isNewYear && (
                  // happy new year
                  <Dropdown
                    position="bottomRight"
                    render={
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={handleNewYearClick}>
                          Happy New Year!!!
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    }
                  >
                    <Nav.Item itemKey={'new-year'} text={'🏮'} />
                  </Dropdown>
                )}
                {/* <Nav.Item itemKey={'about'} icon={<IconHelpCircle />}>
                  关于
                </Nav.Item> */}
                <>
                  {!isMobile && (
                    <Switch
                      checkedText="🌞"
                      size={'middle'}
                      checked={theme === 'dark'}
                      uncheckedText="🌙"
                      onChange={(checked) => {
                        setTheme(checked);
                      }}
                    />
                  )}
                </>
                {userInfo && !isLoginExpired ? (
                  <div style={{width: 'max-content'}}>
                    {/* 签到 */}
                    <CheckInModal
                      visible={checkinModalVisible}
                      onClose={() => setCheckinModalVisible(false)}
                    />
                    {/* <Modal visible={checkinModalVisible} onClose={() => setCheckinModalVisible(false)}></Modal> */}
                    <Dropdown
                      position="bottomRight"
                      render={
                        <Dropdown.Menu>
                          {/* 工作台 */}
                          {isMobile && (
                            <Dropdown.Item onClick={() => navigate('/dashboard/home')}>
                              工作台
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item onClick={checkin}>立即签到</Dropdown.Item>
                          <Dropdown.Item onClick={logout}>退出</Dropdown.Item>
                        </Dropdown.Menu>
                      }
                    >
                      <Avatar
                        size="small"
                        color={stringToColor(userState.user.username)}
                        style={{ margin: 4 }}
                      >
                        {userState.user.username[0]}
                      </Avatar>
                      <span>{userState.user.username}</span>
                    </Dropdown>
                  </div>
                ) : (
                  <>
                    <Nav.Item style={{paddingLeft: 8, paddingRight: 8}} itemKey={'login'} text={'登录'} icon={<IconKey />} />
                    <Nav.Item style={{paddingLeft: 8, paddingRight: 8}} itemKey={'register'} text={'注册'} icon={<IconUser />} />
                  </>
                )}
              </>
            </Nav.Footer>
          </Nav>
        </div>
      </Layout>
    </>
  );
};

export default HeaderBar;
