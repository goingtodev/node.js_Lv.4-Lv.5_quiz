import express from 'express';
import likeRoute from './routes/likes.js';
import authRoute from './routes/auth.js';
import postRoute from './routes/posts.js';
import commentRoute from './routes/comments.js';
import { sequelize } from './model/database.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// json 불러오기
app.use(express.json());

// cookieParser
app.use(cookieParser());

// env
const connection = process.env;

// 미들웨어 연결
app.use('/', likeRoute);
app.use('/', authRoute);
app.use('/posts', postRoute);
app.use('/posts/:postId', commentRoute);

// db연결
sequelize.sync().then(() => {
  console.log(`Server connecting on mysql`);
});

// 서버연결
app.listen(connection.HOST_PORT, () => {
  console.log(`Server listening on port ${connection.HOST_PORT}`);
});
