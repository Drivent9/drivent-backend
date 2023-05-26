import { Router } from 'express';
import { signInGitHub, signInPost } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), signInPost);
authenticationRouter.post('/sign-in/github', signInGitHub);

export { authenticationRouter };
