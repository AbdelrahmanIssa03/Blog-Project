import express from "express"
import morgan from 'morgan'
import userRouter from './routes/userRoutes'
import postRouter from './routes/postRoutes'
import commentRouter from './routes/commentRouter'
import adminRouter from './routes/adminRouter'

const app = express();
app.use(express.json());

if (process.env.ENV_MODE === "development") {
    app.use(morgan('dev'));
}

app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/admin', adminRouter)

export { app }