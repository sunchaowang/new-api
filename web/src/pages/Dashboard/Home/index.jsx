import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Space,
  Card,
  Descriptions,
  Calendar,
  Tag,
  Spin,
  Col,
  Typography,
} from '@douyinfe/semi-ui';
import { IconClear, IconGift, IconDuration } from '@douyinfe/semi-icons';

import Detail from '../../../pages/Detail';

import { UserContext } from '../../../context/User/index.js';
import { API, isMobile, showError, showSuccess, showWarning } from '../../../helpers';
import dayjs from 'dayjs';

import CheckInModal from '../../../components/CheckInModal.js';
import { renderQuota } from '../../../helpers/render.js';
import { useIsMobile } from '../../../helpers/hooks.js';

export default function Home() {
  const navigate = useNavigate();
  const [userState, userDispatch] = useContext(UserContext);

  const getUserData = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
    } else {
      showError(message);
    }
  };

  useLayoutEffect(() => {
    getUserData();
  }, []);

  console.log('userState', userState);
  return (
    <>
      <Space vertical style={{ width: '100%' }} align="start" spacing={16}>
        <Row style={{ width: '100%' }} gutter={[16, 16]}>
          <Col span={24} lg={24} xl={6} xxl={6}>
            <h1>👋 你好，{userState.user?.username}</h1>
          </Col>
          <Col span={24} lg={24} xl={18} xxl={18}>
            <Descriptions
              style={{ width: '100%' }}
              column={1}
              row={true}
              layout="vertical"
              data={[
                {
                  key: '当前余额',
                  value: renderQuota(userState.user?.quota),
                },
                {
                  key: '累计消费',
                  value: renderQuota(userState.user?.used_quota),
                },
                {
                  key: '累计请求次数',
                  value: userState.user?.request_count,
                },
                {
                  key: '上次登录',
                  value: dayjs.unix(userState.user?.last_login_at).format('YYYY-MM-DD HH:mm:ss'),
                },
              ]}
            >
              <Descriptions.Item key="当前余额" label="当前余额">
                {renderQuota(userState.user?.quota)}
              </Descriptions.Item>
              <Descriptions.Item key="累计消费" label="累计消费">
                {renderQuota(userState.user?.used_quota)}
              </Descriptions.Item>
              <Descriptions.Item key="累计请求次数" label="累计请求次数">
                {userState.user?.request_count}
              </Descriptions.Item>
              <Descriptions.Item key="上次登录时间" label="上次登录时间" style={{ width: '100%' }}>
                {dayjs.unix(userState.user?.last_login_at).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        {/* 签到日历 */}
        <Row style={{ width: '100%' }}>
          <Card style={{ width: '100%' }} title={'签到日历'} bodyStyle={{ padding: 0 }}>
            <SignCalendar />
          </Card>
        </Row>
        {/* 数据看板 */}
        <Row style={{ width: '100%' }}>
          <Card
            style={{ width: '100%' }}
            bodyStyle={{ padding: 0 }}
            title="数据看板(近1天)"
            headerExtraContent={
              <Typography.Text link onClick={() => navigate('/dashboard/detail')}>
                更多
              </Typography.Text>
            }
          >
            <Detail currentPage="dashboard" />
          </Card>
        </Row>
      </Space>
    </>
  );
}

const SignCalendar = () => {
  const [checkInDates, setCheckInDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkInModalVisible, setCheckInModalVisible] = useState(false);

  const isMobile = useIsMobile();

  const getLogsByType = async () => {
    setLoading(true);
    let res = await API.get(`/api/log/self/search?keyword=5`);
    const { success, message, data } = res.data;
    if (success) {
      setCheckInDates(
        data.map((item) => ({
          date: new Date(Number(item.created_at) * 1000),
          content: item.content,
          quota: item.quota,
        })),
      );
    } else {
      showError(message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLogsByType();
  }, []);

  const baseStyle = {
    position: 'absolute',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const dateRender = (dateString) => {
    // 判断是否今日
    const isToday = dayjs(dateString).isSame(dayjs(), 'day');
    // 判断是否小于当前时间
    const isBefore = dayjs(dateString).isBefore(dayjs());
    // 判断年月日是否在checkInDates中
    const checkInDate = checkInDates.find(
      (item) =>
        item.date.getFullYear() === new Date(dateString).getFullYear() &&
        item.date.getMonth() === new Date(dateString).getMonth() &&
        item.date.getDate() === new Date(dateString).getDate(),
    );

    if (isToday) {
      baseStyle['border'] = 'var(--semi-color-primary) 2px solid';
      baseStyle['backgroundColor'] = '#f5f5f5';
    } else {
      delete baseStyle['border'];
      delete baseStyle['backgroundColor'];
    }

    function handleCheckIn(dateString) {
      console.log('checkInDate', checkInDate);
      if (checkInDate) {
        showSuccess('已' + checkInDate.content);
        return;
      } else {
        if (isToday) {
          setCheckInModalVisible(true);
        } else {
          if (isBefore) {
            showError('暂无补签机会！');
            return;
          } else {
            showWarning('未到签到日期');
            return;
          }
        }
      }
    }
    // 判断年月日是否相同
    return (
      <div style={{ ...baseStyle }} onClick={() => handleCheckIn(dateString)}>
        <Tag
          color={checkInDate ? 'green' : isBefore ? 'red' : 'yellow'}
          prefixIcon={
            checkInDate ? (
              <IconGift
                style={{
                  lineHeight: '12px',
                }}
              />
            ) : isBefore ? (
              <IconClear
                style={{
                  lineHeight: '12px',
                }}
              />
            ) : (
              <IconDuration
                style={{
                  lineHeight: '12px',
                }}
              />
            )
          }
        >
          {isMobile ? '' : !checkInDate ? (isBefore ? '未签到' : '待签到') : '已签到'}
        </Tag>
        {!!checkInDate?.quota && (
          <Typography.Text
            className="check-in-quota"
            size={'small'}
            ellipsis
            style={{
              marginTop: 3,
              fontSize: 12,
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'var(--semi-color-primary)',
            }}
          >
            <span
              style={{
                ...(isMobile ? { transform: 'scale(0.85)' } : {}),
              }}
            >
              {renderQuota(checkInDate.quota, 2)}
            </span>
          </Typography.Text>
        )}
      </div>
    );
  };

  return (
    <>
      <Spin spinning={loading}>
        <Calendar
          height={600}
          mode="month"
          dateGridRender={dateRender}
          loading={loading}
          weekStartsOn={1}
        />
      </Spin>
      <CheckInModal
        visible={checkInModalVisible}
        onClose={() => setCheckInModalVisible(false)}
        callback={getLogsByType}
      />
    </>
  );
};
