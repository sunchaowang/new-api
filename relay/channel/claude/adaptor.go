package claude

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"one-api/dto"
	"one-api/relay/channel"
	relaycommon "one-api/relay/common"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	RequestModeCompletion = 1
	RequestModeMessage    = 2

	ResponseFormatOpenAI = "openai"
	ResponseFormatClaude = "claude"
)

type Adaptor struct {
	RequestMode int
}

func (a *Adaptor) ConvertAudioRequest(c *gin.Context, info *relaycommon.RelayInfo, request dto.AudioRequest) (io.Reader, error) {
	//TODO implement me
	return nil, errors.New("not implemented")
}

func (a *Adaptor) ConvertImageRequest(c *gin.Context, info *relaycommon.RelayInfo, request dto.ImageRequest) (any, error) {
	//TODO implement me
	return nil, errors.New("not implemented")
}

func (a *Adaptor) Init(info *relaycommon.RelayInfo) {
	if strings.HasPrefix(info.UpstreamModelName, "claude-3") {
		a.RequestMode = RequestModeMessage
	} else {
		a.RequestMode = RequestModeCompletion
	}
}

func (a *Adaptor) GetRequestURL(info *relaycommon.RelayInfo) (string, error) {
	if a.RequestMode == RequestModeMessage {
		return fmt.Sprintf("%s/v1/messages", info.BaseUrl), nil
	} else {
		return fmt.Sprintf("%s/v1/complete", info.BaseUrl), nil
	}
}

func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Header, info *relaycommon.RelayInfo) error {
	channel.SetupApiRequestHeader(info, c, req)
	req.Set("x-api-key", info.ApiKey)
	anthropicVersion := c.Request.Header.Get("anthropic-version")
	if anthropicVersion == "" {
		anthropicVersion = "2023-06-01"
	}
	req.Set("anthropic-version", anthropicVersion)
	return nil
}

func (a *Adaptor) ConvertRequest(c *gin.Context, info *relaycommon.RelayInfo, request *dto.GeneralOpenAIRequest) (any, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}
	if a.RequestMode == RequestModeCompletion {
		return RequestOpenAI2ClaudeComplete(*request), nil
	} else {
		return RequestOpenAI2ClaudeMessage(*request)
	}
}

func (a *Adaptor) ConvertRerankRequest(c *gin.Context, relayMode int, request dto.RerankRequest) (any, error) {
	return nil, nil
}

func (a *Adaptor) DoRequest(c *gin.Context, info *relaycommon.RelayInfo, requestBody io.Reader) (any, error) {
	return channel.DoApiRequest(a, c, info, requestBody)
}

func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, info *relaycommon.RelayInfo) (usage any, err *dto.OpenAIErrorWithStatusCode) {
	// 获取响应格式，默认为 OpenAI 格式
	var format = ResponseFormatOpenAI;
	if info.UseClaudeFormate {
		format = ResponseFormatClaude;
	}

	if info.IsStream {
		if format == ResponseFormatClaude {
			// 直接转发 Claude 的流式响应
			err, usage = ClaudeStreamHandlerRaw(c, resp, info)
		} else {
			// 转换为 OpenAI 格式
			err, usage = ClaudeStreamHandler(c, resp, info, a.RequestMode)
		}
	} else {
		if format == ResponseFormatClaude {
			// 直接转发 Claude 的响应
			err, usage = ClaudeHandlerRaw(c, resp, info)
		} else {
			// 转换为 OpenAI 格式
			err, usage = ClaudeHandler(c, resp, a.RequestMode, info)
		}
	}
	return
}

func (a *Adaptor) GetModelList() []string {
	return ModelList
}

func (a *Adaptor) GetChannelName() string {
	return ChannelName
}
