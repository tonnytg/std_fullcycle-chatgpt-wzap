import { NextRequest } from "next/server";
import { prisma } from "../../../prisma/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { chatId: string }})
    {
    const messages = await prisma.message.findMany({
        where: {
            chat_id: params.chatId
        },
        orderBy: { created_at: "asc" },
    });

    return NextResponse.json(messages);
}

export async function POST(
    request: NextRequest,
    { params }: { params: { chatId: string } }
    ) {
        const chat = await prisma.chat.findUniqueOrThrow({
            where: { id: params.chatId },
        });

        const body = await request.json();
        const messageCreate = await prisma.message.create({
            data: {
                content: body.message,
                chat_id: chat.id,
            }
        });

        return NextResponse.json(messageCreate);
}
