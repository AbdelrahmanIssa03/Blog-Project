import express from 'express'
import { SignUp , SignIn, userInformation} from './../controllers/userController'
import { Protect } from '../controllers/AuthController';
const router = express.Router();

router
    .post('/signup', SignUp)
    .post('/signin', SignIn)
    .get('/userInformation', Protect, userInformation)

export default router
