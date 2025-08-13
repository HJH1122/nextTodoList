"use client"

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Todo } from "@/types";
import { useState } from "react";
import {Popover, PopoverTrigger, PopoverContent, Spinner} from "@heroui/react";
import { useRouter } from "next/navigation";

const TodosTable = ({todos} : {todos: Todo[]}) => {

  const [todoAddEnable, setTodoAddEnable] = useState(false);
  const [newTodoInput, setNewTodoInput] = useState('');
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const router = useRouter();

  const addATodoHandler = async (title: string) =>{

    if(!todoAddEnable){
      return;
    }
    setTodoAddEnable(false);
    setIsLoading(true);

    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`,{
      method: 'post',
      body: JSON.stringify({
        title: title
      }),
      cache: 'no-store'
    });
    setNewTodoInput('');
    router.refresh();
    setIsLoading(false);
    
  }

  const DisabledTodoAddButton = () =>{
      return <Popover placement="top" showArrow={true}>
          <PopoverTrigger>
            <Button color="default" className="h-14"
              onPress={async()=>{
                await addATodoHandler(newTodoInput)
              }}
            >
              추가
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">~</div>
              <div className="text-tiny">할일을 입력해주세요!</div>
            </div>
          </PopoverContent>
        </Popover>
  }

  const TodoRow = (aTodo: Todo) =>{
            return <TableRow key={aTodo.id}>
                      <TableCell>{aTodo.id.slice(0,4)}</TableCell>
                      <TableCell>{aTodo.title}</TableCell>
                      <TableCell>{aTodo.is_done ? '완료' : '미완료'}</TableCell>
                      <TableCell>{`${aTodo.created_at}`}</TableCell>
                  </TableRow>
  }

  return (

    <div className="flex flex-col space-y-2">
      <div className="flex flex-wrap w-full gap-4 md:flex-nowrap">
        <Input type="text" label="새로운 할일" value={newTodoInput} onValueChange={(changedInput)=> {
          setNewTodoInput(changedInput);
          setTodoAddEnable(changedInput.length > 0);
          }}/>
        {todoAddEnable ? <Button color="warning" className="h-14">
          추가
        </Button> : DisabledTodoAddButton()
        }
        
      </div>
      <div className="h-6">{isLoading && <Spinner color='warning'/> }</div>
      
      
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>아이디</TableColumn>
          <TableColumn>할일내용</TableColumn>
          <TableColumn>완료여부</TableColumn>
          <TableColumn>생성일</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'보여줄 데이터가 없습니다.'}>
          {todos && todos.map((aTodo: Todo) => (
              TodoRow(aTodo)
          ))}
          
          
        </TableBody>
      </Table>
    </div>
    
  );
}


export default TodosTable;