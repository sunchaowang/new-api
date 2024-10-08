package common

import (
	"encoding/json"
)

var TokenGroupRatio = map[string]float64{
	"default": 1,
}

func TokenGroupRatio2JSONString() string {
	jsonBytes, err := json.Marshal(TokenGroupRatio)
	if err != nil {
		SysError("error marshalling model ratio: " + err.Error())
	}
	return string(jsonBytes)
}

func UpdateTokenGroupRatioByJSONString(jsonStr string) error {
	TokenGroupRatio = make(map[string]float64)
	return json.Unmarshal([]byte(jsonStr), &TokenGroupRatio)
}

func GetTokenGroupRatio(name string) float64 {
	ratio, ok := TokenGroupRatio[name]
	if !ok {
		SysError("token group ratio not found: " + name)
		return 1
	}
	return ratio
}
