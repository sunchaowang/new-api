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

	if strings.HasPrefix(path, "/v1/chat/completions") || strings.HasPrefix(path, "/api/v1/chat/completions") {
		relayMode = RelayModeChatCompletions
	} else if strings.HasPrefix(path, "/v1/completions") || strings.HasPrefix(path, "/api/v1/completions") {
		relayMode = RelayModeCompletions
	} else if strings.HasPrefix(path, "/v1/embeddings") || strings.HasPrefix(path, "/api/v1/embeddings") {
		relayMode = RelayModeEmbeddings
	} else if strings.HasSuffix(path, "embeddings") || strings.HasSuffix(path, "api/embeddings") {
		relayMode = RelayModeEmbeddings
	} else if strings.HasPrefix(path, "/v1/moderations") || strings.HasPrefix(path, "/api/v1/moderations") {
		relayMode = RelayModeModerations
	} else if strings.HasPrefix(path, "/v1/images/generations") || strings.HasPrefix(path, "/api/v1/images/generations") {
		relayMode = RelayModeImagesGenerations
	} else if strings.HasPrefix(path, "/v1/edits") || strings.HasPrefix(path, "/api/v1/edits") {
		relayMode = RelayModeEdits
	} else if strings.HasPrefix(path, "/v1/audio/speech") || strings.HasPrefix(path, "/api/v1/audio/speech") {
		relayMode = RelayModeAudioSpeech
	} else if strings.HasPrefix(path, "/v1/audio/transcriptions") || strings.HasPrefix(path, "/api/v1/audio/transcriptions") {
		relayMode = RelayModeAudioTranscription
	} else if strings.HasPrefix(path, "/v1/audio/translations") || strings.HasPrefix(path, "/api/v1/audio/translations") {
		relayMode = RelayModeAudioTranslation
	}
	return relayMode
}

func Path2RelayModeMidjourney(path string) int {
	relayMode := RelayModeUnknown
	if strings.HasSuffix(path, "/mj/submit/action") || strings.HasSuffix(path, "/api/v1/mj/submit/action") {
		// midjourney plus
		relayMode = RelayModeMidjourneyAction
	} else if strings.HasSuffix(path, "/mj/submit/modal") || strings.HasSuffix(path, "/api/v1/mj/submit/modal") {
		// midjourney plus
		relayMode = RelayModeMidjourneyModal
	} else if strings.HasSuffix(path, "/mj/submit/shorten") || strings.HasSuffix(path, "/api/v1/mj/submit/shorten") {
		// midjourney plus
		relayMode = RelayModeMidjourneyShorten
	} else if strings.HasSuffix(path, "/mj/insight-face/swap") || strings.HasSuffix(path, "/api/v1/mj/insight-face/swap") {
		// midjourney plus
		relayMode = RelayModeSwapFace
	} else if strings.HasSuffix(path, "/mj/submit/imagine") || strings.HasSuffix(path, "/api/v1/mj/submit/imagine") {
		relayMode = RelayModeMidjourneyImagine
	} else if strings.HasSuffix(path, "/mj/submit/blend") || strings.HasSuffix(path, "/api/v1/mj/submit/blend") {
		relayMode = RelayModeMidjourneyBlend
	} else if strings.HasSuffix(path, "/mj/submit/describe") || strings.HasSuffix(path, "/api/v1/mj/submit/describe") {
		relayMode = RelayModeMidjourneyDescribe
	} else if strings.HasSuffix(path, "/mj/notify") || strings.HasSuffix(path, "/api/v1/mj/notify") {
		relayMode = RelayModeMidjourneyNotify
	} else if strings.HasSuffix(path, "/mj/submit/change") || strings.HasSuffix(path, "/api/v1/mj/submit/change") {
		relayMode = RelayModeMidjourneyChange
	} else if strings.HasSuffix(path, "/mj/submit/simple-change") || strings.HasSuffix(path, "/api/v1/mj/submit/simple-change") {
		relayMode = RelayModeMidjourneyChange
	} else if strings.HasSuffix(path, "/fetch") || strings.HasSuffix(path, "/api/v1/mj/fetch") {
		relayMode = RelayModeMidjourneyTaskFetch
	} else if strings.HasSuffix(path, "/image-seed") || strings.HasSuffix(path, "/api/v1/mj/image-seed") {
		relayMode = RelayModeMidjourneyTaskImageSeed
	} else if strings.HasSuffix(path, "/list-by-condition") || strings.HasSuffix(path, "/api/v1/mj/list-by-condition") {
		relayMode = RelayModeMidjourneyTaskFetchByCondition
	}
	return relayMode
}
