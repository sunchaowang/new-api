import React, { useContext, useEffect, useState } from 'react';
import { Modal } from '@douyinfe/semi-ui';
import { API, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { marked } from 'marked';
import HomeContent from "./HomeContent.js";

const Home = () => {
  const [statusState] = useContext(StatusContext);
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');

  const displayNotice = async () => {
    const res = await API.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      let oldNotice = '' //localStorage.getItem('notice');
      if (data !== oldNotice && data !== '') {
        const htmlNotice = marked(data);
        setHomePageContent(htmlNotice)
        setHomePageContentLoaded(true);
        // showNotice(htmlNotice, true);
        localStorage.setItem('notice', data);
      }
    } else {
      showError(message);
    }
  };

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const getStartTimeString = () => {
    const timestamp = statusState?.status?.start_time;
    return statusState.status ? timestamp2string(timestamp) : '';
  };

  useEffect(() => {
    displayNotice().finally();
    // displayHomePageContent().then();
  }, []);
  return (
    <>
      <HomeContent />
    </>
  );
};

export default Home;
