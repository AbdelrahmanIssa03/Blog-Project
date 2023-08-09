import express from 'express'
import { Protect } from '../controllers/AuthController';
import { Write_A_Comment } from '../controllers/commentController';
const Router = express.Router();

Router
    .post('/:postID', Protect, Write_A_Comment)

export default Router