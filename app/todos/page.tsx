import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table";

async function fetchTodosApiCall(){
  await new Promise(f => setTimeout(f, 1000));

  return 10;
}

export default function TodosPage() {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className={title()}>Todos</h1>
      <TodosTable todos={[]}/>
    </div>
  );
}
