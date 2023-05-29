import { Request, Response } from 'express';
import httpStatus from 'http-status';
import authenticationService, { SignInParams } from '@/services/authentication-service';
import { exchangeCodeForAcessToken } from '@/utils/exchangeCode';

export async function signInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function signInGitHub(req: Request, res: Response) {
  const { code } = req.body;

  try {
    const userData = await exchangeCodeForAcessToken(code);
    console.log(userData);

    const result = await authenticationService.createToken(userData.id);
    console.log(result);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    console.log(error);

    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}
