import React, { useEffect, useState } from 'react';
import {
  API,
  isMobile,
  shouldShowPrompt,
  showError,
  showInfo,
  showSuccess,
  showWarning,
  timestamp2string,
} from '../helpers';

import { CHANNEL_OPTIONS, ITEMS_PER_PAGE } from '../constants';
import { renderGroup, renderNumberWithPoint, renderQuota } from '../helpers/render';
import EditChannel from '../pages/Channel/EditChannel';
import { IconTreeTriangleDown } from '@douyinfe/semi-icons';
<<<<<<< HEAD:web/src/components/ChannelsTable.jsx
import {
  Button,
  Table,
  Tag,
  Typography,
  InputNumber,
  Space,
  Switch,
  Form,
  Input,
  Popconfirm,
  Select,
  Dropdown,
  Tooltip,
  Card,
  Flex,
} from 'antd';
=======
import { loadChannelModels } from './utils.js';
>>>>>>> origin/main:web/src/components/ChannelsTable.js

function renderTimestamp(timestamp) {
  return <>{timestamp2string(timestamp)}</>;
}

let type2label = undefined;

function renderType(type) {
  if (!type2label) {
    type2label = new Map();
    for (let i = 0; i < CHANNEL_OPTIONS.length; i++) {
      type2label[CHANNEL_OPTIONS[i].value] = CHANNEL_OPTIONS[i];
    }
    type2label[0] = { value: 0, text: '未知类型', color: 'grey' };
  }
  return (
    <Tag size="large" color={type2label[type]?.color}>
      {type2label[type]?.text}
    </Tag>
  );
}

const ChannelsTable = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '100px',
    },
    {
      title: '分组',
      dataIndex: 'group',
      render: (text, record, index) => {
        return (
          <div>
            <Space direction="vertical" size={5}>
              {text.split(',').map((item, index) => {
                return renderGroup(item);
              })}
            </Space>
          </div>
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
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        if (text === 3) {
          if (record.other_info === '') {
            record.other_info = '{}'
          }
          let otherInfo = JSON.parse(record.other_info);
          let reason = otherInfo['status_reason'];
          let time = otherInfo['status_time'];
          return (
            <div>
              <Tooltip content={'原因：' + reason + '，时间：' + timestamp2string(time)}>
                {renderStatus(text)}
              </Tooltip>
            </div>
          );
        } else {
          return renderStatus(text);
        }
      },
    },
    {
      title: '响应时间',
      dataIndex: 'response_time',
      render: (text, record, index) => {
        return <div>{renderResponseTime(text)}</div>;
      },
    },
    {
      title: '已用/剩余',
      dataIndex: 'expired_time',
      render: (text, record, index) => {
        return (
          <Space direction="vertical" size={5}>
            <Tooltip content={'已用额度'}>
              <Tag type="ghost" size="large">
                {renderQuota(record.used_quota)}
              </Tag>
            </Tooltip>
            <Tooltip content={'剩余额度' + record.balance + '，点击更新'}>
              <Tag
                size="large"
                onClick={() => {
                  updateChannelBalance(record);
                }}
              >
                ${renderNumberWithPoint(record.balance)}
              </Tag>
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: (text, record, index) => {
        return (
          <div>
            <InputNumber
              style={{ width: 70 }}
              name="priority"
              onBlur={(e) => {
                manageChannel(record.id, 'priority', record, e.target.value);
              }}
              keepFocus={true}
              innerButtons
              defaultValue={record.priority}
              min={-999}
            />
          </div>
        );
      },
    },
    {
      title: '权重',
      dataIndex: 'weight',
      render: (text, record, index) => {
        return (
          <div>
            <InputNumber
              style={{ width: 70 }}
              name="weight"
              onBlur={(e) => {
                manageChannel(record.id, 'weight', record, e.target.value);
              }}
              keepFocus={true}
              innerButtons
              defaultValue={record.weight}
              min={0}
            />
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      render: (text, record, index) => (
        <Space>
          <>
            <Dropdown.Button
              type="primary"
              menu={{
                items: record.test_models,
                onClick(e) {
                  testChannel(record, e);
                },
              }}
              icon={<IconTreeTriangleDown />}
              onClick={() => {
                testChannel(record, '');
              }}
              size={'small'}
            >
              测试
            </Dropdown.Button>
          </>
          {/*<Button theme='light' type='primary' style={{marginRight: 1}} onClick={()=>testChannel(record)}>测试</Button>*/}
          <Popconfirm
            title="确定是否要删除此渠道？"
            content="此修改将不可逆"
            okType={'primary'}
            position={'left'}
            onConfirm={() => {
              manageChannel(record.id, 'delete', record).then(() => {
                removeRecord(record.id);
              });
            }}
          >
            <Button size={'small'} type={'link'} danger>
              删除
            </Button>
          </Popconfirm>
          {record.status === 1 ? (
            <Button
              type={'link'}
              danger
              size={'small'}
              onClick={async () => {
                manageChannel(record.id, 'disable', record);
              }}
            >
              禁用
            </Button>
          ) : (
            <Button
              type="link"
              size={'small'}
              onClick={async () => {
                manageChannel(record.id, 'enable', record);
              }}
            >
              启用
            </Button>
          )}
          <Button
            type="link"
            size={'small'}
            onClick={() => {
              setEditingChannel(record);
              setShowEdit(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定是否要复制此渠道？"
            content="复制渠道的所有信息"
            okType={'primary'}
            position={'left'}
            onConfirm={async () => {
              copySelectedChannel(record.id);
            }}
          >
            <Button size={'small'} type={'link'} style={{ marginRight: 1 }}>
              复制
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [channels, setChannels] = useState([]);
  const [channelTotal, setChannelTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [idSort, setIdSort] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searching, setSearching] = useState(false);
  const [updatingBalance, setUpdatingBalance] = useState(false);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [showPrompt, setShowPrompt] = useState(shouldShowPrompt('channel-test'));
  const [channelCount, setChannelCount] = useState(pageSize);
  const [groupOptions, setGroupOptions] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [enableBatchDelete, setEnableBatchDelete] = useState(false);
  const [editingChannel, setEditingChannel] = useState({
    id: undefined,
  });
  const [selectedChannels, setSelectedChannels] = useState([]);

  const removeRecord = (id) => {
    let newDataSource = [...channels];
    if (id != null) {
      let idx = newDataSource.findIndex((data) => data.id === id);

      if (idx > -1) {
        newDataSource.splice(idx, 1);
        setChannels(newDataSource);
      }
    }
  };

  const setChannelFormat = (channels) => {
    for (let i = 0; i < channels.length; i++) {
      // if (channels[i].type === 8) {
      //   showWarning(
      //     '检测到您使用了“自定义渠道”类型，请更换为“OpenAI”渠道类型！',
      //   );
      //   showWarning('下个版本将不再支持“自定义渠道”类型！');
      // }
      channels[i].key = '' + channels[i].id;
      let test_models = [];
      channels[i].models.split(',').forEach((item, index) => {
        test_models.push({
          key: item,
          label: item,
        });
      });
      channels[i].test_models = test_models;
    }
    // data.key = '' + data.id
    setChannels(channels);
    if (channels.length >= pageSize) {
      setChannelCount(channels.length + pageSize);
    } else {
      setChannelCount(channels.length);
    }
  };

  const loadChannels = async (startIdx, pageSize, idSort) => {
    setLoading(true);
    const res = await API.get(
      `/api/channel/?p=${startIdx}&page_size=${pageSize}&id_sort=${idSort}`,
    );
    if (res === undefined) {
      return;
    }
    const { success, message, data, total } = res.data;
    if (success) {
      if (startIdx === 0) {
        setChannelFormat(data);
        setChannelTotal(total);
      } else {
        let newChannels = [...channels];
        newChannels.splice(startIdx * pageSize, data.length, ...data);
        setChannelFormat(newChannels);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const copySelectedChannel = async (id) => {
<<<<<<< HEAD:web/src/components/ChannelsTable.jsx
    const channelToCopy = channels.find((channel) => String(channel.id) === String(id));
=======
    const channelToCopy = channels.find(
      (channel) => String(channel.id) === String(id),
    );
>>>>>>> origin/main:web/src/components/ChannelsTable.js
    console.log(channelToCopy);
    channelToCopy.name += '_复制';
    channelToCopy.created_time = null;
    channelToCopy.balance = 0;
    channelToCopy.used_quota = 0;
    if (!channelToCopy) {
      showError('渠道未找到，请刷新页面后重试。');
      return;
    }
    try {
      const newChannel = { ...channelToCopy, id: undefined };
      const response = await API.post('/api/channel/', newChannel);
      if (response.data.success) {
        showSuccess('渠道复制成功');
        await refresh();
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      showError('渠道复制失败: ' + error.message);
    }
  };

  const refresh = async () => {
    await loadChannels(activePage - 1, pageSize, idSort);
  };

  useEffect(() => {
    // console.log('default effect')
    // const localIdSort = localStorage.getItem('id-sort') === 'true';
    const localPageSize = parseInt(localStorage.getItem('page-size')) || ITEMS_PER_PAGE;
    // setIdSort(localIdSort);
    setPageSize(localPageSize);
    loadChannels(0, localPageSize, idSort)
      .then()
      .catch((reason) => {
        showError(reason);
      });
    fetchGroups().then();
    loadChannelModels().then();
  }, []);

  const manageChannel = async (id, action, record, value) => {
    let data = { id };
    let res;
    switch (action) {
      case 'delete':
        res = await API.delete(`/api/channel/${id}/`);
        break;
      case 'enable':
        data.status = 1;
        res = await API.put('/api/channel/', data);
        break;
      case 'disable':
        data.status = 2;
        res = await API.put('/api/channel/', data);
        break;
      case 'priority':
        if (value === '') {
          return;
        }
        data.priority = parseInt(value);
        res = await API.put('/api/channel/', data);
        break;
      case 'weight':
        if (value === '') {
          return;
        }
        data.weight = parseInt(value);
        if (data.weight < 0) {
          data.weight = 0;
        }
        res = await API.put('/api/channel/', data);
        break;
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess('操作成功完成！');
      let channel = res.data.data;
      let newChannels = [...channels];
      if (action === 'delete') {
      } else {
        record.status = channel.status;
      }
      setChannels(newChannels);
    } else {
      showError(message);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return <Tag color="green">已启用</Tag>;
      case 2:
        return <Tag color="red">已禁用</Tag>;
      case 3:
        return <Tag color="red">自动禁用</Tag>;
      default:
        return <Tag color="default">未知状态</Tag>;
    }
  };

  const renderResponseTime = (responseTime) => {
    let time = responseTime / 1000;
    time = time.toFixed(2) + ' 秒';
    if (responseTime === 0) {
      return <Tag color="grey">未测试</Tag>;
    } else if (responseTime <= 1000) {
      return <Tag color="green">{time}</Tag>;
    } else if (responseTime <= 3000) {
      return <Tag color="lime">{time}</Tag>;
    } else if (responseTime <= 5000) {
      return <Tag color="yellow">{time}</Tag>;
    } else {
      return <Tag color="red">{time}</Tag>;
    }
  };

  const searchChannels = async (searchKeyword, searchGroup, searchModel) => {
    if (searchKeyword === '' && searchGroup === '' && searchModel === '') {
      // if keyword is blank, load files instead.
      await loadChannels(0, pageSize, idSort);
      setActivePage(1);
      return;
    }
    setLoading(true);
    const res = await API.get(
      `/api/channel/search?keyword=${searchKeyword}&group=${searchGroup}&model=${searchModel}`,
    );
    const { success, message, data } = res.data;
    if (success) {
      setChannelFormat(data);
      setActivePage(1);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const testChannel = async (record, model) => {
    const res = await API.get(`/api/channel/test/${record.id}?model=${model}`);
    const { success, message, time } = res.data;
    if (success) {
      record.response_time = time * 1000;
      record.test_time = Date.now() / 1000;
      showInfo(`通道 ${record.name} 测试成功，耗时 ${time.toFixed(2)} 秒。`);
    } else {
      showError(message);
    }
  };

  const testAllChannels = async () => {
    const res = await API.get(`/api/channel/test`);
    const { success, message } = res.data;
    if (success) {
      showInfo('已成功开始测试所有通道，请刷新页面查看结果。');
    } else {
      showError(message);
    }
  };

  const deleteAllDisabledChannels = async () => {
    const res = await API.delete(`/api/channel/disabled`);
    const { success, message, data } = res.data;
    if (success) {
      showSuccess(`已删除所有禁用渠道，共计 ${data} 个`);
      await refresh();
    } else {
      showError(message);
    }
  };

  const updateChannelBalance = async (record) => {
    const res = await API.get(`/api/channel/update_balance/${record.id}/`);
    const { success, message, balance } = res.data;
    if (success) {
      record.balance = balance;
      record.balance_updated_time = Date.now() / 1000;
      showInfo(`通道 ${record.name} 余额更新成功！`);
    } else {
      showError(message);
    }
  };

  const updateAllChannelsBalance = async () => {
    setUpdatingBalance(true);
    const res = await API.get(`/api/channel/update_balance`);
    const { success, message } = res.data;
    if (success) {
      showInfo('已更新完毕所有已启用通道余额！');
    } else {
      showError(message);
    }
    setUpdatingBalance(false);
  };

  const batchDeleteChannels = async () => {
    if (selectedChannels.length === 0) {
      showError('请先选择要删除的通道！');
      return;
    }
    setLoading(true);
    let ids = [];
    selectedChannels.forEach((channel) => {
      ids.push(channel.id);
    });
    const res = await API.post(`/api/channel/batch`, { ids: ids });
    const { success, message, data } = res.data;
    if (success) {
      showSuccess(`已删除 ${data} 个通道！`);
      await refresh();
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const fixChannelsAbilities = async () => {
    const res = await API.post(`/api/channel/fix`);
    const { success, message, data } = res.data;
    if (success) {
      showSuccess(`已修复 ${data} 个通道！`);
      await refresh();
    } else {
      showError(message);
    }
  };

  let pageData = channels.slice((activePage - 1) * pageSize, activePage * pageSize);

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === Math.ceil(channels.length / pageSize) + 1) {
      // In this case we have to load more data and then append them.
      loadChannels(page - 1, pageSize, idSort).then((r) => {});
    }
  };

  const handlePageSizeChange = async (size) => {
    localStorage.setItem('page-size', size + '');
    setPageSize(size);
    setActivePage(1);
    loadChannels(0, size, idSort)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  };

  const fetchGroups = async () => {
    try {
      let res = await API.get(`/api/group/`);
      // add 'all' option
      // res.data.data.unshift('all');
      if (res === undefined) {
        return;
      }
      setGroupOptions(
        res.data.data.map((group) => ({
          label: group,
          value: group,
        })),
      );
    } catch (error) {
      showError(error.message);
    }
  };

  const closeEdit = () => {
    setShowEdit(false);
  };

  const handleRow = (record, index) => {
    if (record.status !== 1) {
      return {
        style: {
          background: 'var(--semi-color-disabled-border)',
        },
      };
    } else {
      return {};
    }
  };

  return (
    <>
      <EditChannel
        refresh={refresh}
        visible={showEdit}
        handleClose={closeEdit}
        editingChannel={editingChannel}
      />
<<<<<<< HEAD:web/src/components/ChannelsTable.jsx
      <Space direction={'vertical'} size={20} style={{ width: '100%' }}>
        <Card>
          <Space direction={'vertical'}>
            <Form layout={'inline'}>
              <Form.Item label="搜索渠道关键词">
                <Input
                  field="search_keyword"
                  placeholder="ID，名称和密钥 ..."
                  value={searchKeyword}
                  loading={searching}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value.trim());
                  }}
                />
              </Form.Item>
              <Form.Item label="模型">
                <Input
                  field="search_model"
                  label="模型"
                  placeholder="模型关键字"
                  value={searchModel}
                  loading={searching}
                  onChange={(e) => {
                    setSearchModel(e.target.value.trim());
                  }}
                />
              </Form.Item>
              <Form.Item label="分组">
                <Select
                  field="group"
                  label="分组"
                  onChange={(v) => {
                    setSearchGroup(v);
                    searchChannels(searchKeyword, v, searchModel);
                  }}
                >
                  {groupOptions.map((option) => (
                    <Select.Option
                      title={option.label}
                      value={option.value}
                      children={option.label}
                    ></Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
            <Space>
              <Button
                label="查询"
                type="primary"
                onClick={() => searchChannels(searchKeyword, searchGroup, searchModel)}
                loading={loading}
              >
                查询
              </Button>
              <Button
                type="link"
                size={'small'}
                onClick={() => {
                  setEditingChannel({
                    id: undefined,
=======
      <Form
        onSubmit={() => {
          searchChannels(searchKeyword, searchGroup, searchModel);
        }}
        labelPosition='left'
      >
        <div style={{ display: 'flex' }}>
          <Space>
            <Form.Input
              field='search_keyword'
              label='搜索渠道关键词'
              placeholder='ID，名称和密钥 ...'
              value={searchKeyword}
              loading={searching}
              onChange={(v) => {
                setSearchKeyword(v.trim());
              }}
            />
            <Form.Input
              field='search_model'
              label='模型'
              placeholder='模型关键字'
              value={searchModel}
              loading={searching}
              onChange={(v) => {
                setSearchModel(v.trim());
              }}
            />
            <Form.Select
              field='group'
              label='分组'
              optionList={[{ label: '选择分组', value: null}, ...groupOptions]}
              initValue={null}
              onChange={(v) => {
                setSearchGroup(v);
                searchChannels(searchKeyword, v, searchModel);
              }}
            />
            <Button
              label='查询'
              type='primary'
              htmlType='submit'
              className='btn-margin-right'
              style={{ marginRight: 8 }}
            >
              查询
            </Button>
          </Space>
        </div>
      </Form>
      <div style={{ marginTop: 10, display: 'flex' }}>
        <Space>
          <Space>
            <Typography.Text strong>使用ID排序</Typography.Text>
            <Switch
              checked={idSort}
              label='使用ID排序'
              uncheckedText='关'
              aria-label='是否用ID排序'
              onChange={(v) => {
                localStorage.setItem('id-sort', v + '');
                setIdSort(v);
                loadChannels(0, pageSize, v)
                  .then()
                  .catch((reason) => {
                    showError(reason);
>>>>>>> origin/main:web/src/components/ChannelsTable.js
                  });
                  setShowEdit(true);
                }}
              >
                添加渠道
              </Button>
              <Popconfirm
                title="确定是否要修复数据库一致性？"
                content="进行该操作时，可能导致渠道访问错误，请仅在数据库出现问题时使用"
                okType={'primary'}
                onConfirm={fixChannelsAbilities}
              >
                <Button type="link" size={'small'}>
                  修复数据库一致性
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定？"
                okType={'warning'}
                onConfirm={testAllChannels}
                position={isMobile() ? 'top' : 'top'}
              >
                <Button type="link" size={'small'}>
                  测试所有通道
                </Button>
              </Popconfirm>
              <Popconfirm title="确定？" okType={'primary'} onConfirm={updateAllChannelsBalance}>
                <Button type="link" size={'small'}>
                  更新所有已启用通道余额
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定是否要删除禁用通道？"
                content="此修改将不可逆"
                okType={'danger'}
                onConfirm={deleteAllDisabledChannels}
              >
                <Button danger type="dashed">
                  删除禁用通道
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        </Card>

        <Card>
          <Table
            size={'small'}
            className={'channel-table'}
            columns={columns}
            dataSource={pageData}
            pagination={{
              currentPage: activePage,
              pageSize: pageSize,
              total: channelTotal,
              pageSizeOpts: [10, 20, 50, 100],
              showSizeChanger: true,
              formatPageText: (page) => '',
              onShowSizeChange: (current, size) => {
                handlePageSizeChange(size).then();
              },
              onChange: handlePageChange,
            }}
            loading={loading}
            onRow={handleRow}
            rowSelection={
              enableBatchDelete
                ? {
                    onChange: (selectedRowKeys, selectedRows) => {
                      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                      setSelectedChannels(selectedRows);
                    },
                  }
                : null
            }
            scroll={{
              x: 'max-content',
            }}
          />
        </Card>
      </Space>
    </>
  );
};

export default ChannelsTable;
