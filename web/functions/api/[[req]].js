export async function onRequest(context) {
  // 目标API的URL
  const targetUrl = 'https://api.wochirou.com';

  // 获取原始请求的信息
  const { request } = context;
  const url = new URL(request.url);

  // 提取原始请求中的Cookie头
  const cookies = request.headers.get('Cookie');

  // 创建新的请求URL
  const newUrl = `${targetUrl}${url.pathname}`;
  console.log('newUrl, ', newUrl);

  // 准备新请求的头部，包括原始请求中的Cookies
  const newHeaders = new Headers(request.headers);
  if (cookies) {
    newHeaders.set('Cookie', cookies);
  }

  // 创建新的请求对象，包含新的头部（可能包括Cookies）
  const newRequestInit = {
    method: request.method, // 保持原始请求的方法
    headers: newHeaders,
    body: request.body, // 保持原始请求的body，对于POST请求等可能含有有效负载的情况
    redirect: 'follow' // 根据需要处理重定向
  };

  // 创建并发送新请求
  const response = await fetch(newUrl, newRequestInit);

  // 返回目标API的响应
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
