import React, { useEffect, useState } from 'react';
import { API, copy, isAdmin, showError, showSuccess, timestamp2string } from '../helpers';

import { Avatar } from '@douyinfe/semi-ui';
import {
  Tag,
  Button,
  Table,
  Modal,
  Layout,
  Form,
  Input,
  DatePicker,
  Space,
  Select,
  Row,
} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { ITEMS_PER_PAGE } from '../constants';
import { renderNumber, renderQuota, stringToColor } from '../helpers/render';
import Paragraph from '@douyinfe/semi-ui/lib/es/typography/paragraph';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const { Header } = Layout;

function renderTimestamp(timestamp) {
  return <>{timestamp2string(timestamp)}</>;
}

const MODE_OPTIONS = [
  { key: 'all', text: '全部用户', value: 'all' },
  { key: 'self', text: '当前用户', value: 'self' },
];
function renderType(type) {
  switch (type) {
    case 1:
      return <Tag color="cyan"> 充值 </Tag>;
    case 2:
      return <Tag color="lime"> 消费 </Tag>;
    case 3:
      return <Tag color="orange"> 管理 </Tag>;
    case 4:
      return <Tag color="purple"> 系统 </Tag>;
    case 5:
      return <Tag> 签到 </Tag>;
    default:
      return <Tag color="black"> 未知 </Tag>;
  }
}

function renderIsStream(bool) {
  if (bool) {
    return <Tag color="blue">流</Tag>;
  } else {
    return <Tag color="purple">非流</Tag>;
  }
}

function renderUseTime(type) {
  const time = parseInt(type);
  if (time < 101) {
    return <Tag color="green"> {time} s </Tag>;
  } else if (time < 300) {
    return <Tag color="orange"> {time} s </Tag>;
  } else {
    return <Tag color="red"> {time} s </Tag>;
  }
}

const LogsTable = () => {
  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp2string',
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return isAdminUser ? (
          record.type === 0 || record.type === 2 ? (
            <div>{<Tag color={'blue'}> {text} </Tag>}</div>
          ) : (
            <></>
          )
        ) : (
          <></>
        );
      },
    },
    {
      title: '用户',
      dataIndex: 'username',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return isAdminUser ? (
          <div>
            <Avatar
              size="small"
              color={stringToColor(text)}
              style={{ marginRight: 4 }}
              onClick={() => showUserInfo(record.user_id)}
            >
              {typeof text === 'string' && text.slice(0, 1)}
            </Avatar>
            {text}
          </div>
        ) : (
          <></>
        );
      },
    },
    {
      title: '令牌',
      dataIndex: 'token_name',
      render: (text, record, index) => {
        return record.type === 0 || record.type === 2 ? (
          <div>
            <Tag
              color="blue"
              onClick={() => {
                copyText(text);
              }}
            >
              {' '}
              {text}{' '}
            </Tag>
          </div>
        ) : (
          <></>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text, record, index) => {
        return <div>{renderType(text)}</div>;
      },
    },
    {
      title: '模型',
      dataIndex: 'model_name',
      render: (text, record, index) => {
        return record.type === 0 || record.type === 2 ? (
          <div>
            <Tag
              color={stringToColor(text)}
              onClick={() => {
                copyText(text);
              }}
            >
              {' '}
              {text}{' '}
            </Tag>
          </div>
        ) : (
          <></>
        );
      },
    },
    {
      title: '用时',
      dataIndex: 'use_time',
      render: (text, record, index) => {
        return (
          <div>
            <Space>
              {renderUseTime(text)}
              {renderIsStream(record.is_stream)}
            </Space>
          </div>
        );
      },
    },
    {
      title: '提示',
      dataIndex: 'prompt_tokens',
      render: (text, record, index) => {
        return record.type === 0 || record.type === 2 ? <div>{<span> {text} </span>}</div> : <></>;
      },
    },
    {
      title: '补全',
      dataIndex: 'completion_tokens',
      render: (text, record, index) => {
        return parseInt(text) > 0 && (record.type === 0 || record.type === 2) ? (
          <div>{<span> {text} </span>}</div>
        ) : (
          <></>
        );
      },
    },
    {
      title: '花费',
      dataIndex: 'quota',
      render: (text, record, index) => {
        return record.type === 0 || record.type === 2 ? <div>{renderQuota(text, 6)}</div> : <></>;
      },
    },
    {
      title: '详情',
      dataIndex: 'content',
      render: (text, record, index) => {
        return (
          <Paragraph
            ellipsis={{
              rows: 2,
              showTooltip: { type: 'popover', opts: { style: { width: 240 } } },
            }}
            style={{ maxWidth: 240 }}
          >
            {text}
          </Paragraph>
        );
      },
    },
  ];

  const [logs, setLogs] = useState([]);
  const [showStat, setShowStat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStat, setLoadingStat] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [logCount, setLogCount] = useState(ITEMS_PER_PAGE);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [logType, setLogType] = useState(0);
  const isAdminUser = isAdmin();
  let now = new Date();
  // 初始化start_timestamp为前一天
  const [inputs, setInputs] = useState({
    username: '',
    token_name: '',
    model_name: '',
    start_timestamp: timestamp2string(now.getTime() / 1000 - 86400),
    end_timestamp: timestamp2string(now.getTime() / 1000 + 3600),
    channel: '',
  });
  const { username, token_name, model_name, start_timestamp, end_timestamp, channel } = inputs;

  const [stat, setStat] = useState({
    quota: 0,
    token: 0,
  });

  const handleInputChange = (value, name) => {
    if (name === 'start_timestamp') {
      setInputs({ ...inputs, start_timestamp: value[0], end_timestamp: value[1] });
      return;
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const getLogSelfStat = async () => {
    let localStartTimestamp = Date.parse(start_timestamp) / 1000;
    let localEndTimestamp = Date.parse(end_timestamp) / 1000;
    let res = await API.get(
      `/api/log/self/stat?type=${logType}&token_name=${token_name}&model_name=${model_name}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`,
    );
    const { success, message, data } = res.data;
    if (success) {
      setStat(data);
    } else {
      showError(message);
    }
  };

  const getLogStat = async () => {
    let localStartTimestamp = Date.parse(start_timestamp) / 1000;
    let localEndTimestamp = Date.parse(end_timestamp) / 1000;
    let res = await API.get(
      `/api/log/stat?type=${logType}&username=${username}&token_name=${token_name}&model_name=${model_name}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&channel=${channel}`,
    );
    const { success, message, data } = res.data;
    if (success) {
      setStat(data);
    } else {
      showError(message);
    }
  };

  const handleEyeClick = async () => {
    setLoadingStat(true);
    if (isAdminUser) {
      await getLogStat();
    } else {
      await getLogSelfStat();
    }
    setShowStat(true);
    setLoadingStat(false);
  };

  const showUserInfo = async (userId) => {
    if (!isAdminUser) {
      return;
    }
    const res = await API.get(`/api/user/${userId}`);
    const { success, message, data } = res.data;
    if (success) {
      Modal.info({
        title: '用户信息',
        content: (
          <div style={{ padding: 12 }}>
            <p>用户名: {data.username}</p>
            <p>余额: {renderQuota(data.quota)}</p>
            <p>已用额度：{renderQuota(data.used_quota)}</p>
            <p>请求次数：{renderNumber(data.request_count)}</p>
          </div>
        ),
        centered: true,
      });
    } else {
      showError(message);
    }
  };

  const setLogsFormat = (logs) => {
    for (let i = 0; i < logs.length; i++) {
      logs[i].timestamp2string = timestamp2string(logs[i].created_at);
      logs[i].key = '' + logs[i].id;
    }
    // data.key = '' + data.id
    setLogs(logs);
    setLogCount(logs.length + ITEMS_PER_PAGE);
    // console.log(logCount);
  };

  const loadLogs = async (startIdx, pageSize, logType = 0) => {
    setLoading(true);

    let url = '';
    let localStartTimestamp = Date.parse(start_timestamp) / 1000;
    let localEndTimestamp = Date.parse(end_timestamp) / 1000;
    if (isAdminUser) {
      url = `/api/log/?p=${startIdx}&page_size=${pageSize}&type=${logType}&username=${username}&token_name=${token_name}&model_name=${model_name}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&channel=${channel}`;
    } else {
      url = `/api/log/self/?p=${startIdx}&page_size=${pageSize}&type=${logType}&token_name=${token_name}&model_name=${model_name}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`;
    }
    const res = await API.get(url);
    const { success, message, data } = res.data;
    if (success) {
      if (startIdx === 0) {
        setLogsFormat(data);
      } else {
        let newLogs = [...logs];
        newLogs.splice(startIdx * pageSize, data.length, ...data);
        setLogsFormat(newLogs);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const pageData = logs.slice((activePage - 1) * pageSize, activePage * pageSize);

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === Math.ceil(logs.length / pageSize) + 1) {
      // In this case we have to load more data and then append them.
      loadLogs(page - 1, pageSize, logType).then((r) => {});
    }
  };

  const handlePageSizeChange = async (size) => {
    localStorage.setItem('page-size', size + '');
    setPageSize(size);
    setActivePage(1);
    loadLogs(0, size)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  };

  const refresh = async () => {
    // setLoading(true);
    setActivePage(1);
    await loadLogs(0, pageSize, logType);
  };

  const copyText = async (text) => {
    if (await copy(text)) {
      showSuccess('已复制：' + text);
    } else {
      // setSearchKeyword(text);
      Modal.error({ title: '无法复制到剪贴板，请手动复制', content: text });
    }
  };

  useEffect(() => {
    // console.log('default effect')
    const localPageSize = parseInt(localStorage.getItem('page-size')) || ITEMS_PER_PAGE;
    setPageSize(localPageSize);
    loadLogs(0, localPageSize)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  }, []);

  const searchLogs = async () => {
    if (searchKeyword === '') {
      // if keyword is blank, load files instead.
      await loadLogs(0, pageSize);
      setActivePage(1);
      return;
    }
    setSearching(true);
    const res = await API.get(`/api/log/self/search?keyword=${searchKeyword}`);
    const { success, message, data } = res.data;
    if (success) {
      setLogs(data);
      setActivePage(1);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  return (
    <Space direction={'vertical'} size={20} style={{ width: '100%' }}>
      <h3>
        使用明细（总消耗额度：
        <Button
          type="link"
          onClick={handleEyeClick}
          style={{
            cursor: 'pointer',
            color: 'gray',
          }}
          loading={loadingStat}
        >
          {showStat ? renderQuota(stat.quota) : '点击查看'}
        </Button>
        ）
      </h3>
      <Form layout={'inline'}>
        <Form.Item label="令牌名称">
          <Input
            field="token_name"
            value={token_name}
            placeholder={'可选值'}
            name="token_name"
            onChange={(e) => handleInputChange(e.target.value, 'token_name')}
            allowClear
          />
        </Form.Item>
        <Form.Item label="模型名称">
          <Input
            field="model_name"
            value={model_name}
            placeholder="可选值"
            name="model_name"
            onChange={(e) => handleInputChange(e.target.value, 'model_name')}
            allowClear
          />
        </Form.Item>
        <Form.Item label={'时间'}>
          <DatePicker.RangePicker
            field="start_timestamp"
            value={[dayjs(start_timestamp), dayjs(end_timestamp)]}
            type="dateTime"
            name="start_timestamp"
            onChange={(value, dateStrings) => handleInputChange(dateStrings, 'start_timestamp')}
            allowClear
            locale={zhCN}
          />
        </Form.Item>
        {isAdminUser && (
          <>
            <Form.Item label="渠道 ID">
              <Input
                field="channel"
                value={channel}
                placeholder="可选值"
                name="channel"
                onChange={(e) => handleInputChange(e.target.value, 'channel')}
                allowClear
              />
            </Form.Item>
            <Form.Item label="用户名称">
              <Input
                field="username"
                value={username}
                placeholder={'可选值'}
                name="username"
                onChange={(e) => handleInputChange(e.target.value, 'username')}
                allowClear
              />
            </Form.Item>
          </>
        )}
        <Form.Item label="类型">
          <Select
            defaultValue="0"
            style={{ width: 120 }}
            onChange={(value) => {
              setLogType(parseInt(value));
              loadLogs(0, pageSize, parseInt(value));
            }}
          >
            <Select.Option value="0">全部</Select.Option>
            <Select.Option value="1">充值</Select.Option>
            <Select.Option value="2">消费</Select.Option>
            <Select.Option value="3">管理</Select.Option>
            <Select.Option value="4">系统</Select.Option>
            <Select.Option value="5">签到</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      <Row>
        <Button
          label="查询"
          type="primary"
          htmlType="submit"
          className="btn-margin-right"
          onClick={refresh}
          loading={loading}
          theme={'solid'}
        >
          查询
        </Button>
      </Row>
      <Table
        columns={columns}
        dataSource={pageData}
        pagination={{
          currentPage: activePage,
          pageSize: pageSize,
          total: logCount,
          pageSizeOpts: [10, 20, 50, 100],
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            handlePageSizeChange(size).then();
          },
          onChange: handlePageChange,
        }}
        loading={loading}
        size="small"
      />
    </Space>
  );
};

export default LogsTable;
