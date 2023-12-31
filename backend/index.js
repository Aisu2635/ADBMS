import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import authroute from './routes/auth.js';
import userRoute from './routes/users.js';
import postRoute from './routes/posts.js';
import { register } from './control/auth.js';
import { createPost } from './control/posts.js';
import { verifyToken } from './middle/auth.js';
import User from './model/user.js';
import Post from './model/Post.js';
import { users, posts } from './data/index.js';


/* config */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* File storage */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage});

/* Routes with files*/
app.post("/auth/register",upload.single("picture"),register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* Routes */
app.use('/auth', authroute);
app.use("/users", userRoute);
app.use('/posts', postRoute);
/* mongoose */
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log('Server running on port: ' + PORT));
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} connect nahi jhala`));
