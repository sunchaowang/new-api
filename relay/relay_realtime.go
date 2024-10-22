package relay

import (
	"fmt"
	"net/http"
	"one-api/dto"
	"one-api/service"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	Subprotocols: []string{"realtime"},
}

func RealtimeHelper(c *gin.Context, relayMode int) *dto.OpenAIErrorWithStatusCode {
	modelName := c.Query("model")
	if modelName == "" {
		return service.OpenAIErrorWrapperLocal(fmt.Errorf("model_name_required"), "model_name_required", http.StatusInternalServerError)
	}

	// _relayInfo := relaycommon.GenRelayInfo(c)

	// userConn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	// if err != nil {
	// 	return service.OpenAIErrorWrapperLocal(err, "upgrade_to_websocket_failed", http.StatusInternalServerError)
	// }

	return nil
}
