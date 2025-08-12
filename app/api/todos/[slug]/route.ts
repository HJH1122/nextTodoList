import { NextRequest, NextResponse } from "next/server";
import { title } from "process";
import { fetchATodo, deleteATodo, editATodo } from "@/data/firestore";

export async function GET(request: NextRequest, {params} : {params: {slug : string}}){

    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get('query');

    const fetchedTodos = await fetchATodo(params.slug);

    if(fetchedTodos === null){
        return new Response(null, {status : 204});
    }

    const response = {
        message: '단일 할일 가져오기 성공',
        data: fetchedTodos
    }


    return NextResponse.json(response, {status : 200});
}


export async function DELETE(request: NextRequest, {params} : {params: {slug : string}}){

    const deletedTodo =  await deleteATodo(params.slug);

    if(deletedTodo === null){
        return new Response(null, {status : 204});
    }

    const response = {
        message: '단일 할일 삭제 성공',
        data: deletedTodo,
    }


    return NextResponse.json(response, {status : 200});
}

export async function POST(request: NextRequest, {params} : {params: {slug : string}}){

    const {title, is_done} = await request.json();

    const editedTodo = await editATodo(params.slug, {title, is_done});

        if(editedTodo === null){
        return new Response(null, {status : 204});
    }

    const response = {
        message: '단일 할일 수정 성공',
        data: editedTodo
    }


    return NextResponse.json(response, {status : 200});
}