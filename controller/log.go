package controller

import (
	"net/http"
	"one-api/common"
	"one-api/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllLogs(c *gin.Context) {
	p, _ := strconv.Atoi(c.Query("p"))
	pageSize, _ := strconv.Atoi(c.Query("page_size"))
	if p < 1 {
		p = 1
	}
	if pageSize < 0 {
		pageSize = common.ItemsPerPage
	}
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	username := c.Query("username")
	tokenName := c.Query("token_name")
	modelName := c.Query("model_name")
	channel, _ := strconv.Atoi(c.Query("channel"))
	group := c.Query("group")
	requestIP := c.Query("request_ip")
	requestId := c.Query("request_id")
	userId, _ := strconv.Atoi(c.Query("user_id"))
	logs, total, err := model.GetAllLogs(logType, startTimestamp, endTimestamp, modelName, username, tokenName, (p-1)*pageSize, pageSize, channel, group, requestIP, requestId, userId)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data": map[string]any{
			"items":     logs,
			"total":     total,
			"page":      p,
			"page_size": pageSize,
		},
	})
}

func GetUserLogs(c *gin.Context) {
	p, _ := strconv.Atoi(c.Query("p"))
	pageSize, _ := strconv.Atoi(c.Query("page_size"))
	if p < 1 {
		p = 1
	}
	if pageSize < 0 {
		pageSize = common.ItemsPerPage
	}
	if pageSize > 100 {
		pageSize = 100
	}
	userId := c.GetInt("id")
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	tokenName := c.Query("token_name")
	modelName := c.Query("model_name")
	group := c.Query("group")
	logs, total, err := model.GetUserLogs(userId, logType, startTimestamp, endTimestamp, modelName, tokenName, (p-1)*pageSize, pageSize, group)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data": map[string]any{
			"items":     logs,
			"total":     total,
			"page":      p,
			"page_size": pageSize,
		},
	})
	return
}

func SearchAllLogs(c *gin.Context) {
	keyword := c.Query("keyword")
	logs, err := model.SearchAllLogs(keyword)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    logs,
	})
	return
}

func SearchUserLogs(c *gin.Context) {
	keyword := c.Query("keyword")
	userId := c.GetInt("id")
	// 本月的 CreatedAt
	createdAtBegin, _ := strconv.ParseInt(c.Query("created_at_begin"), 10, 64)
	createdAtEnd, _ := strconv.ParseInt(c.Query("created_at_end"), 10, 64)

	var extraFields []map[string]interface{}
	if createdAtBegin > 0 {
		extraFields = append(extraFields, map[string]interface{}{"created_at_begin": createdAtBegin})
	}
	if createdAtEnd > 0 {
		extraFields = append(extraFields, map[string]interface{}{"created_at_end": createdAtEnd})
	}
	logs, err := model.SearchUserLogs(userId, keyword, extraFields...)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    logs,
	})
	return
}

func GetLogByKey(c *gin.Context) {
	key := c.Query("key")
	logs, err := model.GetLogByKey(key)
	if err != nil {
		c.JSON(200, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
		"message": "",
		"data":    logs,
	})
}

func GetLogsStat(c *gin.Context) {
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	tokenName := c.Query("token_name")
	username := c.Query("username")
	userId, _ := strconv.Atoi(c.Query("user_id"))
	modelName := c.Query("model_name")
	channel, _ := strconv.Atoi(c.Query("channel"))
	group := c.Query("group")
	stat := model.SumUsedQuota(logType, startTimestamp, endTimestamp, modelName, username, tokenName, channel, group)
	//tokenNum := model.SumUsedToken(logType, startTimestamp, endTimestamp, modelName, username, "")
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data": gin.H{
			"quota": stat.Quota,
			"rpm":   stat.Rpm,
			"tpm":   stat.Tpm,
		},
	})
	return
}

func GetLogsSelfStat(c *gin.Context) {
	username := c.GetString("username")
	logType, _ := strconv.Atoi(c.Query("type"))
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	tokenName := c.Query("token_name")
	modelName := c.Query("model_name")
	channel, _ := strconv.Atoi(c.Query("channel"))
	group := c.Query("group")
	userId := c.GetInt("id")
	quotaNum := model.SumUsedQuota(logType, startTimestamp, endTimestamp, modelName, username, tokenName, channel, group, userId)
	//tokenNum := model.SumUsedToken(logType, startTimestamp, endTimestamp, modelName, username, tokenName)
	c.JSON(200, gin.H{
		"success": true,
		"message": "",
		"data": gin.H{
			"quota": quotaNum.Quota,
			"rpm":   quotaNum.Rpm,
			"tpm":   quotaNum.Tpm,
			//"token": tokenNum,
		},
	})
	return
}

func DeleteHistoryLogs(c *gin.Context) {
	targetTimestamp, _ := strconv.ParseInt(c.Query("target_timestamp"), 10, 64)
	if targetTimestamp == 0 {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "target timestamp is required",
		})
		return
	}
	count, err := model.DeleteOldLog(targetTimestamp)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    count,
	})
	return
}

// 通过 type 获取日志
func GetLogsByType(c *gin.Context) {
	logType, exists := c.GetQuery("type")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "type is required",
		})
		return
	}
	userId := c.GetInt("id")
	logs, err := model.SearchUserLogs(userId, logType)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    logs,
	})
}
