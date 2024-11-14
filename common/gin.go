package common

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	"github.com/gin-gonic/gin"
)

const KeyRequestBody = "key_request_body"

func GetRequestBody(c *gin.Context) ([]byte, error) {
	requestBody, _ := c.Get(KeyRequestBody)
	if requestBody != nil {
		return requestBody.([]byte), nil
	}
	requestBody, err := io.ReadAll(c.Request.Body)
	if err != nil {
		return nil, err
	}
	_ = c.Request.Body.Close()
	c.Set(KeyRequestBody, requestBody)
	// 获取requestBody 上的model
	var jsonData map[string]interface{}
	if err := json.Unmarshal(requestBody.([]byte), &jsonData); err == nil {
		if model, exists := jsonData["model"]; exists {
			fmt.Println("model", model)
		}
	}
	return requestBody.([]byte), nil
}

func UnmarshalBodyReusable(c *gin.Context, v any) error {
	requestBody, err := GetRequestBody(c)
	if err != nil {
		return err
	}
	contentType := c.Request.Header.Get("Content-Type")
	if strings.HasPrefix(contentType, "application/json") {
		err = json.Unmarshal(requestBody, &v)
	} else {
		// skip for now
		// TODO: someday non json request have variant model, we will need to implementation this
	}
	if err != nil {
		return err
	}
	// Reset request body
	c.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody))
	return nil
}
