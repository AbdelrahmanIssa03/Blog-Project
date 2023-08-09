import express from 'express'
import { SignUp , SignIn, userInformation, changePass, updateMe, deleteMe} from './../controllers/userController'
import { Protect } from '../controllers/AuthController';
const router = express.Router();

router
    .post('/signup', SignUp)
    .post('/signin', SignIn)
    .get('/userInformation', Protect, userInformation)
    .patch('/changePassword', Protect,changePass)
    .patch('/updateMe', Protect, updateMe)
    .delete('/deleteMe', Protect, deleteMe)

export default router
