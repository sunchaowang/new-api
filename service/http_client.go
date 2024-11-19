package service

import (
	"fmt"
	"net/http"
	"net/url"
	"one-api/common"
	"time"
)

var httpClient *http.Client
var impatientHTTPClient *http.Client

// ProxyConfig 代理配置结构体
type ProxyConfig struct {
	Protocol string
	Server   string
	Port     int
	Username string
	Password string
	UDP      bool
}

func init() {
	// 默认客户端
	httpClient = createHTTPClientWithProxy(nil)

	// 快速超时客户端
	impatientHTTPClient = &http.Client{
		Timeout: 5 * time.Second,
	}
}

// createHTTPClientWithProxy 创建带代理的 HTTP 客户端
func createHTTPClientWithProxy(proxyConfig *ProxyConfig) *http.Client {
	transport := &http.Transport{}

	// 如果提供了代理配置
	if proxyConfig != nil {
		// 构建代理 URL
		proxyURL, err := url.Parse(fmt.Sprintf("%s://%s:%d",
			proxyConfig.Protocol,
			proxyConfig.Server,
			proxyConfig.Port,
		))

		// 如果有用户名密码，添加认证
		if proxyConfig.Username != "" && proxyConfig.Password != "" {
			proxyURL.User = url.UserPassword(proxyConfig.Username, proxyConfig.Password)
		}

		if err == nil {
			transport.Proxy = http.ProxyURL(proxyURL)
		}
	}

	// 设置超时
	client := &http.Client{
		Transport: transport,
		Timeout:   5 * time.Second,
	}

	return client
}

func GetHttpClient(proxyAddr string) *http.Client {
	if len(proxyAddr) > 0 {
		common.SysLog(fmt.Sprintf("parse proxy url: %v", proxyAddr))
		proxyURL, err := url.Parse(proxyAddr)
		if err != nil {
			common.SysError(fmt.Sprintf("parse proxy url error: %v", err))
			return httpClient
		}

		transport := &http.Transport{
			Proxy: http.ProxyURL(proxyURL),
		}

		return &http.Client{
			Transport: transport,
			Timeout:   5 * time.Second,
		}
	}
	return httpClient
}

func GetImpatientHttpClient() *http.Client {
	return impatientHTTPClient
}
