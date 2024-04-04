import { Button, Card, Space, Table, Tag } from '@douyinfe/semi-ui';

function renderModalTable(data, provider) {
  function renderSupportColumn(text, record, index) {
    return [
      <Space>
        <Tag>{record.isSupport}</Tag>
        {
          record.isVip && (<Tag color={'blue'}>需升级为VIP用户</Tag>)
        }
      </Space>
    ]
  }

  return (
    <Card title={
      <Button>{provider}</Button>
    }
      style={{
        width: '100%'
      }}
    >
      <Table dataSource={data} pagination={false}>
        <Table.Column title="模型名称" dataIndex="name" key="name" width={'25%'} />
        <Table.Column title="输入费率" dataIndex="inputTokens" key="inputTokens" width={'25%'}/>
        <Table.Column title="输出费率" dataIndex="outputTokens" key="outputTokens" width={'25%'}/>
        <Table.Column title="是否支持" dataIndex="isSupport" key="isSupport" render={renderSupportColumn} width={'25%'}/>
      </Table>
    </Card>
  );
}

function App() {
  return (
    <Card bordered={false} style={{width: '100%'}}>
        <Card
            title={
                "更新日志"
            }
        >
            <Tag color={"blue"}>2024-4-4：增加了签到功能，请前往钱包页查看</Tag>
        </Card>
      <h2>介绍</h2>
      <ul>
        <li>OpenAI 接口转发站</li>
        <li>本站渠道来源：官网正规渠道 、 逆向解析渠道 、 上游代理渠道</li>
        <li>支持模型请查看下方模型介绍</li>
        <li>
          使用过程中有问题请发邮件至
          <a href="mailto:chirou.api@outlook.com"
          >chirou.api@outlook.com</a
          >
        </li>
        <li>
          每位注册用户都将获得 <Tag color={'red'}>$2</Tag> 的初始使用额度,
          填写邀请码可以再额外获得 <Tag color={'red'}>$1</Tag> 的使用额度
        </li>
        <li>
          当前注册仅支持 <Tag color={'red'}>Github</Tag> 和
          <Tag color={'red'}>QQ</Tag> 邮箱，谢谢🙏
        </li>
        <li>
          为了维持转发服务正常使用，将不定期清除非法用户，请使用真实邮箱注册
        </li>
        <li>
          受上游以及OpenAI政策影响，价格会随时调整，当前价格
          <Tag color={'red'}>1元/刀</Tag>
        </li>
      </ul>

      <h2>使用</h2>
      <ul>
        <li>注册完成后，创建一个令牌，复制令牌的 key 填写到对应的地方</li>
        <li>
          接口转发地址请修改为：<a href="https://api.wochirou.com"
        >https://api.wochirou.com</a
        >
          即可使用
        </li>
        <li>
          严令禁止使用api进行非法行为。系统每隔一段时间会定时清理日志记录，请知悉。
        </li>
      </ul>

      <h2>兑换码购买</h2>
      <ul>
        <li>
          地址：<a href="https://www.zaofaka.com/links/F8373848">点击购买</a
        >，购买完成后，在充值的地方输入兑换码
        </li>
        <li>购买10美金以上额度的兑换换可升级为VIP用户</li>
      </ul>

      <h2>模型介绍</h2>
      <Space vertical spacing={20} style={{width: '100%'}}>
        {
          renderModalTable([
            {
              "name": "gpt-3.5-turbo",
              "inputTokens": "$0.0015 / 1k tokens",
              "outputTokens": "$0.002 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-3.5-turbo-0125",
              "inputTokens": "$0.0005 / 1k tokens",
              "outputTokens": "$0.0015 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-3.5-turbo-0301",
              "inputTokens": "$0.001 / 1k tokens",
              "outputTokens": "$0.002 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-3.5-turbo-0613",
              "inputTokens": "$0.0015 / 1k tokens",
              "outputTokens": "$0.002 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-3.5-turbo-1106",
              "inputTokens": "$0.001 / 1k tokens",
              "outputTokens": "$0.002 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-3.5-turbo-16k",
              "inputTokens": "$0.003 / 1k tokens",
              "outputTokens": "$0.004 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-4",
              "inputTokens": "$0.04 / 1k tokens",
              "outputTokens": "$0.08 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-4-0613",
              "inputTokens": "$0.03 / 1k tokens",
              "outputTokens": "$0.06 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-4-0125-preview",
              "inputTokens": "$0.01 / 1k tokens",
              "outputTokens": "$0.03 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-4-1106-preview",
              "inputTokens": "$0.01 / 1k tokens",
              "outputTokens": "$0.03 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-4-vision-preview",
              "inputTokens": "$0.01 / 1k tokens",
              "outputTokens": "$0.03 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-4-turbo-preview",
              "inputTokens": "$0.01 / 1k tokens",
              "outputTokens": "$0.03 / 1k tokens",
              "isSupport": "支持"
            },
            {
              "name": "gpt-4-32k",
              "inputTokens": "$0.07 / 1k tokens",
              "outputTokens": "$0.14 / 1k tokens",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "gpt-4-32k-0613",
              "inputTokens": "$0.07 / 1k tokens",
              "outputTokens": "$0.14 / 1k tokens",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "dall-e-3 1024x1024",
              "inputTokens": "$0.3每次",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "dall-e-3 1024x1792",
              "inputTokens": "$0.6每次",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "dall-e-3 hd 1024x1024",
              "inputTokens": "$0.6每次",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "dall-e-3 hd 1024x1792",
              "inputTokens": "$0.9每次",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "gpt-4-v",
              "inputTokens": "$0.1每次 轻度 GPT-4 用户性价比远超官网",
              "outputTokens": "",
              "isSupport": "测试中",
              isVip: true
            },
            {
              "name": "gpt-4-dalle",
              "inputTokens": "$0.1每次 轻度 GPT-4 用户性价比远超官网",
              "outputTokens": "",
              "isSupport": "测试中",
              isVip: true
            },
            {
              "name": "gpt-4-all",
              "inputTokens": "$0.1每次 轻度 GPT-4 用户性价比远超官网",
              "outputTokens": "$0.21 / 1k tokens",
              "isSupport": "测试中",
              isVip: true
            },
            {
              "name": "tts-1",
              "inputTokens": "$0.03 / 1k characters",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "tts-1-hd",
              "inputTokens": "$0.06 / 1k characters",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            }
          ], 'OpenAI')
        }
        {
          renderModalTable([
            {
              "name": "chatglm_lite",
              "inputTokens": "$0.005 / 1k tokens",
              "outputTokens": "",
              "isSupport": "即将废弃",
              isVip: true
            },
            {
              "name": "chatglm_pro",
              "inputTokens": "$0.01 / 1k tokens",
              "outputTokens": "",
              "isSupport": "即将废弃",
              isVip: true
            },
            {
              "name": "chatglm_std",
              "inputTokens": "$0.005 / 1k tokens",
              "outputTokens": "",
              "isSupport": "即将废弃",
              isVip: true
            },
            {
              "name": "chatglm_turbo",
              "inputTokens": "$0.005 / 1k tokens",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "glm-3-turbo",
              "inputTokens": "$0.005 / 1k tokens",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "glm-4",
              "inputTokens": "$0.1 / 1k tokens",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "glm-4v",
              "inputTokens": "$0.1 / 1k tokens",
              "outputTokens": "",
              "isSupport": "支持",
              isVip: true
            }
          ], "ChatGLM 智谱清言")
        }
        {
          renderModalTable([
            {
              "name": "claude-2.1",
              "inputTokens": "$0.08 / 1k tokens",
              "outputTokens": "$0.27 / 1k tokens",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "claude-2",
              "inputTokens": "$0.08 / 1k tokens",
              "outputTokens": "$0.27 / 1k tokens",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "claude-3-opus-20240229",
              "inputTokens": "$0.11 / 1k tokens",
              "outputTokens": "$0.55 / 1k tokens",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "claude-3-sonnet-20240229",
              "inputTokens": "$0.022 / 1k tokens",
              "outputTokens": "$0.11 / 1k tokens",
              "isSupport": "支持",
              isVip: true
            },
            {
              "name": "claude-3-haiku-20240307",
              "inputTokens": "$0.001825 / 1k tokens",
              "outputTokens": "$0.009125 / 1k tokens",
              "isSupport": "支持",
              isVip: true
            }
          ], 'Claude')
        }
        {
          renderModalTable([
            {
              "name": "qwen-plus",
              "inputTokens": "$0.02 / 1k tokens",
              "outputTokens": "$0.02 / 1k tokens",
              "isSupport": "即将废弃",
              isVip: true
            },
            {
              "name": "qwen-plus-net",
              "inputTokens": "$0.02 / 1k tokens",
              "outputTokens": "$0.02 / 1k tokens",
              "isSupport": "即将废弃",
              isVip: true
            },
            {
              "name": "qwen-turbo",
              "inputTokens": "$0.008 / 1k tokens",
              "outputTokens": "$0.008 / 1k tokens",
              "isSupport": "即将废弃",
              isVip: true
            },
            {
              "name": "qwen-turbo-net",
              "inputTokens": "$0.008 / 1k tokens",
              "outputTokens": "$0.008 / 1k tokens",
              "isSupport": "支持",
              isVip: true
            }
          ], 'DashScope 通义千问')
        }
        {
          renderModalTable([
            {
              "name": "llama2-70b-4096",
              "inputTokens": "",
              "outputTokens": "",
              "isSupport": "支持"
            },
            {
              "name": "mixtral-8x7b-32768",
              "inputTokens": "",
              "outputTokens": "",
              "isSupport": "支持"
            }
          ], '其他')
        }
      </Space>

      <p>
        根据<a
        href="https://www.gov.cn/zhengce/zhengceku/202307/content_6891752.htm"
      >《生成式人工智能服务管理暂行办法》</a
      >规定，本站严格遵守相关规定，请切勿用于非法用途。
      </p>
    </Card>
  )
}

export default App