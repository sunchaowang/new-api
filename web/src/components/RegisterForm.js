import React, { useEffect, useState } from 'react';
import {
  Grid,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react';
import {
  Form,
  Card,
  Button, Space,
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { Link, useNavigate } from 'react-router-dom';
import { API, getLogo, showError, showInfo, showSuccess } from '../helpers';
import Turnstile from 'react-turnstile';

const RegisterForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    verification_code: '',
  });
  const { username, password, password2 } = inputs;
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const logo = getLogo();
  let affCode = new URLSearchParams(window.location.search).get('aff');
  if (affCode) {
    localStorage.setItem('aff', affCode);
  }

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setShowEmailVerification(status.email_verification);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  });

  let navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    console.log(name, value);
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (password.length < 8) {
      showInfo('密码长度不得小于 8 位！');
      return;
    }
    if (password !== password2) {
      showInfo('两次输入的密码不一致');
      return;
    }
    if (username && password) {
      if (turnstileEnabled && turnstileToken === '') {
        showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
        return;
      }
      setLoading(true);
      if (!affCode) {
        affCode = localStorage.getItem('aff');
      }
      inputs.aff_code = affCode;
      const res = await API.post(
        `/api/user/register?turnstile=${turnstileToken}`,
        inputs,
      );
      const { success, message } = res.data;
      if (success) {
        navigate('/login');
        showSuccess('注册成功！');
      } else {
        showError(message);
      }
      setLoading(false);
    }
  }

  const sendVerificationCode = async () => {
    if (inputs.email === '') return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setLoading(true);
    const res = await API.get(
      `/api/verification?email=${inputs.email}&turnstile=${turnstileToken}`,
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess('验证码发送成功，请检查你的邮箱！');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  return (
    <Card >
      <Title heading={2} style={{ textAlign: 'center' }}>
        新用户注册
      </Title>
      <Form size='large'>
          <Form.Input
            icon='user'
            iconPosition='left'
            placeholder='输入用户名，最长 12 位'
            onChange={handleChange}
            name='username'
            autoComplete={false}
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            placeholder='输入密码，最短8位，最长20位'
            onChange={handleChange}
            name='password'
            type='password'
            autoComplete={false}
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            placeholder='输入密码，最短8位，最长20位'
            onChange={handleChange}
            name='password2'
            type='password'
            autoComplete={false}
          />
          {showEmailVerification ? (
            <>
              <Space style={{width: '100%'}}>
                <Form.Input
                  icon='mail'
                  iconPosition='left'
                  placeholder='输入邮箱地址'
                  onChange={handleChange}
                  name='email'
                  type='email'
                />
                <Button onClick={sendVerificationCode} disabled={loading}>
                  获取验证码
                </Button>
              </Space>

              <Form.Input
                icon='lock'
                iconPosition='left'
                placeholder='输入验证码'
                onChange={handleChange}
                name='verification_code'
              />
            </>
          ) : (
            <></>
          )}
          {turnstileEnabled ? (
            <Turnstile
              sitekey={turnstileSiteKey}
              onVerify={(token) => {
                setTurnstileToken(token);
              }}
            />
          ) : (
            <></>
          )}
          <Button
            type={'primary'}
            theme='solid'
            style={{ width: '100%' }}
            size='large'
            onClick={handleSubmit}
            loading={loading}
          >
            注册
          </Button>
      </Form>
      <Card bordered={false}>
        已有账户？
        <Link to='/login' className='btn btn-link'>
          点击登录
        </Link>
      </Card>
    </Card>
  );
};

export default RegisterForm;
