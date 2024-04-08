export async function onRequest(context) {
  // 目标API的URL
  const targetUrl =  context.env.TARGET_URL ||  "https://openai-replay.wochirou.com";
 
  // 获取原始请求的信息
  const { request } = context;
  const url = new URL(request.url);

  // 创建新的请求URL，包括查询字符串
  // `url.search` 包含了原始URL中的查询参数，如"?key=value"
  const newUrl = `${targetUrl}${url.pathname}${url.search || ''}`;
  console.log('newUrl, ', newUrl);

  // 提取原始请求中的Cookie头
  const cookies = request.headers.get('Cookie');

  // 准备新请求的头部，包括原始请求中的Cookies
  const newHeaders = new Headers(request.headers);
  if (cookies) {
    newHeaders.set('Cookie', cookies);
  }

  // 创建新的请求对象，包含新的头部（可能包括Cookies）和方法
  const newRequestInit = {
    method: request.method, // 保持原始请求的方法
    headers: newHeaders,
    body: request.method !== 'GET' ? request.body : undefined, // GET请求没有body
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
