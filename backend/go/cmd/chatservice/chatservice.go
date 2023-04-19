package main

import (
	"database/sql"
	"fmt"
	"github.com/sashabaranov/go-openai"
	"github.com/tonnytg/std-fullcycle-chatgpt-wzap/configs"
	"github.com/tonnytg/std-fullcycle-chatgpt-wzap/internal/infra/repository"
	"github.com/tonnytg/std-fullcycle-chatgpt-wzap/internal/infra/web/web"
	"github.com/tonnytg/std-fullcycle-chatgpt-wzap/internal/infra/web/web/webserver"
	"github.com/tonnytg/std-fullcycle-chatgpt-wzap/internal/usecase/chatcompletion"
)

func main() {
	configs, err := configs.LoadConfig(".")
	if err != nil {
		panic(err)
	}

	conn, err := sql.Open(configs.DBDriver, fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", configs.DBUser, configs.DBPassword, configs.DBHost, configs.DBPort, configs.DBName))
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	repo := repository.NewChatRepositoryMySQL(conn)
	client := openai.NewClient(configs.OpenAIApiKey)

	chatConfig := chatcompletion.ChatCompletionConfigInputDTO{
		Model:                configs.Model,
		ModelMaxTokens:       configs.ModelMaxTokens,
		Temperature:          float32(configs.Temperature),
		TopP:                 float32(configs.TopP),
		N:                    configs.N,
		Stop:                 configs.Stop,
		MaxTokens:            configs.MaxTokens,
		InitialSystemMessage: configs.InitialChatMessage,
	}

	//chatConfigStream := chatcompletionstream.ChatCompletionConfigInputDTO{
	//	Model:                configs.Model,
	//	ModelMaxTokens:       configs.ModelMaxTokens,
	//	Temperature:          float32(configs.Temperature),
	//	TopP:                 float32(configs.TopP),
	//	N:                    configs.N,
	//	Stop:                 configs.Stop,
	//	MaxTokens:            configs.MaxTokens,
	//	InitialSystemMessage: configs.InitialChatMessage,
	//}

	usecase := chatcompletion.NewChatCompletionUseCase(repo, client)
	//streamChannel := make(chan chatcompletionstream.ChatCompletionOutputDTO)
	//usecaseStream := chatcompletionstream.NewChatCompletionUseCase(repo, client, streamChannel)

	webserver := webserver.NewWebServer(":" + configs.WebServerPort)
	webserverChatHandler := web.NewWebChatGPTHandler(*usecase, chatConfig, configs.AuthToken)
	webserver.AddHandler("/chat", webserverChatHandler.Handle)

	fmt.Println("Server running on port " + configs.WebServerPort)
	webserver.Start()

}
