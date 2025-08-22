import { Router } from 'express';
import { methodNotAllowed } from '../common/middlewares/unhandled-method';
import { authController } from './auth.controller';
import { validateSigninDto } from './middlewares/signin-dto-validator';
import { validateSignUpDto } from './middlewares/signup-dto.validator';

export const authRouter = Router();

authRouter.post('/signin', validateSigninDto, authController.signin);
authRouter.post('/signup', validateSignUpDto, authController.signup);

authRouter.use('/', methodNotAllowed);
