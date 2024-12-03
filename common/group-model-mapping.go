package common

import "encoding/json"

// 全局模型映射配置
var globalModelMapping = map[string]string{}

func GlobalModelMapping2JSONString() string {
	jsonBytes, err := json.Marshal(globalModelMapping)
	if err != nil {
		SysError("error marshalling global model mapping: " + err.Error())
	}
	return string(jsonBytes)
}
