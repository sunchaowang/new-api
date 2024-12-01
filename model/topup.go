package model

type TopUpStatus string
type CurrencyType string
type TopUpChannel string // 充值渠道

const (
	TopUpStatusPending TopUpStatus = "pending"
	TopUpStatusSuccess TopUpStatus = "success"
	TopUpStatusFailed  TopUpStatus = "failed"
	TopUpStatusClosed  TopUpStatus = "closed"
)

const (
	CurrencyTypeUSD CurrencyType = "USD"
	CurrencyTypeCNY CurrencyType = "CNY"
)

const (
	TopUpChannelOnline     TopUpChannel = "online"     // 在线充值
	TopUpChannelRedemption TopUpChannel = "redemption" // 兑换码充值
)

type TopUp struct {
	Id           int          `json:"id"`
	UserId       int          `json:"user_id" gorm:"index"`
	Amount       int          `json:"amount"`
	Money        float64      `json:"money"`
	TradeNo      string       `json:"trade_no"`
	CreateTime   int64        `json:"create_time"`
	UpdateTime   int64        `json:"update_time"`
	Status       TopUpStatus  `json:"status" gorm:"default:'pending'"`
	CurrencyType CurrencyType `json:"currency_type" gorm:"default:'CNY'"`
	TopUpChannel TopUpChannel `json:"topup_type" gorm:"default:'online'"`
}

func (topUp *TopUp) Insert() error {
	var err error
	err = DB.Create(topUp).Error
	return err
}

func (topUp *TopUp) Update() error {
	var err error
	err = DB.Save(topUp).Error
	return err
}

func GetTopUpById(id int) *TopUp {
	var topUp *TopUp
	var err error
	err = DB.Where("id = ?", id).First(&topUp).Error
	if err != nil {
		return nil
	}
	return topUp
}

func GetTopUpByTradeNo(tradeNo string) *TopUp {
	var topUp *TopUp
	var err error
	err = DB.Where("trade_no = ?", tradeNo).First(&topUp).Error
	if err != nil {
		return nil
	}
	return topUp
}
