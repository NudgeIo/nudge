
const express = require('express');
import cors from "cors";
import routes from './routes/routes';
import dotenv from 'dotenv';

dotenv.config();



const app = express();
const PORT = 3001;

app.use(cors())
app.use(express.json())

app.use(routes)


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})


console.log('Hello World');


