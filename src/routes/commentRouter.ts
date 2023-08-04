import express from 'express'
import { Protect } from '../controllers/AuthContoller';
import { Write_A_Comment } from '../controllers/commentController';
const Router = express.Router();

Router
    .post('/:user/:postIndex', Protect, Write_A_Comment)

export default Router