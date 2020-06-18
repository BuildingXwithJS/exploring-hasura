import Link from 'next/link';
import Router from 'next/router';
import { useRef, useCallback } from 'react';

function LoginPage() {
  const emailRef = useRef();
  const passRef = useRef();

  const doLogin = useCallback(async () => {
    const email = emailRef.current.value;
    const password = passRef.current.value;

    const { token, error } = await fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => res.json());

    if (error || !token) {
      console.error('Error logging in:', error);
      return;
    }

    window.localStorage.setItem('hasura-token', JSON.stringify(token));
    Router.push('/home');
  }, []);

  return (
    <div className="flex flex-col m-2">
      <input
        className="my-2 p-1 border border-1 rounded-lg"
        type="text"
        placeholder="Email"
        ref={emailRef}
      />
      <input
        className="my-2 p-1 border border-1 rounded-lg"
        type="password"
        placeholder="Password"
        ref={passRef}
      />

      <div className="flex flex-1 items-center justify-between">
        <button className="bg-blue-500 text-white p-2" onClick={doLogin}>
          Login
        </button>

        <Link href="/register">
          <a>I don't have an account</a>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
