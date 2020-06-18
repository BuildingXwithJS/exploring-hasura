import { useQuery, useMutation } from 'urql';
import { useMemo, useRef, useCallback } from 'react';

const TodosQuery = `
  query {
    Todos {
      text
      completed
      id
      User {
        id
        email
      }
    }
  }
`;

const CreateTodo = `
  mutation CreateTodo($text: String!) {
    insert_Todos(objects: {text: $text}) {
      returning {
        id
        text
        completed
      }
    }
  }
`;

export default function Todos({ cookies }) {
  const context = useMemo(
    () => ({
      fetchOptions: () => {
        const token = cookies['hasura-token'];
        return {
          headers: {
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      },
    }),
    [cookies]
  );
  const [{ data, fetching, error }, reloadTodos] = useQuery({
    query: TodosQuery,
    context,
  });
  const [_createTodoResult, createTodo] = useMutation(CreateTodo);

  const todoRef = useRef();

  const executeCreateTodo = useCallback(async () => {
    const todoText = todoRef.current.value;
    await createTodo({ text: todoText }, context);
    reloadTodos({ requestPolicy: 'network-only' });
  }, []);

  if (fetching) return <p>Loading...</p>;
  if (error)
    return (
      <p>
        Oh no... {error.message} {JSON.stringify(cookies)}
      </p>
    );

  return (
    <div className="flex flex-col m-2">
      <input
        type="text"
        className="my-2 p-1 border border-1 rounded-lg"
        ref={todoRef}
      />
      <button
        className="bg-blue-500 text-white p-2"
        onClick={executeCreateTodo}
      >
        Create
      </button>
      <div className="p-2">
        <h2 className="text-lg font-bold">Todos:</h2>
      </div>
      <div className="flex flex-col">
        {data.Todos.map((todo) => (
          <div key={todo.id}>
            <input type="checkbox" checked={todo.completed} /> {todo.text}
          </div>
        ))}
      </div>{' '}
    </div>
  );
}
