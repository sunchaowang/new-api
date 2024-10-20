import React, { useEffect, useState ,useContext} from 'react';
import Turnstile from 'react-turnstile';
import { Typography, Modal, Button, Space, Spin } from '@douyinfe/semi-ui';

import { showError, showSuccess, showInfo, API } from '../helpers';
import { StatusContext } from '../context/Status';

export default function CheckInModal(props) {
  const [statusState, statusDispatch] = useContext(StatusContext);

  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [checkinLoading, setCheckinLoading] = useState(false);

  useEffect(() => {
    if (statusState?.status?.turnstile_check) {
      setTurnstileEnabled(true);
      setTurnstileSiteKey(statusState?.status?.turnstile_site_key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusState.status]);

  const handleTurnStileOnLoad = (widgetId, bound) => {
    // before:
    window.turnstile.execute(widgetId);
    // now:
    bound.execute();
    setTurnstileLoaded(true);
  };

  // 签到
  const handleUserOperationCheckIn = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    // TODO
    // showInfo('签到系统正在维护中！');
    // return;
    setCheckinLoading(true);
    try {
      let res = await API.post(`/api/operation/checkin?turnstile=${turnstileToken}`);
      const { success, message } = res.data;
      if (success) {
        showSuccess(message);
        handleClose();
        if (props.loadUser) {
          props.loadUser();
        }
        if (props.callback) {
          props.callback();
        }
      } else {
        showError(message);
      }
      setCheckinLoading(false);
    } catch (error) {
      setCheckinLoading(false);
      return;
    }
  };

  function handleClose() {
    props?.onClose?.();
  }

  function afterClose() {
    setTurnstileToken('');
    setCheckinLoading(false);
  }

  return (
    <Modal
      visible={props.visible}
      maskClosable={false}
      onCancel={handleClose}
      footer={[
        <Button type={'default'} onClick={() => handleClose()}>
          取消
        </Button>,
        <Button
          type={'primary'}
          theme={'solid'}
          disabled={!turnstileToken}
          loading={checkinLoading}
          onClick={() => handleUserOperationCheckIn()}
          type={turnstileEnabled ? 'primary' : 'default'}
        >
          立即签到
        </Button>,
      ]}
      afterClose={afterClose}
      destroyOnClose
      title="正在检查用户环境"
    >
      <Space vertical size={16}>
        <Typography>
          温馨提示：每日签到获得的额度以前一日的总消耗额度为基础获得随机返赠🤓
        </Typography>
        {turnstileEnabled ? (
          <Spin spinning={!turnstileLoaded}>
            <div style={{ width: 300, height: 65 }}>
              <Turnstile
                sitekey={turnstileSiteKey}
                onVerify={(token) => {
                  setTurnstileToken(token);
                }}
                onLoad={handleTurnStileOnLoad}
                executution="execute"
              />
            </div>
          </Spin>
        ) : (
          <Spin>
            <div style={{ width: 300, height: 65 }}></div>
          </Spin>
        )}
      </Space>
    </Modal>
  );
}
