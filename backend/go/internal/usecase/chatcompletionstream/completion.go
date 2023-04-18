package chatcompletionstream

import (
	openai "github.com/sashabaranov/go-openai"
	"github.com/tonnytg/std-fullcycle-chatgpt-wzap/internal/domain/gateway"
)

type ChatCompletionUseCase struct {
	ChatGateway  gateway.ChatGateway
	OpenAiClient *openai.Client
}

func NewChatCompletionUseCase(chatGateway gateway.ChatGateway, openAiClient *openai.Client) *ChatCompletionUseCase {
	return &ChatCompletionUseCase{
		ChatGateway:  chatGateway,
		OpenAiClient: openAiClient,
	}
}

// TODO: develop the use case
