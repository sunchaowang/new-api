package doubao

var ModelList = []string{
	"doubao-pro-256k",
	"doubao-pro-128k",
	"doubao-pro-32k",
	"doubao-pro-4k",
	"doubao-lite-128k",
	"doubao-lite-32k",
	"doubao-lite-4k",
	"doubao-embedding",
}

// 豆包模型的接入点映射
var ModelEndpoint = map[string]string{
	"doubao-pro-256k":  "",
	"doubao-pro-128k": "ep-20240709005106-jdqmh",
	"doubao-pro-32k":  "ep-20240709005049-n7qdt",
	"doubao-pro-4k":   "ep-20240709004342-mwq7j",
	"doubao-lite-128k": "ep-20240709005513-4fph6",
	"doubao-lite-32k":  "ep-20240709005459-kdftf",
	"doubao-lite-4k":   "ep-20240709005437-d8lfq",
	"doubao-embedding": "",
}


var ChannelName = "doubao"
