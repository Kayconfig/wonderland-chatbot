import { Router } from 'express';
import { methodNotAllowed } from '../common/middlewares/unhandled-method';
import { authController } from './auth.controller';
import { clearUnauthorizedCookie } from './middlewares/clear-unauthorized-cookie';
import { validateSigninDto } from './middlewares/signin-dto-validator';
import { validateSignUpDto } from './middlewares/signup-dto.validator';
import { validateAuthentication } from './middlewares/validate-authentication';

export const authRouter = Router();

authRouter.post('/signin', validateSigninDto, authController.signin);
authRouter.post('/signup', validateSignUpDto, authController.signup);
authRouter.get(
    '/is-logged-in',
    validateAuthentication,
    authController.checkIfUserIsValid,
    clearUnauthorizedCookie
);

authRouter.use('/', methodNotAllowed);
