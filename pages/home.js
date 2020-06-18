import { parseCookies } from 'nookies';
import Users from '../components/Users';
import Todos from '../components/Todos';

export default function HomePage({ cookies }) {
  return (
    <div className="flex flex-col m-2">
      <Users cookies={cookies} />
      <Todos cookies={cookies} />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  // Parse
  const cookies = parseCookies(ctx);
  return { props: { cookies } };
}
