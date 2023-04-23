import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {

    const chatCreated = await prisma.chat.create({
        data: {},
    });

    return NextResponse.json(chatCreated);
}