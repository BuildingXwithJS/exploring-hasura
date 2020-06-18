import { useQuery } from 'urql';
import { useMemo } from 'react';

const UsersQuery = `
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
    [cookies]
  );
  const [{ data, fetching, error }] = useQuery({
    query: UsersQuery,
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
      <h1>Hi {data.User?.[0]?.email ?? 'Unknown'}!</h1>
    </div>
  );
}
