import React, {createElement, useEffect, useState} from 'react';
import { API, isMobile, showError, showInfo, showSuccess } from '../../helpers';
import {
  renderNumber,
  renderQuota,
  renderQuotaWithAmount,
} from '../../helpers/render';
import {
  Col,
  Layout,
  Row,
  Typography,
  Card,
  Button,
  Form,
  Divider,
  Space,
  Modal,
  Toast,
  Icon,
  Tag, Descriptions,
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { Decimal } from 'decimal.js';

const TopUp = () => {
  const [redemptionCode, setRedemptionCode] = useState('');
  const [topUpCode, setTopUpCode] = useState('');
  const [topUpCount, setTopUpCount] = useState(0);
  const [topUpCountDiscount, setTopUpCountDiscount] = useState(1);
  const [minTopupCount, setMinTopUpCount] = useState(1);
  const [amount, setAmount] = useState(0.0);
  const [payMoney, setPayMoney] = useState(0.0);
  const [payMoneyFee, setPayMoneyFee] = useState(0.0);
  const [topUpRate, setTopUpRate] = useState(0.0);
  const [minTopUp, setMinTopUp] = useState(1);
  const [topUpLink, setTopUpLink] = useState('');
  const [enableOnlineTopUp, setEnableOnlineTopUp] = useState(false);
  const [userQuota, setUserQuota] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [payWay, setPayWay] = useState('');

  const topUp = async () => {
    if (redemptionCode === '') {
      showInfo('请输入兑换码！');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.post('/api/user/topup', {
        key: redemptionCode,
      });
      const { success, message, data } = res.data;
      if (success) {
        showSuccess('兑换成功！');
        Modal.success({
          title: '兑换成功！',
          content: '成功兑换额度：' + renderQuota(data),
          centered: true,
        });
        setUserQuota((quota) => {
          return quota + data;
        });
        setRedemptionCode('');
      } else {
        showError(message);
      }
    } catch (err) {
      showError('请求失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTopUpLink = () => {
    if (!topUpLink) {
      showError('超级管理员未设置充值链接！');
      return;
    }
    window.open(topUpLink, '_blank');
  };

  const preTopUp = async (payment) => {
    if (!enableOnlineTopUp) {
      showError('管理员未开启在线充值！');
      return;
    }
    await getAmount();
    if (topUpCount < minTopUp) {
      showError('充值数量不能小于' + minTopUp);
      return;
    }
    setPayWay(payment);
    setOpen(true);
  };

  const onlineTopUp = async () => {
    if (amount === 0) {
      await getAmount();
    }
    if (topUpCount < minTopUp) {
      showError('充值数量不能小于' + minTopUp);
      return;
    }
    setOpen(false);
    try {
      const res = await API.post('/api/user/pay', {
        amount: parseInt(topUpCount),
        top_up_code: topUpCode,
        payment_method: payWay,
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        // showInfo(message);
        if (message === 'success') {
          let params = data;
          let url = res.data.url;
          let form = document.createElement('form');
          form.action = url;
          form.method = 'POST';
          // 判断是否为safari浏览器
          let isSafari =
            navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') < 1;
          if (!isSafari) {
            form.target = '_blank';
          }
          for (let key in params) {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          showError(data);
          // setTopUpCount(parseInt(res.data.count));
          // setAmount(parseInt(data));
        }
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const getUserQuota = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      setUserQuota(data.quota);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      if (status.top_up_link) {
        setTopUpLink(status.top_up_link);
      }
      if (status.min_topup) {
        setMinTopUp(status.min_topup);
      }
      if (status.enable_online_topup) {
        setEnableOnlineTopUp(status.enable_online_topup);
      }
    }
    getUserQuota().then();
  }, []);

  const renderPayMoney = () => {
    // console.log(amount);
    return new Decimal(amount).add(payMoneyFee).mul(topUpCountDiscount).toNumber() + '元';
  };

  const renderTopUpRate = () => {
    // console.log(amount);
    return new Decimal(topUpRate).toNumber() + '%';
  };


  const getAmount = async (value) => {
    if (value === undefined) {
      value = topUpCount;
    }
    try {
      const res = await API.post('/api/user/amount', {
        amount: parseFloat(value),
        top_up_code: topUpCode,
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        // showInfo(message);
        if (message === 'success') {
          setAmount(parseFloat(data.amount));
          setPayMoney(parseFloat(data.payMoney));
          setTopUpRate(parseFloat(data.topUpRate));
          setPayMoneyFee(parseFloat(data.payMoneyFee));
        } else {
          setAmount(0);
          setTopUpRate(0);
          setPayMoneyFee(0);
          Toast.error({ content: '错误：' + data, id: 'getAmount' });
          // setTopUpCount(parseInt(res.data.count));
          // setAmount(parseInt(data));
        }
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="确定要充值吗"
        visible={open}
        onOk={onlineTopUp}
        onCancel={handleCancel}
        maskClosable={false}
        size={'small'}
        centered={true}
      >
        <p>充值数量：{topUpCount}</p>
        <p>预计支付金额：{renderPayMoney()}</p>
        <p>是否确认充值？</p>
      </Modal>
      <Card
        title="我的钱包"
        style={{
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Row>
          <Col>
            <Card
              title="余额"
              bordered={false}
              style={{ width: '100%' }}
              headerLine={false}
              headerStyle={{ paddingLeft: 0, paddingRight: 0 }}
              bodyStyle={{ padding: 0 }}
            >
              <Title>{renderQuota(userQuota)}</Title>
            </Card>
          </Col>
        </Row>
        <Divider
          style={{
            marginTop: 20,
          }}
        />
        <Row gutter={16}>
          <Col span={24} md={24} sm={24} xs={24} lg={24} xl={12}>
            <Card
              style={{ width: '100%' }}
              title="在线充值"
              bordered={false}
              headerLine={false}
              headerStyle={{ paddingLeft: 0, paddingRight: 0 }}
              bodyStyle={{ padding: 0 }}
            >
              <Form>
                <Form.Select
                  disabled={!enableOnlineTopUp}
                  field={'redemptionCount'}
                  label={'充值数量'}
                  placeholder={'充值数量，最低 ' + renderQuotaWithAmount(minTopUp)}
                  name="redemptionCount"
                  type={'number'}
                  value={topUpCount}
                  onChange={async (value) => {
                    const topUpValue = JSON.parse(value);
                    console.log('topup value', topUpValue);
                    // if (topUpValue[0] < 1) {
                    //   topUpValue[0] = 1;
                    // }
                    setTopUpCount(topUpValue[0]);
                    setTopUpCountDiscount(topUpValue[1]);
                    await getAmount(topUpValue[0]);
                  }}
                  style={{
                    width: '100%',
                  }}
                >
                  {[
                    {
                      label: '$5',
                      value: [5, 1],
                    },
                    {
                      label: '$10',
                      value: [10, 1],
                    },
                    {
                      label: '$20',
                      value: [20, 1],
                    },
                    {
                      label: '$50',
                      value: [50, 1],
                    },
                    {
                      label: '$100',
                      value: [100, 1],
                    },
                    {
                      label: '$250',
                      value: [250, 1],
                    },
                    {
                      label: '$500',
                      value: [500, 1],
                    },
                  ].map((item) => {
                    return (
                      <Form.Select.Option key={item.value[0]} value={JSON.stringify(item.value)}>
                        {item.label}
                        {item.value[1] < 1 ? (
                          <Tag style={{ marginLeft: 16 }} size="small" color="red">
                            {'(' + item.value[1] + '折)'}
                          </Tag>
                        ) : (
                          ''
                        )}
                      </Form.Select.Option>
                    );
                  })}
                </Form.Select>

                <Space>
                  <Button
                    type={'primary'}
                    theme={'solid'}
                    onClick={async () => {
                      preTopUp('zfb');
                    }}
                  >
                    <Space spacing={8}>
                      <i className="bi bi-alipay"></i>
                      支付宝
                    </Space>
                  </Button>
                  <Button
                    style={{
                      backgroundColor: 'rgba(var(--semi-green-5), 1)',
                    }}
                    type={'primary'}
                    theme={'solid'}
                    onClick={async () => {
                      preTopUp('wx');
                    }}
                  >
                    <Space spacing={8}>
                      <i className="bi bi-wechat"></i>
                      微信
                    </Space>
                  </Button>
                </Space>
                {/*Descriptions*/}
                {
                  amount > 0 ? (
                      <Descriptions style={{marginTop: 20}}>
                        <Descriptions.Item itemKey="预计支付金额">{ renderPayMoney() }</Descriptions.Item>
                        <Descriptions.Item itemKey="本次充值费率">{ renderTopUpRate() }</Descriptions.Item>
                        <Descriptions.Item itemKey="本次优惠金额">0元</Descriptions.Item>
                      </Descriptions>
                  ) : null
                }
              </Form>
            </Card>
          </Col>
          <Col span={24} md={24} sm={24} xs={24} lg={24} xl={12}>
            <Card
              style={{ width: '100%' }}
              title="兑换码充值"
              bordered={false}
              headerLine={false}
              headerStyle={{ paddingLeft: 0, paddingRight: 0 }}
              bodyStyle={{ padding: 0 }}
            >
              <Form>
                <Form.Input
                  field={'redemptionCode'}
                  label={'兑换码'}
                  placeholder="兑换码"
                  name="redemptionCode"
                  value={redemptionCode}
                  onChange={(value) => {
                    setRedemptionCode(value);
                  }}
                />
                <Space>
                  {topUpLink ? (
                    <Button type={'primary'} theme={'solid'} onClick={openTopUpLink}>
                      获取兑换码
                    </Button>
                  ) : null}
                  <Button type={'warning'} theme={'solid'} onClick={topUp} disabled={isSubmitting}>
                    {isSubmitting ? '兑换中...' : '兑换'}
                  </Button>
                </Space>
              </Form>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default TopUp;
