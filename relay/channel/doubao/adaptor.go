package doubao

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"one-api/dto"
	"one-api/relay/channel"
	"one-api/relay/channel/openai"
	relaycommon "one-api/relay/common"
	relayconstant "one-api/relay/constant"

	"github.com/gin-gonic/gin"
)

type Adaptor struct {
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
}

func (a *Adaptor) GetRequestURL(info *relaycommon.RelayInfo) (string, error) {
	switch info.RelayMode {
	case relayconstant.RelayModeChatCompletions:
		return fmt.Sprintf("%s/api/v3/chat/completions", info.BaseUrl), nil
	case relayconstant.RelayModeEmbeddings:
		return fmt.Sprintf("%s/api/v3/embeddings", info.BaseUrl), nil
	default:
	}
	return "", fmt.Errorf("unsupported relay mode %d for doubao", info.RelayMode)
}

func (a *Adaptor) SetupRequestHeader(c *gin.Context, req *http.Header, info *relaycommon.RelayInfo) error {
	channel.SetupApiRequestHeader(info, c, req)
	req.Set("Authorization", "Bearer "+info.ApiKey)
	return nil
}

func (a *Adaptor) ConvertRequest(c *gin.Context, info *relaycommon.RelayInfo, request *dto.GeneralOpenAIRequest) (any, error) {
	if request == nil {
		return nil, errors.New("request is nil")
	}

	// Create a copy of the request
	requestCopy := *request

	endpoint := ModelEndpoint[info.UpstreamModelName]
	if endpoint == "" {
		return nil, fmt.Errorf("unsupported model %s for doubao", info.UpstreamModelName)
	}

	requestCopy.Model = endpoint
	//requestCopy.OriginModelName = info.UpstreamModelName
	return &requestCopy, nil
}

func (a *Adaptor) ConvertRerankRequest(c *gin.Context, relayMode int, request dto.RerankRequest) (any, error) {
	return nil, nil
}

func (a *Adaptor) DoRequest(c *gin.Context, info *relaycommon.RelayInfo, requestBody io.Reader) (any, error) {
	return channel.DoApiRequest(a, c, info, requestBody)
}

func (a *Adaptor) DoResponse(c *gin.Context, resp *http.Response, info *relaycommon.RelayInfo) (usage any, err *dto.OpenAIErrorWithStatusCode) {
	switch info.RelayMode {
	case relayconstant.RelayModeChatCompletions:
		if info.IsStream {
			err, usage = openai.OaiStreamHandler(c, resp, info)
		} else {
			err, usage = openai.OpenaiHandler(c, resp, info.PromptTokens, info.UpstreamModelName)
		}
	case relayconstant.RelayModeEmbeddings:
		err, usage = openai.OpenaiHandler(c, resp, info.PromptTokens, info.UpstreamModelName)
	}
	return
}

func (a *Adaptor) GetModelList() []string {
	return ModelList
}

func (a *Adaptor) GetChannelName() string {
	return ChannelName
}
