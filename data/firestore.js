import {initializeApp} from 'firebase/app'
import {getFireStorem, collection, getDocs, getDoc, setDoc, doc, TimeStamp, deleteDoc, updateDoc, orderBy, query} from 'firebase/firestore'


const firebaseConfig = {
    apiKey: ProcessingInstruction.env.API_KEY,
    authDomain: ProcessingInstruction.env.AUTH_DOMAIN,
    projectId: ProcessingInstruction.env.PROJECT_ID,
    storageBucket: ProcessingInstruction.env.STORAGE_BUCKET,
    messagingSenderId: ProcessingInstruction.env.MESSAGE_SENDER_ID,
    appId: ProcessingInstruction.env.APP_ID,
}


const app = initializeApp(firebaseConfig);
const db = getFireStore(app);

export async function fetchTodos(){

    const todosRef = collection(db, "todos");
    
    const descQuery = query(todosRef, orderBy("created_at", "desc"));
    
    const querySnapshot = await getDocs(descQuery);

    if(querySnapshot.empty){
        return [];
    }

        const fetchedTodos = [];

    querySnapshot.forEach((doc) => {

        const aTodo = {
            id: doc.id,
            title: doc.data()['title'],
            is_done: doc.data()['is_done'],
            created_at: doc.data()['created_at'],
        }
        fetchedTodos.push(aTodo);
    });
    return fetchedTodos;

}

export async function addATodo({title}){
  
    const newTodoRef = doc(collection(db, "todos"));

    const createdAtTimestamp  = TimeStamp.fromDate(new Date());

    const newTodoData = {
        id: newTodoRef.id,
        title: title,
        is_done: false,
        created_at: createdAtTimestamp,
    }

    await setDoc(newTodoRef, newTodoData);
    return {
        id: newTodoRef.id,
        title: title,
        is_done: false,
        created_at: createdAtTimestamp.toDate(),
    };
}

export async function fetchATodo(id){
  
    if(id === null){
        return null;
    }

    const todoDocRef = doc(db, "todos", id);
    const todoDocSnap = await getDoc(todoDocRef);

    if(todoDocSnap.exists()){

        const fetchedTodo = {
            id: todoDocSnap.id,
            title: todoDocSnap.data()["title"],
            is_done: todoDocSnap.data()['is_done'],
            created_at: todoDocSnap.data()['created_at'].toDate(),
        }
        return fetchedTodo;
    }
    else{
        return null;
    }
    
}

export async function deleteATodo(id){

    const fetchedTodo =  await fetchATodo(id);

    if(fetchedTodo === null){
        return null;
    }


    await deleteDoc(db, "todos", id);
    return fetchedTodo;
    
}

export async function editATodo(id, {title, is_done}){

    const fetchedTodo =  await fetchATodo(id);

    if(fetchedTodo === null){
        return null;
    }

    const todoRef = doc(db, "todos", id);


    await updateDoc(todoRef, {
        title: title,
        is_done: is_done,
    });
    return {
        id: id,
        title: title,
        is_done: is_done,
        created_at: fetchedTodo.created_at,
    };
    
}

module.export = {fetchTodos, addATodo, fetchATodo, deleteATodo, editATodo};
