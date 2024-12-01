package service

import (
	"net/http"
	"one-api/common"
	"time"
)

var httpClient *http.Client
var impatientHTTPClient *http.Client

func init() {
	trans := &http.Transport{
		DialContext: common.Socks5ProxyFunc,
		Proxy:       common.ProxyFunc,
	}

	if common.RelayTimeout == 0 {
		httpClient = &http.Client{
			Transport: trans,
		}
	} else {
		httpClient = &http.Client{
			Transport: trans,
			Timeout:   time.Duration(common.RelayTimeout) * time.Second,
		}
	}

	impatientHTTPClient = &http.Client{
		Timeout: 5 * time.Second,
	}
}

func GetHttpClient() *http.Client {
	return httpClient
}

func GetImpatientHttpClient() *http.Client {
	return impatientHTTPClient
}
