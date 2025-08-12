import { NextRequest, NextResponse } from "next/server";
import dummyTodos from '@/data/dummy.json';
import {fetchTodos, addATodo} from '@/data/firestore'

export async function GET(request: NextRequest){

    const fetchedTodos = await fetchTodos();
    const response = {
        message: 'todos 몽땅 가져오기',
        data: fetchedTodos,
    }

    return NextResponse.json(response, {status: 200});
}


export async function POST(request: NextRequest){

    const {title} = await request.json();

    if(title === undefined){

        const errMessage = {
            message: 'title을 작성해주세요.'
        }

        return NextResponse.json(errMessage, {status: 422});
    }
    
    const addedTodo = await addATodo({ title });

    const response = {
        message: 'todos 추가 성공!',
        data: addedTodo,
    }

    return Response.json(response, {status : 201});
}

