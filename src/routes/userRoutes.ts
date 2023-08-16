import express from 'express'
import { SignUp , SignIn, userInformation, changePass, updateMe, deleteMe} from './../controllers/userController'
import { Protect } from '../controllers/AuthController';
import { multerUploads } from '../utils/multer';
import bodyParser from 'body-parser';
const router = express.Router();

router
    .post('/signup', multerUploads,SignUp)
    .post('/signin', SignIn)
    .get('/userInformation', Protect, userInformation)
    .patch('/changePassword', Protect,changePass)
    .patch('/updateMe', Protect, multerUploads,updateMe)
    .delete('/deleteMe', Protect, deleteMe)

export default router
