import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()
const PORT = process.env.PORT || 7000
const MONGO_DB_URL = process.env.MONGO_DB_URL
if (!MONGO_DB_URL) {
    throw new Error("MONGO_DB_URL is not defined in the environment variables.");
}

const app = express();
// Middleware to parse JSON Bodies-------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}))

// --------------Connect To MongoDB DataBase----------------
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_DB_URL);
        console.log("Connected To Database");    
    }
    catch(error){
        console.log("Failed To Connect To Database " + error);
    }
}

connectDB();

// -----------------User Routes--------------------
import userRoute from "./routes/user"
app.use("/user", userRoute);


// -----------------Data Routes--------------------
import dataRoutes from "./routes/data"
app.use("/data", dataRoutes);




app.get('/', async (req, res) => {
    res.send("Server is running");
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`)
})