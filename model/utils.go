package model

import (
	"errors"
	"fmt"
	"github.com/bytedance/gopkg/util/gopool"
	"gorm.io/gorm"
	"one-api/common"
	"strings"
	"sync"
	"time"
)

const (
	BatchUpdateTypeUserQuota = iota
	BatchUpdateTypeTokenQuota
	BatchUpdateTypeUsedQuota
	BatchUpdateTypeChannelUsedQuota
	BatchUpdateTypeRequestCount
	BatchUpdateTypeCount // if you add a new type, you need to add a new map and a new lock
)

var batchUpdateStores []map[int]int
var batchUpdateLocks []sync.Mutex

func init() {
	for i := 0; i < BatchUpdateTypeCount; i++ {
		batchUpdateStores = append(batchUpdateStores, make(map[int]int))
		batchUpdateLocks = append(batchUpdateLocks, sync.Mutex{})
	}
}

func InitBatchUpdater() {
	gopool.Go(func() {
		for {
			time.Sleep(time.Duration(common.BatchUpdateInterval) * time.Second)
			batchUpdate()
		}
	})
}

func addNewRecord(type_ int, id int, value int) {
	batchUpdateLocks[type_].Lock()
	defer batchUpdateLocks[type_].Unlock()
	if _, ok := batchUpdateStores[type_][id]; !ok {
		batchUpdateStores[type_][id] = value
	} else {
		batchUpdateStores[type_][id] += value
	}
}

func batchUpdate() {
	common.SysLog("batch update started")
	for i := 0; i < BatchUpdateTypeCount; i++ {
		batchUpdateLocks[i].Lock()
		store := batchUpdateStores[i]
		batchUpdateStores[i] = make(map[int]int)
		batchUpdateLocks[i].Unlock()
		// TODO: maybe we can combine updates with same key?
		for key, value := range store {
			switch i {
			case BatchUpdateTypeUserQuota:
				err := increaseUserQuota(key, value)
				if err != nil {
					common.SysError("failed to batch update user quota: " + err.Error())
				}
			case BatchUpdateTypeTokenQuota:
				err := increaseTokenQuota(key, value)
				if err != nil {
					common.SysError("failed to batch update token quota: " + err.Error())
				}
			case BatchUpdateTypeUsedQuota:
				updateUserUsedQuota(key, value)
			case BatchUpdateTypeRequestCount:
				updateUserRequestCount(key, value)
			case BatchUpdateTypeChannelUsedQuota:
				updateChannelUsedQuota(key, value)
			}
		}
	}
	common.SysLog("batch update finished")
}

func RecordExist(err error) (bool, error) {
	if err == nil {
		return true, nil
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return false, nil
	}
	return false, err
}

type modelable interface {
	any
}

type PaginationParams struct {
	Page  int    `form:"page"`
	Size  int    `form:"size"`
	Order string `form:"order"`
}

type DataResult[T modelable] struct {
	Data       *[]*T `json:"data"`
	Page       int   `json:"page"`
	Size       int   `json:"size"`
	TotalCount int64 `json:"total_count"`
}

func PaginateAndOrder[T modelable](db *gorm.DB, params *PaginationParams, result *[]*T, allowedOrderFields map[string]bool) (*DataResult[T], error) {
	// 获取总数
	var totalCount int64
	err := db.Model(result).Count(&totalCount).Error
	if err != nil {
		return nil, err
	}

	// 分页
	if params.Page < 1 {
		params.Page = 1
	}
	if params.Size < 1 {
		params.Size = common.ItemsPerPage
	}

	if params.Size > common.MaxRecentItems {
		return nil, fmt.Errorf("size 参数不能超过 %d", common.MaxRecentItems)
	}

	offset := (params.Page - 1) * params.Size
	db = db.Offset(offset).Limit(params.Size)

	// 排序
	if params.Order != "" {
		orderFields := strings.Split(params.Order, ",")
		for _, field := range orderFields {
			field = strings.TrimSpace(field)
			desc := strings.HasPrefix(field, "-")
			if desc {
				field = field[1:]
			}
			if !allowedOrderFields[field] {
				return nil, fmt.Errorf("不允许对字段 '%s' 进行排序", field)
			}
			if desc {
				field = field + " DESC"
			}
			db = db.Order(field)
		}
	} else {
		// 默认排序
		db = db.Order("id DESC")
	}

	// 查询
	err = db.Find(result).Error
	if err != nil {
		return nil, err
	}

	// 返回结果
	return &DataResult[T]{
		Data:       result,
		Page:       params.Page,
		Size:       params.Size,
		TotalCount: totalCount,
	}, nil
}
