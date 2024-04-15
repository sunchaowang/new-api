import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { StatusContext } from '../context/Status';

import { API, getLogo, getSystemName, isAdmin, isMobile, showError } from '../helpers';
import '../index.css';

import {
  IconCalendarClock,
  IconComment,
  IconCreditCard,
  IconGift,
  IconHistogram,
  IconHome,
  IconImage,
  IconKey,
  IconLayers,
  IconSetting,
  IconUser,
} from '@douyinfe/semi-icons';
import { Button, Col, Layout, Menu, Row, Space } from 'antd';
import { Flex } from 'antd';
import { Typography } from 'antd';
import { Avatar } from 'antd';
import { Dropdown } from 'antd';
import { Divider } from 'antd';

// HeaderBar Buttons

const SiderBar = () => {
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState, statusDispatch] = useContext(StatusContext);
  const defaultIsCollapsed =
    isMobile() || localStorage.getItem('default_collapse_sidebar') === 'true';

  let navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState(['/home']);
  const systemName = getSystemName();
  const logo = getLogo();
  const [isCollapsed, setIsCollapsed] = useState(defaultIsCollapsed);

  const routerMap = {
    home: '/home',
    channel: '/channel',
    token: '/token',
    redemption: '/redemption',
    topup: '/topup',
    user: '/user',
    log: '/log',
    midjourney: '/midjourney',
    setting: '/setting',
    about: '/about',
    chat: '/chat',
    detail: '/detail',
  };

  const headerButtons = useMemo(
    () => [
      {
        text: '首页',
        itemKey: 'home',
        to: '/home',
        icon: <IconHome />,
      },
      {
        text: '渠道',
        itemKey: 'channel',
        to: '/channel',
        icon: <IconLayers />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
        adminPermission: true,
        loginPermission: true,
      },
      {
        text: '聊天',
        itemKey: 'chat',
        to: '/chat',
        icon: <IconComment />,
        className: localStorage.getItem('chat_link')
          ? 'semi-navigation-item-normal'
          : 'tableHiddle',
      },
      {
        text: '令牌',
        itemKey: 'token',
        to: '/token',
        icon: <IconKey />,
        loginPermission: true,
      },
      {
        text: '兑换码',
        itemKey: 'redemption',
        to: '/redemption',
        icon: <IconGift />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
        adminPermission: true,
        loginPermission: true,
      },
      {
        text: '钱包',
        itemKey: 'topup',
        to: '/topup',
        icon: <IconCreditCard />,
        loginPermission: true,
      },
      {
        text: '用户',
        itemKey: 'user',
        to: '/user',
        icon: <IconUser />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
        adminPermission: true,
        loginPermission: true
      },
      {
        text: '日志',
        itemKey: 'log',
        to: '/log',
        icon: <IconHistogram />,
        loginPermission: true,
      },
      {
        text: '数据看板',
        itemKey: 'detail',
        to: '/detail',
        icon: <IconCalendarClock />,
        className:
          localStorage.getItem('enable_data_export') === 'true'
            ? 'semi-navigation-item-normal'
            : 'tableHiddle',
        loginPermission: true,
      },
      {
        text: '绘图',
        itemKey: 'midjourney',
        to: '/midjourney',
        icon: <IconImage />,
        className:
          localStorage.getItem('enable_drawing') === 'true'
            ? 'semi-navigation-item-normal'
            : 'tableHiddle',
        loginPermission: true,
      },
      {
        text: '设置',
        itemKey: 'setting',
        to: '/setting',
        icon: <IconSetting />,
        loginPermission: true,
      },
      // {
      //     text: '关于',
      //     itemKey: 'about',
      //     to: '/about',
      //     icon: <IconAt/>
      // }
    ],
    [
      localStorage.getItem('enable_data_export'),
      localStorage.getItem('enable_drawing'),
      localStorage.getItem('chat_link'),
      isAdmin(),
    ],
  );

  const loadStatus = async () => {
    const res = await API.get('/api/status');
    if (res === undefined) {
      return;
    }
    const { success, data } = res.data;
    if (success) {
      localStorage.setItem('status', JSON.stringify(data));
      statusDispatch({ type: 'set', payload: data });
      localStorage.setItem('system_name', data.system_name);
      localStorage.setItem('logo', data.logo);
      localStorage.setItem('footer_html', data.footer_html);
      localStorage.setItem('quota_per_unit', data.quota_per_unit);
      localStorage.setItem('display_in_currency', data.display_in_currency);
      localStorage.setItem('enable_drawing', data.enable_drawing);
      localStorage.setItem('enable_data_export', data.enable_data_export);
      localStorage.setItem('data_export_default_time', data.data_export_default_time);
      localStorage.setItem('default_collapse_sidebar', data.default_collapse_sidebar);
      localStorage.setItem('mj_notify_enabled', data.mj_notify_enabled);
      if (data.chat_link) {
        localStorage.setItem('chat_link', data.chat_link);
      } else {
        localStorage.removeItem('chat_link');
      }
      if (data.chat_link2) {
        localStorage.setItem('chat_link2', data.chat_link2);
      } else {
        localStorage.removeItem('chat_link2');
      }
    } else {
      showError('无法正常连接至服务器！');
    }
  };

  function renderMenuItems() {
    function getMenuItem(label, key, icon, children, to) {
      return {
        key,
        icon,
        children,
        label,
        to,
      };
    }

    return headerButtons
      .filter((menu) => {
        if (menu.loginPermission) {
          if (menu.adminPermission) {
            return isAdmin();
          }
          return localStorage.getItem('user') && !!userState.user;
        }
        return true;
      })
      .map((menu) => {
        return getMenuItem(menu.text, menu.itemKey, menu.icon, menu.children, menu.to);
      });
  }

  useEffect(() => {
    loadStatus().then(() => {
      setIsCollapsed(isMobile() || localStorage.getItem('default_collapse_sidebar') === 'true');
    });
    let localKey = window.location.pathname.split('/')[1];
    if (localKey === '') {
      localKey = 'home';
    }
    setSelectedKeys([localKey]);
  }, []);

  return (
    <>
      <Row wrap={false}>
        <Col flex="200px">
          <Flex gap={'middle'} style={{ height: '100%', padding: '0 24px' }} align="center">
            <img
              src={logo}
              alt="logo"
              style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              onClick={() => navigate('/home')}
            />
            <Typography.Title level={4} style={{ margin: 0 }}>
              {systemName}
            </Typography.Title>
          </Flex>
        </Col>
        <Col flex="auto">
          <Menu
            mode="horizontal"
            items={renderMenuItems()}
            onClick={(e) => {
              navigate(e.key);
              setSelectedKeys([e.key]);
            }}
            selectedKeys={selectedKeys}
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: 'transparent',
            }}
          ></Menu>
        </Col>
        <Col flex={'150px'}>
          <Space style={{ float: 'right', padding: '0 24px' }}>
            {userState.user
              ? [
                  // 显示头像和退出按钮
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'logout',
                          label: '退出',
                        },
                      ],
                      onClick: (e) => {
                        if (e.key === 'logout') {
                          userDispatch({ type: 'logout' });
                          localStorage.removeItem('user');
                          navigate('/login');
                        }
                      },
                    }}
                  >
                    <Space>
                      <Typography.Title level={5}>
                        {/*<Avatar src={userState.user.avatar} />*/}
                        {userState.user.username}
                      </Typography.Title>
                    </Space>
                  </Dropdown>,
                ]
              : [
                  <Link to="/login">登录</Link>,
                  <Divider type="vertical"></Divider>,
                  <Link to="/register">注册</Link>,
                ]}
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default SiderBar;
