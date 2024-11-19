package common

import "encoding/json"

// 全局模型映射配置
var globalModelMapping = map[string]string{
	"claude.3.5.sonnet.20240620": "claude-3-5-sonnet-20240620",
	"claude.3.5.sonnet.20241022": "claude-3-5-sonnet-20241022",
}

func GlobalModelMapping2JSONString() string {
	jsonBytes, err := json.Marshal(globalModelMapping)
	if err != nil {
		SysError("error marshalling global model mapping: " + err.Error())
	}
	return string(jsonBytes)
}
