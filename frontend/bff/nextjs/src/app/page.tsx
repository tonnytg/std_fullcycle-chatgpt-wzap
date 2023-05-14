'use client';

import useSWR from "swr";
import useSWRSubscription from "swr/subscription"; // mantem uma conexão persistente
import ClientHttp, { fetcher } from "../http/http";
import { Chat, Message } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ChatWithFirstMessage = Chat & {
  messages: [Message];
};

export default function Home() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const chatIdParam = searchParams.get('id');
  const [chatId, setChatId] = useState<string | null>(chatIdParam);
  const [messageId, setMessageId] = useState<string | null>(null);

  // mutate serve para forçar o swr atualizar os dados
  const { data: chats, mutate: mutateChats } = useSWR<ChatWithFirstMessage[]>('chats',
    fetcher,
    {
      fallBackData: [],
      revalidateOnFocus: false,
    }
  );

  const { data: messageLoading, error: errorMessageLoading } =
    useSWRSubscription(
      `/api/messages/${messageId}/events`,
      (path: string,{ next }) => {
        console.log('init event source');
        const eventSource = new EventSource(path);
        eventSource.onmessage = (event) => {
          console.log('data:', event);
        }
        eventSource.onerror = (event) => {
          console.log('errors:', event);
        }
        eventSource.addEventListener('end', (event) => {
          console.log('end:', event);
          eventSource.close();
        });
        return () => {
          console.log('close event source');
          eventSource.close();
        }
      }
  );

  //TODO: interpolação?
  const { data: messages, mutate: mutateMessages } = useSWR<ChatWithFirstMessage[]>(
    chatId ? `chats/${chatId}/messages` : null,
    fetcher,
    {
      fallBackData: [],
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    setChatId(chatIdParam);
  }, [chatIdParam]);

  useEffect( () => {
    const textArea = document.querySelector("#message") as HTMLTextAreaElement;
    textArea.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
      }
    });
    textArea.addEventListener("keyup", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        const form = document.querySelector("#form") as HTMLFormElement;
        const submitButton = form.querySelector("button") as HTMLButtonElement;

        form.requestSubmit(submitButton);
        return;
      }
    });
  }, []);

  console.log("Meus dados:", chats);
  console.log("Minhas messagens:", messages);

  async function onSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault(); //evita recarregar a página de novo

    const textArea = event.currentTarget.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    const message = textArea.value;

    if (!chatId) {
      // se não tiver ID
      const newChat: ChatWithFirstMessage = await ClientHttp.post('chats',{
         message
      });
      console.log(newChat);
      // false não deixa fazer a chamada HTTP novamente
      mutateChats([newChat, ...chats!], false);
      setChatId(newChat.id); // seta o ID do novo Chat
      setMessageId(newChat.message[0].id)
    } else {
      // se tiver ID
      const newMessage: Message = await ClientHttp.post(
        `chats/${chatId}/messages`, {
          message
        }
      );
      mutateMessages([...messages!, newMessage], false);
      setMessageId(newMessage.id);
      console.log(newMessage);
    }
    textArea.value = "";
  }

  return (
    <div className="flex gap-5">
      <div className="flex flex-col">
        Barra lateral
        <button type="button" onClick={ () => router.push("/")}> New chat</button>
        Chats
        <ul>
          {chats?.map((chat, key) => (
            <li key={key} onClick={() => router.push(`/?id=${chat.id}`)}>
              {chat.messages[0].content}
            </li>
          ))  
          }
        </ul>
      </div>

      <div>
        Centro
        <div>Centro das Mensagens e formulário</div>
        <ul>
        {messages?.map((message, key) => (
            <li key={key}>{message.content}</li>
          ))}
        </ul>
        <form id="form" onSubmit={onSubmit}>
          <textarea 
            id="message"
            placeholder="Digite sua mensagem"
            className="text-black"
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  )
}
