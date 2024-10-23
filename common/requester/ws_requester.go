package requester

import (
	"errors"
	"net/http"
	"one-api/common"
	"one-api/dto"

	"github.com/gorilla/websocket"
)

type WSRequester struct {
	WSClient *websocket.Dialer
}

type streamable interface {
	any
}
type HandlerPrefix[T streamable] func(rawLine *[]byte, dataChan chan T, errChan chan error)

func NewWSRequester(proxyAddr string) *WSRequester {
	return &WSRequester{
		WSClient: GetWSClient(proxyAddr),
	}
}

func (w *WSRequester) NewRequest(url string, header http.Header) (*websocket.Conn, error) {
	conn, resp, err := w.WSClient.Dial(url, header)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusSwitchingProtocols {
		return nil, errors.New("ws unexpected status code")
	}

	return conn, nil
}

func SendWSJsonRequest[T streamable](conn *websocket.Conn, data any, handlerPrefix HandlerPrefix[T]) (*wsReader[T], *dto.OpenAIErrorWithStatusCode) {
	err := conn.WriteJSON(data)
	if err != nil {
		return nil, .OpenAIErrorWrapperLocal(err, "ws_request_failed", http.StatusInternalServerError)
	}

	stream := &wsReader[T]{
		reader:        conn,
		handlerPrefix: handlerPrefix,

		DataChan: make(chan T),
		ErrChan:  make(chan error),
	}

	return stream, nil
}

// 设置请求头
func (w *WSRequester) WithHeader(headers map[string]string) http.Header {
	header := make(http.Header)
	for k, v := range headers {
		header.Set(k, v)
	}
	return header
}
