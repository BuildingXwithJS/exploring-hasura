import { parseCookies } from 'nookies';
import Users from '../components/Users';

export default function HomePage({ cookies }) {
  return (
    <div className="flex flex-col m-2">
      <Users cookies={cookies} />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  // Parse
  const cookies = parseCookies(ctx);
  return { props: { cookies } };
}
