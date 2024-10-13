package model

import (
	"fmt"
	"math/rand"
	"one-api/common"
	"strings"
	"time"

	"gorm.io/gorm"
)

type UserOperation struct {
	Id          int       `json:"id"`
	UserId      int       `json:"user_id"`
	CreatedTime time.Time `json:"created_time"`
	Type        int       `json:"type"`
	Remark      string    `json:"remark"`
}

// GetOperationCheckInByUserId 获取用户今日的UserOperation
func GetOperationCheckInByUserId(userId int) (userOperation UserOperation, err error) {
	//  使用Find()获取最近一条记录
	err = DB.Model(&UserOperation{}).
		Where("user_id = ? AND type = ?", userId, 1).Order("id desc").First(&userOperation).Error

	fmt.Printf("userOperation: %v\n", err)
	if err == gorm.ErrRecordNotFound {
		return UserOperation{}, nil // Return zero value of UserOperation
	}

	return userOperation, err
}

// 插入一条 UserOperation
func insertOperation(user_operation UserOperation) (err error) {
	err = DB.Model(&UserOperation{}).Create(&user_operation).Error
	return err
}

// InsertOperationCheckIn 插入一条
func InsertOperationCheckIn(userId int, lastDayUsed int64, requestIP string) (quota int, err error) {
	rand.Seed(time.Now().UnixNano())

	// 随机生成一个额度
	quota = int(rand.Float64() * float64(lastDayUsed))

	operationRemark := []string{"签到", ", ", fmt.Sprintf("获得额度 %v", common.LogQuota(quota))}

	// 更新用户额度
	err = increaseUserQuota(userId, quota)
	if err != nil {
		return 0, err
	}

	RecordLog(userId, LogTypeUserQperationCheckIn, strings.Join(operationRemark, ""), requestIP)
	err = insertOperation(UserOperation{
		UserId:      userId,
		Type:        1,
		Remark:      strings.Join(operationRemark, ""),
		CreatedTime: time.Now(),
	})
	return
}

// 判断是否已经签到
func IsCheckInToday(userId int) (checkInTime string, lastDayUsed int64, err error) {
	var userOperation UserOperation
	userOperation, err = GetOperationCheckInByUserId(userId)
	// Return zero value of UserOperation
	// if err != nil {
	// 	return "", -2, err
	// }

	// 获取当前地区的当天零点时间
	localZeroTime := common.GetLocalZeroTime()

	if err != nil {
		// 获取昨日的累计使用额度
		lastDayUsed, err := GetUserQuotaUsedByPeriod(userId, localZeroTime)
		return "", lastDayUsed, err
	}

	// 比较签到时间是否晚于北京时间的今日零点
	if int(userOperation.CreatedTime.Unix()) >= int(localZeroTime.Unix()) {
		// 已签到
		return userOperation.CreatedTime.GoString(), -1, err
	} else {
		// 获取昨日的累计使用额度
		lastDayUsed, err := GetUserQuotaUsedByPeriod(userId, localZeroTime)
		return "", lastDayUsed, err
	}
}

// 获取昨日的累计使用额度
func GetUserQuotaUsedByPeriod(userId int, zeroTime time.Time) (used int64, err error) {
	now := time.Now()
	toDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	endOfDay := toDay.Add(-time.Second).Add(time.Hour * 24)
	startOfDay := toDay.AddDate(0, 0, -1)
	dashboards, err := GetQuotaDataByUserId(userId, startOfDay.Unix(), endOfDay.Unix())
	if err != nil {
		return -1, err
	}
	// dashboards 是个数组, 循环获取每个Quota, 接下来获取昨日的累计使用额度
	fmt.Printf("dashboards: %v\n", dashboards)
	if len(dashboards) > 0 {
		for _, v := range dashboards {
			used += int64(v.Quota)
		}
	} else {
		used = 0
	}
	// fmt.Printf("used: %v\n", used)
	// if used == 0 {
	// 	return -2, nil
	// }
	// 保底值
	if float64(used) < (common.QuotaPerUnit * 0.5) {
		used = int64(common.QuotaPerUnit * 0.25)
	} else if float64(used) < (common.QuotaPerUnit * 5) {
		used = int64(float64(used) * 0.35)
	} else if float64(used) < (common.QuotaPerUnit * 15) {
		used = int64(float64(used) * 0.25)
	} else if float64(used) < (common.QuotaPerUnit * 30) {
		used = int64(float64(used) * 0.15)
	} else {
		used = int64(float64(used) * 0.1)
	}

	return used, err
}
