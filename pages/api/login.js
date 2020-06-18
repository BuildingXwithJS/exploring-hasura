import jwt from 'jsonwebtoken';
import cookies from 'connect-cookies';

const cookiesMiddleware = cookies();

const jwtSecret = 'test_jwt_secret_with_a_long_enough_key';

const users = [
  {
    id: '1',
    email: 'test@test.com',
    password: '123',
  },
  {
    id: '2',
    email: 'other@mail.com',
    password: '321',
  },
];

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async (req, res) => {
  const { email, password } = req.body;

  // try to find user
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    res.status(401).json({ error: 'Wrong user or password' });
    return;
  }

  const resposeObject = {
    ...user,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-default-role': 'user',
      'x-hasura-user-email': user.email,
      'x-hasura-user-id': user.id,
    },
  };
  const token = jwt.sign(resposeObject, jwtSecret);

  await runMiddleware(req, res, cookiesMiddleware);

  // saver token to cookies
  res.cookies.set('hasura-token', token);
  res.cookies.set('hasura-user', user.id);

  res.status(200).json({ token });
};
