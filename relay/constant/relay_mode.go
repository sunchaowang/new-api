package constant

import "strings"

const (
	RelayModeUnknown = iota
	RelayModeChatCompletions
	RelayModeCompletions
	RelayModeEmbeddings
	RelayModeModerations
	RelayModeImagesGenerations
	RelayModeEdits
	RelayModeMidjourneyImagine
	RelayModeMidjourneyDescribe
	RelayModeMidjourneyBlend
	RelayModeMidjourneyChange
	RelayModeMidjourneySimpleChange
	RelayModeMidjourneyNotify
	RelayModeMidjourneyTaskFetch
	RelayModeMidjourneyTaskImageSeed
	RelayModeMidjourneyTaskFetchByCondition
	RelayModeAudioSpeech
	RelayModeAudioTranscription
	RelayModeAudioTranslation
	RelayModeMidjourneyAction
	RelayModeMidjourneyModal
	RelayModeMidjourneyShorten
	RelayModeSwapFace
)

func Path2RelayMode(path string) int {
	relayMode := RelayModeUnknown
	// 去掉 path 的 api 前缀

	if strings.Contains(path, "/v1/chat/completions") {
		relayMode = RelayModeChatCompletions
	} else if strings.Contains(path, "/v1/completions") {
		relayMode = RelayModeCompletions
	} else if strings.Contains(path, "/v1/embeddings") {
		relayMode = RelayModeEmbeddings
	} else if strings.Contains(path, "embeddings") {
		relayMode = RelayModeEmbeddings
	} else if strings.Contains(path, "/v1/moderations") {
		relayMode = RelayModeModerations
	} else if strings.Contains(path, "/v1/images/generations") {
		relayMode = RelayModeImagesGenerations
	} else if strings.Contains(path, "/v1/edits") {
		relayMode = RelayModeEdits
	} else if strings.Contains(path, "/v1/audio/speech") {
		relayMode = RelayModeAudioSpeech
	} else if strings.Contains(path, "/v1/audio/transcriptions") {
		relayMode = RelayModeAudioTranscription
	} else if strings.Contains(path, "/v1/audio/translations") {
		relayMode = RelayModeAudioTranslation
	}
	return relayMode
}

func Path2RelayModeMidjourney(path string) int {
	relayMode := RelayModeUnknown
	if strings.Contains(path, "/mj/submit/action") {
		// midjourney plus
		relayMode = RelayModeMidjourneyAction
	} else if strings.Contains(path, "/mj/submit/modal") {
		// midjourney plus
		relayMode = RelayModeMidjourneyModal
	} else if strings.Contains(path, "/mj/submit/shorten") {
		// midjourney plus
		relayMode = RelayModeMidjourneyShorten
	} else if strings.Contains(path, "/mj/insight-face/swap") {
		// midjourney plus
		relayMode = RelayModeSwapFace
	} else if strings.Contains(path, "/mj/submit/imagine") {
		relayMode = RelayModeMidjourneyImagine
	} else if strings.Contains(path, "/mj/submit/blend") {
		relayMode = RelayModeMidjourneyBlend
	} else if strings.Contains(path, "/mj/submit/describe") {
		relayMode = RelayModeMidjourneyDescribe
	} else if strings.Contains(path, "/mj/notify") {
		relayMode = RelayModeMidjourneyNotify
	} else if strings.Contains(path, "/mj/submit/change") {
		relayMode = RelayModeMidjourneyChange
	} else if strings.Contains(path, "/mj/submit/simple-change") {
		relayMode = RelayModeMidjourneyChange
	} else if strings.Contains(path, "/fetch") {
		relayMode = RelayModeMidjourneyTaskFetch
	} else if strings.Contains(path, "/image-seed") {
		relayMode = RelayModeMidjourneyTaskImageSeed
	} else if strings.Contains(path, "/list-by-condition") {
		relayMode = RelayModeMidjourneyTaskFetchByCondition
	}
	return relayMode
}
