package dto

type GenRequest struct {
	UserPrompt   string `json:"user_prompt"`             // option
	AspectRatio  string `json:"aspect_ratio,omitempty"`  // option
	ExpandPrompt bool   `json:"expand_prompt,omitempty"` // option
	ImageUrl     string `json:"image_url,omitempty"`     //option, uploaded refer image url
	ImageEndUrl  string `json:"image_end_url,omitempty"` //option, uploaded refer image url
}

type VideoTask struct {
	ID                  string      `json:"id"`
	Prompt              string      `json:"prompt"`
	State               string      `json:"state"` // "pending", "processing", "completed"
	CreatedAt           string      `json:"created_at"`
	Video               *Video      `json:"video"`
	Liked               interface{} `json:"liked"`
	EstimateWaitSeconds interface{} `json:"estimate_wait_seconds"`
}

type Video struct {
	Url       string      `json:"url"`
	Width     int         `json:"width"`
	Height    int         `json:"height"`
	Thumbnail interface{} `json:"thumbnail"`
}

type UploadReq struct {
	Url string `json:"url"` // support public url & base64
}

type FileUploadResult struct {
	Id           string `json:"id"`
	PresignedUrl string `json:"presigned_url"`
	PublicUrl    string `json:"public_url"`
}

type WrapperErrorResp struct {
	ErrorResp  ErrorResp
	StatusCode int
}

type ErrorResp struct {
	Detail string `json:"detail"`
}