import { Typography, Row, Col, Card, Button, Space, Divider } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
const { Title, Text, Paragraph } = Typography;

const Feature = ({ icon, title, description }) => (
  <Card className="feature-card" style={{ height: '100%', background: 'var(--semi-color-bg-0)' }}>
    <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
    <Title heading={5} style={{ marginBottom: '8px' }}>
      {title}
    </Title>
    <Paragraph type="tertiary" style={{ marginBottom: 0 }}>
      {description}
    </Paragraph>
  </Card>
);

const Index = () => {
  const navigate = useNavigate();
  return (
    <div style={{ margin: '0 auto', height: '100vh', width: '100%' }}>
      {/* Hero Section */}
      <Card style={{ marginBottom: '64px', background: 'rgb(244, 247, 249)' }} bordered={false}>
        <Row
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 64,
            height: '75vh'
          }}
          gutter={[36, 36]}
        >
          <Col span={24} align={'center'}>
            <Title heading={1} style={{ marginBottom: '24px', marginTop: 64, fontSize: 48 }}>
              Chirou API
            </Title>
          </Col>
          <Col span={24} align={'center'}>
            <Paragraph Paragraph type="secondary" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              使用标准的OpenAI接口协议，不限时间、按量计费、拒绝逆向、极速对话、明细透明，无隐藏消费，在线充值后即可使用所有模型。
            </Paragraph>
          </Col>
          <Col span={24} align={'center'}>
            <Space style={{ marginTop: '32px', display: 'inline-flex' }} align={'center'}>
              <Button theme="solid" type="primary" size="large" style={{ padding: '0 32px' }} onClick={() => navigate('/dashboard')}>
                前往控制台
              </Button>
              <Button theme="light" type="tertiary" size="large" style={{ padding: '0 32px' }} onClick={() => navigate('/doc')}>
                查看API文档
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Features Grid */}
      {/* <Card style={{ marginBottom: '64px', background: 'var(--semi-color-bg-0)' }} bordered={false}>
        <Row gutter={[24, 24]} style={{ marginBottom: '64px' }}>
          <Col xs={24} sm={12} lg={8} style={{ height: '100%' }}>
            <Feature icon="🚀" title="实时响应" description="支持OpenAI、Claude、Gemini、Midjourney、Luma、Runway等，多达上百种模型。" />
          </Col>
          <Col xs={24} sm={12} lg={8} style={{ height: '100%' }}>
            <Feature
              icon="💰"
              title="按量计费"
              description="用多少花多少，余额不过期，用完为止，可实时充值。定价策略透明公开，无隐藏费用。"
            />
          </Col>
          <Col xs={24} sm={12} lg={8} style={{ height: '100%' }}>
            <Feature
              icon="🔒"
              title="稳定可靠"
              description="日常公开账号轮询式调度，稳定性远胜于Azure中转。支持OpenAI所有方案，99%的开发者无需再寻支持。"
            />
          </Col>
        </Row>
      </Card> */}
      {/* FAQ Section */}
      {/* <Card style={{ marginBottom: '64px', background: 'var(--semi-color-bg-0)' }} bordered={false}>
        <Title heading={3} style={{ marginBottom: '24px' }}>
          常见问题
        </Title>
        <Space direction="vertical" style={{ marginTop: '16px' }}>
          <Paragraph>
            <strong>Q1: 如何创建账号？</strong>
            <br />
            A1: 点击“创建账号”按钮，选择注册方式并填写相关信息即可。
          </Paragraph>
          <Paragraph>
            <strong>Q2: 使用过程中遇到问题怎么办？</strong>
            <br />
            A2: 请通过邮件或QQ群联系我们，我们会尽快回复您。
          </Paragraph>
          <Paragraph>
            <strong>Q3: 充值是否安全？</strong>
            <br />
            A3: 我们使用安全的支付接口，确保您的充值信息安全。
          </Paragraph>
        </Space>
      </Card> */}

      {/* Advantages Section */}
      <Card style={{ marginBottom: '64px', background: 'var(--semi-color-bg-0)' }} bordered={false}>
        <Title heading={3} style={{ marginBottom: '40px', textAlign: 'center' }}>
          我们的优势
        </Title>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <Space vertical align="start" spacing={40} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
              <div style={{ fontSize: '24px', marginTop: '4px' }}>⚡️</div>
              <div style={{ flex: 1 }}>
                <Title heading={5} style={{ marginBottom: '8px' }}>
                  API
                </Title>
                <Paragraph style={{ marginBottom: '4px', fontSize: 13 }}>100%使用官方企业高速渠道，已稳定运行1年！</Paragraph>
                <Text type="tertiary" style={{ fontSize: 13 }}>
                  承诺永久运营
                </Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
              <div style={{ fontSize: '24px', marginTop: '4px' }}>🌐</div>
              <div style={{ flex: 1 }}>
                <Title heading={5} style={{ marginBottom: '8px' }}>
                  兼容性与支持
                </Title>
                <Paragraph style={{ marginBottom: '4px', fontSize: 13 }}>完全兼容OpenAI接口协议，确保集成无虞。</Paragraph>
                <Text type="tertiary" style={{ fontSize: 13 }}>
                  无缝对接OpenAI接口支持的应用
                </Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
              <div style={{ fontSize: '24px', marginTop: '4px' }}>💰</div>
              <div style={{ flex: 1 }}>
                <Title heading={5} style={{ marginBottom: '8px' }}>
                  灵活计费
                </Title>
                <Paragraph style={{ marginBottom: '4px', fontSize: 13 }}>
                  无需担心额度过期或封号风险，MySQL8.2超高并发不限速，智能负载均衡算法，日承接量超100万次。
                </Paragraph>
                <Text type="tertiary" style={{ fontSize: 13 }}>
                  按量计费保障灵活性
                </Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
              <div style={{ fontSize: '24px', marginTop: '4px' }}>🌍</div>
              <div style={{ flex: 1 }}>
                <Title heading={5} style={{ marginBottom: '8px' }}>
                  全球布局
                </Title>
                <Paragraph style={{ marginBottom: '4px', fontSize: 13 }}>
                  部署于台湾OpenAI最近的CN2线路服务器，自动负载均衡确保快速响应。
                </Paragraph>
                <Text type="tertiary" style={{ fontSize: 13 }}>
                  全球用户快速响应
                </Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
              <div style={{ fontSize: '24px', marginTop: '4px' }}>🔒</div>
              <div style={{ flex: 1 }}>
                <Title heading={5} style={{ marginBottom: '8px' }}>
                  服务保障
                </Title>
                <Paragraph style={{ marginBottom: '4px', fontSize: 13 }}>7*24小时自助充值，确保服务不会中断。</Paragraph>
                <Text type="tertiary" style={{ fontSize: 13 }}>
                  服务不间断，便捷充值
                </Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
              <div style={{ fontSize: '24px', marginTop: '4px' }}>🔍</div>
              <div style={{ flex: 1 }}>
                <Title heading={5} style={{ marginBottom: '8px' }}>
                  透明计费
                </Title>
                <Paragraph style={{ marginBottom: '4px', fontSize: 13 }}>
                  与官方计费保持同步，公平无猫腻，性价比最高的API渠道，已有70+中转代理。
                </Paragraph>
                <Text type="tertiary" style={{ fontSize: 13 }}>
                  无隐藏费用，透明计费
                </Text>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
              <div style={{ fontSize: '24px', marginTop: '4px' }}>🔄</div>
              <div style={{ flex: 1 }}>
                <Title heading={5} style={{ marginBottom: '8px' }}>
                  Midjourney
                </Title>
                <Paragraph style={{ marginBottom: '4px', fontSize: 13 }}>集成反代服务和中文翻译接口，实现高并发快速响应。</Paragraph>
                <Text type="tertiary" style={{ fontSize: 13 }}>
                  支持最新版Midjourney Proxy Plus
                </Text>
              </div>
            </div>
          </Space>
        </div>
      </Card>

      {/* Support Section */}
      <Card style={{ background: 'var(--semi-color-bg-0)' }} bordered={false}>
        <Row>
          <Col align="center">
            <Title heading={3} style={{ marginBottom: '24px' }}>
              联系与支持
            </Title>
          </Col>
          <Col align="center">
            <Space align="start">
              <Paragraph>
                邮件支持：
                <Text copyable link={{ href: 'mailto:chirou.api@outlook.com' }}>
                  chirou.api@outlook.com
                </Text>
              </Paragraph>
              <Divider layout="vertical" margin="12px" />
              <Paragraph>
                QQ 群：
                <Text copyable>924076327</Text>
              </Paragraph>
            </Space>
          </Col>
        </Row>
      </Card>

      <style>
        {`
          .feature-card:hover {
            transform: translateY(-4px);
            transition: transform 0.2s ease;
          }
        `}
      </style>
    </div>
  );
};

export default Index;
