import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){

    return new NextResponse('오늘도 빡코딩');
}