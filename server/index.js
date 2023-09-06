const express = require('express');
const dotenv = require('dotenv');
dotenv.config('./.env');
const dbConnect = require('./dbConnect');
const authRouter = require('./routers/authRouter');
const morgan = require('morgan');
const postRouter = require('./routers/postRouter');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
//middleware
app.use(express.json());
app.use(morgan('common'));
app.use(cookieParser());
app.use(cors({
    credentials : true,
    origin : 'http://localhost:3000'
}));


app.use('/auth', authRouter);
app.use('/post', postRouter);

// app.get('/', (req, res) => {
//     res.json({
//         status : 'ok'
//     })
// })

const PORT = process.env.PORT || 4000;

dbConnect();

app.listen(PORT, () => {
    console.log('listening to prot: ', PORT);
})