import { useRoutes, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { PrivateRoute } from '../components/PrivateRoute';
import Loading from '../components/Loading';

import Login from '../components/LoginForm';
import Register from '../components/RegisterForm';

import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Pricing from '../pages/Pricing';
import GitHubOAuth from '../components/GitHubOAuth';
import LinuxDoOAuth from '../components/LinuxDoOAuth';

// Oauth 授权
const oauthRoutes = {
  path: '/oauth',
  children: [
    {
      path: 'github',
      element: <GitHubOAuth />,
    },
    {
      path: 'linuxdo',
      element: <LinuxDoOAuth />,
    },
  ],
};

// Dashboard
import DashboardLogs from '../pages/Log';
import DashboardSetting from '../pages/Setting';
import DashboardChannel from '../pages/Channel';
import DashboardHome from '../pages/Dashboard/Home';
import DashboardDetail from '../pages/Detail';
import DashboardPlayground from '../components/Playground';
import DashboardToken from '../pages/Token';
import DashboardMidJourney from '../pages/Midjourney';
import DashboardTask from '../pages/Task';
import DashboardTopup from '../pages/TopUp';
import DashboardRedemption from '../pages/Redemption';
import DashboardUser from '../pages/User';
import DashboardPersonal from '../pages/Personal';

const dashboardRoutes = {
  path: '/dashboard',
  element: (
    <>
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    </>
  ),
  children: [
    {
      path: '',
      element: (
        <Suspense fallback={<Loading></Loading>}>
          <DashboardHome />
        </Suspense>
      ),
    },
    // playground
    {
      path: 'playground',
      element: (
        <Suspense fallback={<Loading></Loading>}>
          <DashboardPlayground />
        </Suspense>
      ),
    },
    {
      path: 'home',
      element: (
        <Suspense fallback={<Loading></Loading>}>
          <DashboardHome />
        </Suspense>
      ),
    },
    // token
    {
      path: 'token',
      element: (
        <Suspense fallback={<Loading></Loading>}>
          <DashboardToken />
        </Suspense>
      ),
    },
    {
      path: 'channel',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardChannel />
        </Suspense>
      ),
    },
    {
      path: 'log',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardLogs />
        </Suspense>
      ),
    },
    // midjourney
    {
      path: 'midjourney',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardMidJourney />
        </Suspense>
      ),
    },
    // task
    {
      path: 'task',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardTask />
        </Suspense>
      ),
    },
    // topup
    {
      path: 'topup',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardTopup />
        </Suspense>
      ),
    },
    // redemption
    {
      path: 'redemption',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardRedemption />
        </Suspense>
      ),
    },
    // user
    {
      path: 'user',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardUser />
        </Suspense>
      ),
    },
    // 个人中心
    {
      path: 'personal',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardPersonal />
        </Suspense>
      ),
    },
    // 系统设置
    {
      path: 'setting',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardSetting />
        </Suspense>
      ),
    },
    {
      path: 'detail',
      element: (
        <Suspense fallback={<Loading />}>
          <DashboardDetail />
        </Suspense>
      ),
    },
  ],
};

export default function Routes() {
  return useRoutes([
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/pricing', element: <Pricing /> },
    dashboardRoutes,
    oauthRoutes,
  ]);
}
