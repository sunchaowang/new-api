package setting

import (
	"encoding/json"
	"one-api/common"
)

var userUsableGroups = map[string]string{
	"default": "默认分组",
	"vip":     "vip分组",
}

var HiddenGroups = []string{}

func GetUserUsableGroupsCopy() map[string]string {
	copyUserUsableGroups := make(map[string]string)
	for k, v := range userUsableGroups {
		copyUserUsableGroups[k] = v
	}
	return copyUserUsableGroups
}

func UserUsableGroups2JSONString() string {
	jsonBytes, err := json.Marshal(userUsableGroups)
	if err != nil {
		common.SysError("error marshalling user groups: " + err.Error())
	}
	return string(jsonBytes)
}

func HiddenGroups2JSONString() string {
	jsonBytes, err := json.Marshal(HiddenGroups)
	if err != nil {
		common.SysError("error marshalling hidden groups: " + err.Error())
	}
	return string(jsonBytes)
}

func UpdateUserUsableGroupsByJSONString(jsonStr string) error {
	userUsableGroups = make(map[string]string)
	return json.Unmarshal([]byte(jsonStr), &userUsableGroups)
}

func UpdateHiddenGroupsByJSONString(jsonStr string) error {
	HiddenGroups = make([]string, 0)
	return json.Unmarshal([]byte(jsonStr), &HiddenGroups)
}

func GetUserUsableGroups(userGroup string) map[string]string {
	groupsCopy := GetUserUsableGroupsCopy()
	if userGroup == "" {
		if _, ok := groupsCopy["default"]; !ok {
			groupsCopy["default"] = "default"
		}
	}
	// 如果userGroup不在UserUsableGroups中，返回UserUsableGroups + userGroup
	if _, ok := groupsCopy[userGroup]; !ok {
		groupsCopy[userGroup] = "用户分组"
	}
	// 如果userGroup在UserUsableGroups中，返回UserUsableGroups
	return groupsCopy
}

func GroupInUserUsableGroups(groupName string) bool {
	_, ok := userUsableGroups[groupName]
	return ok
}
