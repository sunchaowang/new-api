export async function onRequest(context) {
    // 目标API的URL
    const targetUrl = 'http://35.236.93.91:3000/api';
  
    // 获取原始请求的信息
    const { request } = context;
    const url = new URL(request.url);
  
    // 创建新的请求URL
    const newUrl = `${targetUrl}${url.pathname}`;
  
    // 创建并发送新请求
    const response = await fetch(newUrl, request);
  
    // 返回目标API的响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }
  