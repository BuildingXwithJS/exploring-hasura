import { useQuery } from 'urql';
import { useMemo } from 'react';

const TodosQuery = `
  query {
    User {
      email
      id
      password
    }
  }
`;

export default function Users({ cookies }) {
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
    []
  );
  const [{ data, fetching, error }] = useQuery({
    query: TodosQuery,
    context,
  });
  if (fetching) return <p>Loading...</p>;
  if (error)
    return (
      <p>
        Oh no... {error.message} {JSON.stringify(cookies)}
      </p>
    );

  return (
    <div className="flex flex-col m-2">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
