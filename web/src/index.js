import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';
import 'semantic-ui-offline/semantic.min.css';
import './index.css';
import { UserProvider } from './context/User';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StatusProvider } from './context/Status';
import { Layout } from 'antd';
import SiderBar from './components/SiderBar';

// initialization

const root = ReactDOM.createRoot(document.getElementById('root'));
const { Sider, Content, Header } = Layout;
root.render(
  <React.StrictMode>
    <StatusProvider>
      <UserProvider>
        <BrowserRouter>
          <Layout 	
		  	style={{width: '100vw', height: '100vh', position: "relative"}}>
						<Header style={
							{
								width: "100%",
								height: '64px',
								flex: 1,
							}
			}>
				{/*<HeaderBar />*/}
				<div className="demo-logo" />
				<SiderBar />
			</Header>
				<Content
					style={{
						padding: '24px',
						background: "#ffffff",
						width: '100%',
						height: '100%',
								overflow: "scroll",
					}}
				>
					<App />
							
				</Content>
<Layout.Footer style={
								{
								width: "100%",
									height: '64px',
								flex: 1,
							}
					}>
						<Footer></Footer>
					</Layout.Footer>
		</Layout>
		<ToastContainer />
        </BrowserRouter>
      </UserProvider>
    </StatusProvider>
  </React.StrictMode>,
);
