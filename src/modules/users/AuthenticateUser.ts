import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import authConfig from '../../config/auth';
import query from '../../shared/infra/knex/knex';

interface IAuthUser {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

class AuthenticateUser {
  async execute(request: Request, response: Response): Promise<Response> {
    const { email, password }: IAuthUser = request.body;

    const user = await query('users').where({ email }).first();

    if (!user) {
      return response.status(401).json({ error: 'Invalid email or password' });
    }

    const { expiresIn } = authConfig;
    const secret_key: any = authConfig.secretKey;

    const doesPasswordsMatch = await compare(password, user.password_hash);

    if (!doesPasswordsMatch) {
      return response.status(401).json({ error: 'Invalid email or password' });
    }

    const token = sign({ userId: user.id }, secret_key, {
      subject: user.id,
      expiresIn,
    });

    const returnToken: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return response.status(200).json(returnToken);
  }
}

export { AuthenticateUser };
