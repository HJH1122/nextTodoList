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
import { CustomModalType, FocusedTodoType, Todo } from "@/types";
import { useState } from "react";
import {Popover, PopoverTrigger, PopoverContent, Spinner, Dropdown,DropdownTrigger, DropdownMenu, DropdownItem, Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,} from "@heroui/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VerticalDotsIcon } from './icons';
import CustomModal from "./custom-modal";



const TodosTable = ({todos} : {todos: Todo[]}) => {

  const [todoAddEnable, setTodoAddEnable] = useState(false);
  const [newTodoInput, setNewTodoInput] = useState('');
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [currentModalData, setCurrentModalData] = useState<FocusedTodoType>({
      focusedTodo: null,
      modalType: 'detail' as CustomModalType
  });

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
    notifySuccessEvent('할일 추가 성공!');
    
  }

  const editATodoHandler = async (id: string, editedTitle: string, editedIsDone: boolean) =>{


    setIsLoading(true);

    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`,{
      method: 'post',
      body: JSON.stringify({
        title: editedTitle,
        id_done: editedIsDone,

      }),
      cache: 'no-store'
    });
    router.refresh();
    setIsLoading(false);
    notifySuccessEvent('할일 수정 성공!');
    
  }


  const deleteATodoHandler = async (id: string) =>{


    setIsLoading(true);

    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`,{
      method: 'delete',
      cache: 'no-store'
    });
    router.refresh();
    setIsLoading(false);
    notifySuccessEvent('할일 삭제 성공!');
    
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

  const applyIsDoneUI = (isDone: boolean) => 
    (isDone ? 'line-through text-gray-900/50 dark:text-white-900/40' : '')

  const TodoRow = (aTodo: Todo) =>{
            return <TableRow key={aTodo.id}>
                      <TableCell className={applyIsDoneUI(aTodo.is_done)}>{aTodo.id.slice(0,4)}</TableCell>
                      <TableCell className={applyIsDoneUI(aTodo.is_done)}>{aTodo.title}</TableCell>
                      <TableCell>{aTodo.is_done ? '완료' : '미완료'}</TableCell>
                      <TableCell className={applyIsDoneUI(aTodo.is_done)}>{`${aTodo.created_at}`}</TableCell>
                      <TableCell>
                        <div className="relative flex justify-end items-center gap-2">
                          <Dropdown>
                            <DropdownTrigger>
                              <Button isIconOnly size="sm" variant="light">
                                <VerticalDotsIcon className="text-default-300" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => {
                                setCurrentModalData({focusedTodo: aTodo, modalType: key as CustomModalType});
                                onOpen();
                            }}>
                              <DropdownItem key="detail">상세보기</DropdownItem>
                              <DropdownItem key="edit">수정</DropdownItem>
                              <DropdownItem key="delete">삭제</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </TableCell>
                  </TableRow>
  }

  const notifySuccessEvent = (msg: string) => toast.success(msg);

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const ModalComponent = () =>{
    return <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
              (currentModalData.focusedTodo && <CustomModal 
                focusedTodo={currentModalData.focusedTodo}
                modalType={currentModalData.modalType}
                onClose={onClose}
                onEdit={async(id, title, isDone)=>{
                  await editATodoHandler(id, title, isDone);
                  onClose();
                }}
                onDelete={async(id)=>{
                  await deleteATodoHandler(id);
                  onClose();
                }}
              />)
          )}
        </ModalContent>
      </Modal>
  }

  return (

    <div className="flex flex-col space-y-2">
        {ModalComponent()}
        <ToastContainer
          position="top-right"
          autoClose={1800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          />
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
          <TableColumn>액션</TableColumn>
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