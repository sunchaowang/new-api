import { Segmented, Space } from 'antd';
import { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';

function Index() {
  const [tabSelected, setTabSelected] = useState('login');

  return (
    <>
      <Space direction={'vertical'} style={{ width: '100%' }} size={20}>
        <Segmented
          options={[
            {
              label: '登录',
              value: 'login',
            },
            {
              label: '注册',
              value: 'register',
            },
          ]}
          value={tabSelected}
          onChange={(v) => setTabSelected(v)}
          size={'large'}
          block={true}
        ></Segmented>
        {tabSelected === 'login' && <LoginForm></LoginForm>}
        {tabSelected === 'register' && <RegisterForm></RegisterForm>}
      </Space>
    </>
  );
}

export default Index;
