import { NextRequest, NextResponse } from "next/server";
import dummyTodos from '@/data/dummy.json';

export async function GET(request: NextRequest){

    const response = {
        message: 'todos 몽땅 가져오기',
        data: dummyTodos,
    }

    return NextResponse.json(response, {status: 200});
}


export async function POST(request: NextRequest){

    const {title} = await request.json();

    const newTodo = {
        id: "10",
        title,
        is_done: false,
    }
    const response = {
        message: 'todos 추가 성공!',
        data: newTodo,
    }

    return Response.json(response, {status : 201});
}

