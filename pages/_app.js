import 'tailwindcss/dist/tailwind.min.css';
import { Provider } from 'urql';
import { client } from '../src/client';

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
