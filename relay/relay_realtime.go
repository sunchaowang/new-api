package relay

import (
	"net/http"
	"one-api/common/requester"
	"one-api/dto"
	relaycommon "one-api/relay/common"
	"one-api/service"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type RelayModeChatRealtime struct {
	userConn       *websocket.Conn
	messageHandler requester.MessageHandler
	providerConn   *websocket.Conn
	quota          *relay_util.Quota
	usage          *types.UsageEvent
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	Subprotocols: []string{"realtime"},
}

func RealtimeHelper(c *gin.Context, relayMode int) *dto.OpenAIErrorWithStatusCode {
	relayInfo := relaycommon.GenRelayInfo(c)

	_, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return service.OpenAIErrorWrapperLocal(err, "upgrade_to_websocket_failed", http.StatusInternalServerError)
	}

	return nil
}
