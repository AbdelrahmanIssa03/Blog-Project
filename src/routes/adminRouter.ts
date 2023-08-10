import express from 'express'
import { Protect, AdminAuth } from '../controllers/AuthController';
import {viewAllUsersData, deleteUser, changeUserPass, updateUser} from './../controllers/adminController'
const router = express.Router();

router
    .get('/allUsers',Protect,AdminAuth,viewAllUsersData)
    .delete('/deleteAUser/:ID',Protect, AdminAuth, deleteUser)
    .patch('/changePassword/:ID',Protect, AdminAuth, changeUserPass)
    .patch('/updateUser/:ID', Protect, AdminAuth, updateUser)

export default router