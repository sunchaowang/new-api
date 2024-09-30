package model

import (
	"fmt"
	"one-api/common"
)

// QuotaForNewLinuxDoUser 为新注册的 LinuxDo 用户赠送奖励
func (user User) QuotaForNewLinuxDoUser() {
	var bonusMultiplier float64

	switch {
	case user.LinuxDoLevel == 0:
		bonusMultiplier = 0.25
	case user.LinuxDoLevel == 1:
		bonusMultiplier = 0.5
	case user.LinuxDoLevel == 2:
		bonusMultiplier = 0.75
	case user.LinuxDoLevel == 3:
		bonusMultiplier = 1.5
	default:
		bonusMultiplier = float64(user.LinuxDoLevel) - 1
	}

	quota := int(float64(common.QuotaPerUnit) * bonusMultiplier)
	if err := IncreaseUserQuota(user.Id, quota); err != nil {
		common.SysError("增加用户配额失败：" + err.Error())
		return
	}

	RecordLog(user.Id, LogTypeSystem, fmt.Sprintf("linux do %v级用户注册, 赠送 %s", user.LinuxDoLevel, common.LogQuota(quota)), "")
}
