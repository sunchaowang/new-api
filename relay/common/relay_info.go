package common

import (
	"one-api/common"
	"one-api/relay/constant"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type RelayInfo struct {
	ChannelType       int
	ChannelId         int
	TokenId           int
	UserId            int
	Group             string
	TokenUnlimited    bool
	StartTime         time.Time
	ApiType           int
	IsStream          bool
	RelayMode         int
	UpstreamModelName string
	RequestURLPath    string
	ApiVersion        string
	PromptTokens      int
	ApiKey            string
	Organization      string
	BaseUrl           string
}

func GenRelayInfo(c *gin.Context) *RelayInfo {
	channelType := c.GetInt("channel")
	channelId := c.GetInt("channel_id")

	tokenId := c.GetInt("token_id")
	userId := c.GetInt("id")
	group := c.GetString("group")
	tokenUnlimited := c.GetBool("token_unlimited_quota")
	startTime := time.Now()

	apiType := constant.ChannelType2APIType(channelType)

	info := &RelayInfo{
		RelayMode:      constant.Path2RelayMode(strings.Replace(c.Request.URL.Path, "/api/v1", "/v1", 1)),
		BaseUrl:        c.GetString("base_url"),
		RequestURLPath: strings.Replace(c.Request.URL.Path, "/api/v1", "/v1", 1),
		ChannelType:    channelType,
		ChannelId:      channelId,
		TokenId:        tokenId,
		UserId:         userId,
		Group:          group,
		TokenUnlimited: tokenUnlimited,
		StartTime:      startTime,
		ApiType:        apiType,
		ApiVersion:     c.GetString("api_version"),
		ApiKey:         strings.TrimPrefix(c.Request.Header.Get("Authorization"), "Bearer "),
		Organization:   c.GetString("channel_organization"),
	}
	if info.BaseUrl == "" {
		info.BaseUrl = common.ChannelBaseURLs[channelType]
	}
	if info.ChannelType == common.ChannelTypeAzure {
		info.ApiVersion = GetAPIVersion(c)
	}
	return info
}

func (info *RelayInfo) SetPromptTokens(promptTokens int) {
	info.PromptTokens = promptTokens
}

func (info *RelayInfo) SetIsStream(isStream bool) {
	info.IsStream = isStream
}
