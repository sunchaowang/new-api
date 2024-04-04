export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        const newRequest = new Request(`https://api.wochirou.com/api/${url.pathname}>`, request);
        const response = await fetch(newRequest);
        return response;
      }
      return env.ASSETS.fetch(request);
    },
}