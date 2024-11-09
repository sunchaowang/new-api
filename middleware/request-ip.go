package middleware

import (
	"context"
	"github.com/gin-gonic/gin"
	"one-api/common"
)

func RequestIP() func(c *gin.Context) {
	return func(c *gin.Context) {
		c.Set(common.RequestIPKey, c.ClientIP())
		ctx := context.WithValue(c.Request.Context(), common.RequestIdKey, c.ClientIP())
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}
