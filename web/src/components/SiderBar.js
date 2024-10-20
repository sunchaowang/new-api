import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { StatusContext } from '../context/Status';

import { API, isAdmin, isMobile, showError } from '../helpers';
import '../index.css';

import { IconGift } from '@douyinfe/semi-icons';
import { Avatar, Dropdown, Layout, Nav, Switch, SideSheet } from '@douyinfe/semi-ui';
import { setStatusData } from '../helpers/data.js';
import { stringToColor } from '../helpers/render.js';
import { useSetTheme, useTheme } from '../context/Theme/index.js';
import {
  IconChangelog,
  IconColorPlatteNew,
  IconConfig,
  IconToken,
  IconTransfer,
  IconTree,
  IconImage,
  IconSpin,
  IconTable,
  IconAccessibility,
  IconList,
  IconForm,
} from '@douyinfe/semi-icons-lab';
import { useIsMobile } from '../helpers/hooks.js';

// HeaderBar Buttons

const SiderBar = () => {
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState, statusDispatch] = useContext(StatusContext);
  const defaultIsCollapsed =
    isMobile() || localStorage.getItem('default_collapse_sidebar') === 'true';

  const [selectedKeys, setSelectedKeys] = useState(['home']);
  const [isCollapsed, setIsCollapsed] = useState(defaultIsCollapsed);
  const [chatItems, setChatItems] = useState([]);
  const theme = useTheme();
  const setTheme = useSetTheme();
  const isUseMobile = useIsMobile();

  const routerMap = {
    dashboardHome: '/dashboard/',
    channel: '/dashboard/channel',
    token: '/dashboard/token',
    redemption: '/dashboard/redemption',
    topup: '/dashboard/topup',
    user: '/dashboard/user',
    log: '/dashboard/log',
    midjourney: '/dashboard/midjourney',
    luma: '/dashboard/luma',
    setting: '/dashboard/setting',
    chat: '/chat',
    detail: '/dashboard/detail',
    pricing: '/pricing',
    task: '/dashboard/task',
    playground: '/dashboard/playground',
    'dashboard/home': '/dashboard/home',
    personal: '/dashboard/personal',
  };

  const menuButtons = useMemo(
    () => [
      {
        text: '欢迎页',
        itemKey: 'dashboard/home',
        to: '/dashboard/home',
        icon: <IconForm />,
      },
      {
        text: 'Playground',
        itemKey: 'playground',
        to: '/dashboard/playground',
        icon: <IconColorPlatteNew />,
      },
      // {
      //   text: "模型价格",
      //   itemKey: "pricing",
      //   to: "/dashboard/pricing",
      //   icon: <IconTag />,
      // },
      // {
      //   text: '聊天',
      //   itemKey: 'chat',
      //   // to: '/chat',
      //   items: chatItems,
      //   icon: <IconComment />,
      //   // className: localStorage.getItem('chat_link')
      //   //   ? 'semi-navigation-item-normal'
      //   //   : 'tableHiddle',
      // },
      {
        text: 'API令牌',
        itemKey: 'token',
        to: '/dashboard/token',
        icon: <IconToken />,
      },
      {
        text: '请求日志',
        itemKey: 'log',
        to: '/dashboard/log',
        icon: <IconChangelog />,
      },
      {
        text: '绘图日志',
        itemKey: 'midjourney',
        to: '/dashboard/midjourney',
        icon: <IconImage />,
        className:
          localStorage.getItem('enable_drawing') === 'true'
            ? 'semi-navigation-item-normal'
            : 'tableHiddle',
      },

      {
        text: '数据分析',
        itemKey: 'detail',
        to: '/dashboard/detail',
        icon: <IconTable />,
        className:
          localStorage.getItem('enable_data_export') === 'true'
            ? 'semi-navigation-item-normal'
            : 'tableHiddle',
      },
      {
        text: '异步任务',
        itemKey: 'task',
        to: '/dashboard/task',
        icon: <IconSpin />,
        className:
          localStorage.getItem('enable_task') === 'true'
            ? 'semi-navigation-item-normal'
            : 'tableHiddle',
      },
      {
        text: '余额充值',
        itemKey: 'topup',
        to: '/dashboard/topup',
        icon: <IconTransfer />,
      },
      {
        text: '渠道管理',
        itemKey: 'channel',
        to: '/dashboard/channel',
        icon: <IconTree />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '兑换码管理',
        itemKey: 'redemption',
        to: '/dashboard/redemption',
        icon: <IconGift />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },

      {
        text: '用户管理',
        itemKey: 'user',
        to: '/dashboard/user',
        icon: <IconList />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '个人中心',
        itemKey: 'personal',
        to: '/dashboard/personal',
        icon: <IconAccessibility />,
      },
      {
        text: '系统设置',
        itemKey: 'setting',
        to: '/dashboard/setting',
        icon: <IconConfig />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
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
      localStorage.getItem('enable_task'),
      localStorage.getItem('chat_link'),
      chatItems,
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
      statusDispatch({ type: 'set', payload: data });
      setStatusData(data);
    } else {
      showError('无法正常连接至服务器！');
    }
  };

  useEffect(() => {
    loadStatus().then(() => {
      setIsCollapsed(isUseMobile || localStorage.getItem('default_collapse_sidebar') === 'true');
    });
    let localKey = window.location.pathname.split('/').at(-1);
    if (localKey === '') {
      localKey = 'home';
    }
    setSelectedKeys([localKey]);
    let chatLink = localStorage.getItem('chat_link');
    if (!chatLink) {
      let chats = localStorage.getItem('chats');
      if (chats) {
        // console.log(chats);
        try {
          chats = JSON.parse(chats);
          if (Array.isArray(chats)) {
            let chatItems = [];
            for (let i = 0; i < chats.length; i++) {
              let chat = {};
              for (let key in chats[i]) {
                chat.text = key;
                chat.itemKey = 'chat' + i;
                chat.to = '/chat/' + i;
              }
              // setRouterMap({ ...routerMap, chat: '/chat/' + i })
              chatItems.push(chat);
            }
            setChatItems(chatItems);
          }
        } catch (e) {
          console.error(e);
          showError('聊天数据解析失败');
        }
      }
    }
  }, []);

  useEffect(() => {
    setIsCollapsed(isUseMobile);
  }, [isUseMobile]);

  return (
    <>
      <Nav
        style={{ maxWidth: 220, height: '100%' }}
        defaultIsCollapsed={
          isUseMobile || localStorage.getItem('default_collapse_sidebar') === 'true'
        }
        isCollapsed={isCollapsed}
        onCollapseChange={(collapsed) => {
          setIsCollapsed(collapsed);
        }}
        selectedKeys={selectedKeys}
        renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
          let chatLink = localStorage.getItem('chat_link');
          if (!chatLink) {
            let chats = localStorage.getItem('chats');
            if (chats) {
              chats = JSON.parse(chats);
              if (Array.isArray(chats) && chats.length > 0) {
                for (let i = 0; i < chats.length; i++) {
                  routerMap['chat' + i] = '/chat/' + i;
                }
                if (chats.length > 1) {
                  // delete /chat
                  if (routerMap['chat']) {
                    delete routerMap['chat'];
                  }
                } else {
                  // rename /chat to /chat/0
                  routerMap['chat'] = '/chat/0';
                }
              }
            }
          }
          return (
            <Link style={{ textDecoration: 'none' }} to={routerMap[props.itemKey]}>
              {itemElement}
            </Link>
          );
        }}
        items={menuButtons}
        onSelect={(key) => {
          setSelectedKeys([key.itemKey]);
        }}
        footer={
          <>
            {isUseMobile && (
              <Switch
                checkedText="🌞"
                size={'small'}
                checked={theme === 'dark'}
                uncheckedText="🌙"
                onChange={(checked) => {
                  setTheme(checked);
                }}
              />
            )}
          </>
        }
      >
        <Nav.Footer collapseButton={true}></Nav.Footer>
      </Nav>
    </>
  );
};

export default SiderBar;
