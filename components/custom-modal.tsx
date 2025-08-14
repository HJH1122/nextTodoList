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
import { useEffect, useState } from "react";
import {Popover, PopoverTrigger, PopoverContent, Spinner, Dropdown,DropdownTrigger, DropdownMenu, DropdownItem, Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Switch,
  CircularProgress,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VerticalDotsIcon } from './icons';


const CustomModal = ({focusedTodo, modalType, onClose, onEdit, onDelete} : {
    focusedTodo: Todo, 
    modalType: CustomModalType,
    onClose: () => void,
    onEdit:(id: string, title: string, isDone: boolean) => void,
    onDelete:(id: string) => void,
    }) => {

        const [isDone, setIsDone] = useState(focusedTodo.is_done);
        const [isLoading, setIsLoading] = useState(false);
        const [editedTodoInput, setEditedTodoInput] = useState<string>(focusedTodo.title);


        const DetailModal = () =>{
            return <>
              <ModalHeader className="flex flex-col gap-1">할일 상세</ModalHeader>
              <ModalBody>
                <p><span className="font-bold">id : </span>{focusedTodo.id}</p>
                <p><span className="font-bold">할일 내용 : </span>{focusedTodo.title}</p>
                
               
                <div className="flex py-2 space-x-4">
                    <span className="font-bold">완료여부 : </span>
                   {`${focusedTodo.is_done ? '완료' : '미완료'}`}
                </div>
                <div className="flex py-2 space-x-4">
                    <span className="font-bold">작성일 : </span>
                    <p>{`${focusedTodo.created_at}`}</p>
                   
                </div>
              </ModalBody>
              <ModalFooter>
               
                <Button color="default" onPress={onClose}>
                  닫기
                </Button>
              </ModalFooter>
            </>
        }

        const EditModal = () =>{
         return <>
              <ModalHeader className="flex flex-col gap-1">할일 수장</ModalHeader>
              <ModalBody>
                <p><span className="font-bold">id : </span>{focusedTodo.id}</p>
                <Input
                  autoFocus
                  label="할일 내용"
                  placeholder="할일을 입력해주세요."
                  variant="bordered"
                  isRequired
                  defaultValue={focusedTodo.title}
                  value={editedTodoInput}
                  onValueChange={setEditedTodoInput}
                />
               
                <div className="flex py-2 space-x-4">
                    <span className="font-bold">완료여부 : </span>
                   <Switch defaultSelected={focusedTodo.is_done} 
                      onValueChange={setIsDone}
                      aria-label="Automatic updates"
                      color="warning"
                    >
                      
                   </Switch>
                   {`${isDone ? '완료' : '미완료'}`}
                </div>
                <div className="flex py-2 space-x-4">
                    <span className="font-bold">작성일 : </span>
                    <p>{`${focusedTodo.created_at}`}</p>
                   
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="warning" variant="flat" onPress={()=>{
                  setIsLoading(true);
                  onEdit(focusedTodo.id, editedTodoInput, isDone);
                }}>
                  {(isLoading ? <CircularProgress size='sm' aria-label="Loading..." color="warning" /> : '수정')}
                </Button>
                <Button color="default" onPress={onClose}>
                  닫기
                </Button>
              </ModalFooter>
            </>
        }

        const DeleteModal = () =>{
         return <>
              <ModalHeader className="flex flex-col gap-1">할일 삭제</ModalHeader>
              <ModalBody>
                <p><span className="font-bold">id : </span>{focusedTodo.id}</p>
                <p><span className="font-bold">할일 내용 : </span>{focusedTodo.title}</p>
                
               
                <div className="flex py-2 space-x-4">
                    <span className="font-bold">완료여부 : </span>
                   {`${focusedTodo.is_done ? '완료' : '미완료'}`}
                </div>
                <div className="flex py-2 space-x-4">
                    <span className="font-bold">작성일 : </span>
                    <p>{`${focusedTodo.created_at}`}</p>
                   
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={()=>{
                  setIsLoading(true);
                  onDelete(focusedTodo.id);
                }}>
                  {(isLoading ? <CircularProgress size='sm' aria-label="Loading..." color="danger" /> : '삭제')}
                </Button>
                <Button color="default" onPress={onClose}>
                  닫기
                </Button>
              </ModalFooter>
            </>
        }

        const getModal = (type: CustomModalType) =>{
            switch(type){
                case 'detail':
                    return DetailModal();
                case 'delete':
                    return DeleteModal();
                case 'edit':
                    return EditModal();
                default: break;
            }
        }

        return (
           <>
            {getModal(modalType)}
           </>
    )
}

export default CustomModal;