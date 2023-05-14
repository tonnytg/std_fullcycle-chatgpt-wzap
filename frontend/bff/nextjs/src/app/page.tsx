'use client';

import useSWR from 'swr';
import { fetcher } from '../http/http';
import { Chat, Message } from '@prisma/client';

type ChatWithFirstMessage = Chat & {
  messages: [Message];
}

export default function Home() {

  const { data: chats } = useSWR<ChatWithFirstMessage[]>("chats", fetcher);

  // console.log(data);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col">
        Barra lateral
        <button type="button"> New chat</button>
        Chats
        <ul>
          {chats?.map(chat => (
            <li key={chat.id}>
              <div>{chat.name}</div>
              <div>{chat.messages[0]?.content}</div>
            </li>
          ))}
          
        </ul>
      </div>

      <div>
        Centro
        <div>Centro das Mensagens e formulário</div>
        <ul>
          <li>Mensagem 1</li>
          <li>Mensagem 2</li>
        </ul>
        <form>
          <textarea placeholder="Digite sua mensagem" />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  )
}
