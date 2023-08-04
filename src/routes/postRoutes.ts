import express from 'express'
import { createPost, viewAllPosts, viewUserPosts } from './../controllers/postController';
import { Protect } from '../controllers/AuthContoller';
const router = express.Router();

router
    .get('/',Protect,viewAllPosts)
    .get('/:user',Protect,viewUserPosts)
    .post('/post', Protect,createPost)

export default router