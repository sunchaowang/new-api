import { Button, Card, Space, Table, Tag, List, Typography } from 'antd';

function renderModalTable(data, provider) {
  function renderSupportColumn(text, record, index) {
    return [
      <Space>
        <Tag>{record.isSupport}</Tag>
        {record.isVip && <Tag color={'blue'}>需升级为VIP用户</Tag>}
      </Space>,
    ];
  }

  function renderReplayTokensColumn(text, record, index) {
    return record.timesPrice ? (
      <div>{record.timesPrice}</div>
    ) : record.characterPrice ? (
      <div>{record.characterPrice}</div>
    ) : (
      <Space direction={'vertical'}>
        <div>
          <Tag>输入</Tag>
          {record.inputTokens + ' / 1k tokens'}
        </div>
        <div>
          <Tag>输出</Tag>
          {record.outputTokens + ' / 1k tokens'}
        </div>
      </Space>
    );
  }

  return (
    <Card
      title={<Tag color={'blue'}>{provider}</Tag>}
      style={{
        width: '100%',
      }}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Table dataSource={data} pagination={false} size={'small'} bordered={false}>
        <Table.Column title="模型名称" dataIndex="name" key="name" width={'33%'} />
        {/*<Table.Column title="官方费率" dataIndex="inputTokens" key="inputTokens" width={'20%'} />*/}
        <Table.Column
          title="本站费率"
          dataIndex="outputTokens"
          key="outputTokens"
          width={'33%'}
          render={renderReplayTokensColumn}
        />
        {/*<Table.Column title="折扣" dataIndex="discount" key="discount" width={'20%'} />*/}
        <Table.Column
          title="备注"
          dataIndex="isSupport"
          key="isSupport"
          render={renderSupportColumn}
        />
      </Table>
    </Card>
  );
}

function App() {
  const changelog = [
    '2024-4-15：赠送的额度可直接使用全模型',
    '2024-4-8：迁移了数据库，提高了响应速度',
    '2024-4-4：增加了每日签到功能，请前往钱包页查看',
  ];
  return (
    <>
      <Space direction={'vertical'} size={10} style={{ width: '100%' }}>
        <Card
          title={'更新日志'}
          bordered={false}
          style={{ boxShadow: 'none' }}
          styles={{
            body: {
              padding: 0,
            },
            header: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          }}
        >
          <List
            bordered
            dataSource={changelog}
            renderItem={(item, index) => (
              <List.Item>
                {index === 0 ? (
                  <Typography.Text type="primary" strong={true}>
                    {item}
                  </Typography.Text>
                ) : (
                  <Typography.Text style={{ border: 'none' }} size={'large'}>
                    {item}
                  </Typography.Text>
                )}
              </List.Item>
            )}
          />
        </Card>
        <Card
          title={'介绍'}
          bordered={false}
          style={{ boxShadow: 'none' }}
          styles={{
            body: {
              padding: 0,
            },
            header: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          }}
        >
          <ul>
            <li>OpenAI 接口转发站</li>
            <li>本站渠道来源：官网正规渠道 、 逆向解析渠道 、 上游代理渠道</li>
            <li>支持模型请查看下方模型介绍</li>
            <li>
              使用过程中有问题请发邮件至
              <a href="mailto:chirou.api@outlook.com">chirou.api@outlook.com</a>
            </li>
            <li>
              每位注册用户都将获得 <Tag color={'red'}>$1</Tag> 的初始使用额度, 邀请新用户奖励
              <Tag color={'red'}>$0.5</Tag>的额度, 可使用全模型
            </li>
            <li>
              当前仅支持 <Tag color={'red'}>Github</Tag> 和邮箱为<Tag color={'red'}>QQ</Tag>
              <Tag color={'red'}>Gmail</Tag>的账号注册 ，谢谢🙏
            </li>
            <li>为了维持转发服务正常使用，将不定期清除非法用户，请使用真实邮箱注册</li>
            <li>
              受供应商和OpenAI政策影响，价格会随时调整，本站充值汇率为
              <Tag color={'red'}>2元=1刀</Tag>（部分模型除外，详情请查看下方表格）
            </li>
          </ul>
        </Card>

        <Card
          title={'使用'}
          bordered={false}
          style={{ boxShadow: 'none' }}
          styles={{
            body: {
              padding: 0,
            },
            header: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          }}
        >
          <ul>
            <li>注册完成后，创建一个令牌，复制令牌的 key 填写到对应的地方</li>
            <li>
              接口转发地址请修改为：<a href="https://api.wochirou.com">https://api.wochirou.com</a>
              即可使用
            </li>
            <li>严令禁止使用api进行非法行为。系统每隔一段时间会定时清理日志记录，请知悉。</li>
          </ul>
        </Card>

        <Card
          title={'兑换码购买'}
          bordered={false}
          style={{ boxShadow: 'none' }}
          styles={{
            body: {
              padding: 0,
            },
            header: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          }}
        >
          <ul>
            <li>
              地址：
              <Button type="primary" onClick={() => window.open('https://shop.wochirou.com/')}>
                点击购买
              </Button>
              【<a href="https://www.zaofaka.com/links/F8373848">备用购买地址</a>
              】购买完成后，在充值的地方输入兑换码
            </li>
            {/*<li>*/}
            {/*  购买10美金以上额度可升级为VIP用户（需手工处理，会存在时间延迟，如出现问题请发邮件）*/}
            {/*</li>*/}
          </ul>
        </Card>

        <Card
          title={<>模型及计费介绍</>}
          bordered={false}
          style={{ boxShadow: 'none' }}
          styles={{
            body: {
              padding: 0,
            },
            header: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          }}
        >
          <Space direction={'vertical'} size={10} style={{ width: '100%' }}>
            <Typography.Paragraph type={'secondary'} style={{ marginTop: 10 }}>
              本页面更新可能存在延迟，实际可用模型及计费请以设置页以及日志页为准
            </Typography.Paragraph>
            {renderModalTable(
              [
                {
                  name: 'gpt-3.5-turbo',
                  inputTokens: '$0.003',
                  outputTokens: '$0.006',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-3.5-turbo-0125',
                  inputTokens: '$0.0005',
                  outputTokens: '$0.0015',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-3.5-turbo-0301',
                  inputTokens: '$0.0015',
                  outputTokens: '$0.002',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-3.5-turbo-0613',
                  inputTokens: '$0.0015',
                  outputTokens: '$0.002',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-3.5-turbo-1106',
                  inputTokens: '$0.001',
                  outputTokens: '$0.002',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-3.5-turbo-16k',
                  inputTokens: '$0.0015',
                  outputTokens: '$0.002',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-3.5-turbo-16k-0613',
                  inputTokens: '$0.003',
                  outputTokens: '$0.004',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4',
                  inputTokens: '$0.03',
                  outputTokens: '$0.06',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-0613',
                  inputTokens: '$0.03',
                  outputTokens: '$0.06',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-0125-preview',
                  inputTokens: '$0.01',
                  outputTokens: '$0.03',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-1106-preview',
                  inputTokens: '$0.01',
                  outputTokens: '$0.03',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-vision-preview',
                  inputTokens: '$0.01',
                  outputTokens: '$0.03',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-turbo-2024-04-09',
                  inputTokens: '$0.03',
                  outputTokens: '$0.06',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-turbo-preview',
                  inputTokens: '$0.01',
                  outputTokens: '$0.03',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-32k',
                  inputTokens: '$0.06',
                  outputTokens: '$0.12',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-32k-0613',
                  inputTokens: '$0.06',
                  outputTokens: '$0.12',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-32k-0314',
                  inputTokens: '$0.06',
                  outputTokens: '$0.12',
                  isSupport: 'Support',
                },
                {
                  name: 'dall-e-3 1024x1024',
                  timesPrice: '$0.15 每次',
                  isSupport: 'Support',
                },
                {
                  name: 'dall-e-3 1024x1792',
                  timesPrice: '$0.3 每次',
                  isSupport: 'Support',
                },
                {
                  name: 'dall-e-3 1792x1792',
                  timesPrice: '$0.3 每次',
                  isSupport: 'Support',
                },
                {
                  name: 'dall-e-3 hd 1024x1024',
                  timesPrice: '$0.3 每次',
                  isSupport: 'Support',
                },
                {
                  name: 'dall-e-3 hd 1024x1792',
                  timesPrice: '$0.45 每次',
                  isSupport: 'Support',
                },
                {
                  name: 'dall-e-3 hd 1792x1792',
                  timesPrice: '$0.45 每次',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-v',
                  timesPrice: '$0.1 每次, 轻度 GPT-4 用户性价比远超官网',
                  isSupport: 'Testing',
                },
                {
                  name: 'gpt-4-dalle',
                  timesPrice: '$0.1 每次, 轻度 GPT-4 用户性价比远超官网',
                  isSupport: 'Testing',
                },
                {
                  name: 'gpt-4-all',
                  timesPrice: '$0.1 每次, 轻度 GPT-4 用户性价比远超官网',
                  isSupport: 'Support',
                },
                {
                  name: 'gpt-4-gizmo-*',
                  timesPrice: '$0.1 每次, 轻度 GPT-4 用户性价比远超官网',
                },
                {
                  name: 'tts-1',
                  characterPrice: '$0.015 / 1k characters',
                  isSupport: 'Support',
                },
                {
                  name: 'tts-1-1106',
                  characterPrice: '$0.015 / 1k characters',
                  isSupport: 'Support',
                },
                {
                  name: 'tts-1-hd',
                  characterPrice: '$0.03 / 1k characters',
                  isSupport: 'Support',
                },
                {
                  name: 'tts-1-hd-1106',
                  characterPrice: '$0.03 / 1k characters',
                  isSupport: 'Support',
                },
              ],
              'OpenAI',
            )}
            {renderModalTable(
              [
                {
                  name: 'glm-3-turbo',
                  inputTokens: '$0.0025',
                  outputTokens: '$0.0025',
                  isSupport: '支持',
                },
                {
                  name: 'glm-4',
                  inputTokens: '$0.05',
                  outputTokens: '$0.05',
                  isSupport: '支持',
                },
                {
                  name: 'glm-4v',
                  inputTokens: '$0.05',
                  outputTokens: '$0.05',
                  isSupport: '支持',
                },
              ],
              'ChatGLM 智谱清言',
            )}
            {renderModalTable(
              [
                {
                  name: 'claude-3-opus-20240229',
                  inputTokens: '$0.15',
                  outputTokens: '$0.75',
                  isSupport: '支持',
                },
                {
                  name: 'claude-3-sonnet-20240229',
                  inputTokens: '$0.03',
                  outputTokens: '$0.15',
                  isSupport: '支持',
                },
                {
                  name: 'claude-3-haiku-20240307',
                  inputTokens: '$0.0025',
                  outputTokens: '$0.0125',
                  isSupport: '支持',
                },
              ],
              'Claude',
            )}
            {renderModalTable(
              [
                {
                  name: 'qwen-plus',
                  inputTokens: '¥0.2',
                  outputTokens: '¥0.2',
                  isSupport: '支持',
                },
                {
                  name: 'qwen-plus-net',
                  inputTokens: '¥0.2',
                  outputTokens: '¥0.2',
                  isSupport: '支持',
                },
                {
                  name: 'qwen-turbo',
                  inputTokens: '¥0.08',
                  outputTokens: '¥0.08',
                  isSupport: '支持',
                },
                {
                  name: 'qwen-turbo-net',
                  inputTokens: '¥0.08',
                  outputTokens: '¥0.08',
                  isSupport: '支持',
                },
              ],
              'DashScope 通义千问',
            )}
            {renderModalTable(
              [
                {
                  name: 'llama2-70b-4096',
                  inputTokens: '¥0.0014',
                  outputTokens: '¥0.0014',
                  isSupport: '支持',
                },
                {
                  name: 'mixtral-8x7b-32768',
                  inputTokens: '¥0.00081',
                  outputTokens: '¥0.00081',
                  isSupport: '支持',
                },
              ],
              '其他',
            )}
          </Space>
        </Card>
      </Space>

      <Typography>
        最后说一句，根据
        <a href="https://www.gov.cn/zhengce/zhengceku/202307/content_6891752.htm">
          《生成式人工智能服务管理暂行办法》
        </a>
        规定，本站严格遵守相关规定，请切勿用于非法用途。
      </Typography>
    </>
  );
}

export default App;
