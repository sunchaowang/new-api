import { Card, Tag, Typography, Row, Col } from "@douyinfe/semi-ui";
import { Grid } from "semantic-ui-react";
const { Title, Paragraph, Text } = Typography;

const Index = () => {
  const changelog = [
    "已接入LINUX DO 授权登录",
    <span>
      优化分组倍率计价系统, 分组倍率将细分为用户分组和令牌分组
      <br />
      用户分组：默认用户组(default)分组倍率为1倍
      <br />
      令牌分组：默认令牌组(default)分组倍率为1倍，OpenAI直连分组(openai_direct)分组倍率为8倍，Claude直连分组(claude_direct)分组倍率为8倍
      <br />
      如需修改令牌分组请联系站长。
    </span>,
    "充值汇率为1元 = 1刀",
  ];

  return (
    <Card
      bordered={false}
      styles={{
        body: { paddingLeft: 24, paddingRight: 24 },
      }}
    >
      <Row style={{ width: "100%" }}>
        <Typography>
          <Title level={3}>更新日志</Title>
          {changelog.map((item, index) => (
            <Paragraph key={index}>
              {index + 1}.{item}
            </Paragraph>
          ))}
        </Typography>

        <Typography>
          <Title level={3}>介绍说明</Title>
          <Paragraph>1.AI API接口转发站</Paragraph>
          <Paragraph>
            2.本站渠道来源：OpenAI、Azure、AWS、GCP、逆向、其它渠道
          </Paragraph>
          <Paragraph>
            3.默认分组用户接口服务在官网直连以及其他渠道自动调优，如需官网直连，请联系站长修改分组。
          </Paragraph>
          <Paragraph>4.支持模型请查看下方模型介绍</Paragraph>
          <Paragraph>
            5.使用过程中有问题请发邮件至
            <Text copyable style={{ padding: "0 5px" }}>
              <a href="mailto:chirou.api@outlook.com">chirou.api@outlook.com</a>
            </Text>
            或者加入QQ群{" "}
            <Text copyable style={{ padding: "0 5px" }}>
              924076327
            </Text>
          </Paragraph>
          <Paragraph>
            6.每位注册用户都将获得{" "}
            <Tag color={"red"} defaultChecked size="small" variant="outlined">
              $0.3
            </Tag>{" "}
            的初始使用额度, 邀请新用户奖励
            <Tag color={"red"} defaultChecked size="small" variant="outlined">
              $0.2
            </Tag>
            的额度, 可使用全模型
          </Paragraph>
          <Paragraph>
            7.
            <Tag
              type="text"
              onClick={() => window.open("https://linux.do", "blank")}
            >
              LinuxDo 论坛
            </Tag>
            用户注册时可再额外获得赠金。通过其他渠道注册本站的用户，请在绑定LinuxDo授权后在论坛私信（Username为）
            <Tag color={"red"} defaultChecked>
              {" "}
              @sunnysun
            </Tag>
            补发对应的奖励额度。
            {/* <br />
            （论坛等级2级及以上，获得
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              论坛等级 - 1
            </Tag>{' '}
            的额度 ； 低于2级的获得
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              $0.5
            </Tag>{' '}
            的额度） */}
          </Paragraph>
          <Paragraph>
            8. 当前仅支持{" "}
            <Tag color={"red"} defaultChecked size="small" variant="outlined">
              Github
            </Tag>{" "}
            <Tag color={"red"} defaultChecked size="small" variant="outlined">
              QQ
            </Tag>
            <Tag color={"red"} defaultChecked size="small" variant="outlined">
              Gmail
            </Tag>
            的账号注册 ，谢谢🙏
          </Paragraph>
          <Paragraph>
            9.为了维持转发服务正常使用，将不定期清除非法用户（包括重复注册等任何形式的小号）；请使用真实邮箱注册
          </Paragraph>
          <Paragraph>
            10.受供应商和OpenAI政策影响，价格会随时调整，
            （模型计费详情请查看下方表格）
          </Paragraph>
        </Typography>

        <Typography>
          <Title level={3}>使用方法</Title>
          <Paragraph>
            1.注册完成后，创建一个令牌，复制令牌的 key 填写到对应的地方
          </Paragraph>
          <Paragraph>
            2.接口转发地址请修改为：
            <Text
              style={{
                margin: "0 5px",
              }}
              copyable
            >
              https://api.wochirou.com
            </Text>
            即可使用
          </Paragraph>
          <Paragraph>
            3.严令禁止使用api进行非法行为。系统每隔一段时间会定时清理日志记录，请知悉。
          </Paragraph>
        </Typography>
      </Row>
    </Card>
  );
};

export default Index;
