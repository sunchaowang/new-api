package setting

import (
	"encoding/json"
	"one-api/common"
)

var ServerAddress = "http://localhost:3000"
var WorkerUrl = ""
var WorkerValidKey = ""

func EnableWorker() bool {
	return WorkerUrl != ""
}

var Manufacturers = []map[string]string{}

func Manufacturers2JSONString() string {
	jsonBytes, err := json.Marshal(Manufacturers)
	if err != nil {
		common.SysError("error marshalling manufacturers: " + err.Error())
	}
	return string(jsonBytes)
}

func UpdateManufacturersByJSONString(jsonStr string) error {
	Manufacturers = make([]map[string]string, 0)
	return json.Unmarshal([]byte(jsonStr), &Manufacturers)
}
