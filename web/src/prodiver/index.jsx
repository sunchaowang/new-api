// Entry component
import { App } from 'antd';

let message;
let notification;
let modal;

export default function Index({ children }) {
  const staticFunction = App.useApp();
  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;
  return <>{children}</>;
}

export { message, notification, modal };
