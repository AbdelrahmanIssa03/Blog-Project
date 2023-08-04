import express from 'express'
import { SignUp , SignIn} from './../controllers/userController'
import { Protect } from '../controllers/AuthContoller';
import { userInformation } from './../controllers/userController'
const router = express.Router();

router
    .post('/signup', SignUp)
    .post('/signin', SignIn)
    .get('/userInformation', Protect, userInformation)

export default router
