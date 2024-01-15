//require("dotenv").config({ path: "/.env" });
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({ path: "/.env" });

connectDB().then( () => {
    app.on("error", (error) => {
        console.error("ERROR: ",error)
    })

    app.listen(process.env.PORT || 8000, (req, res) => {
        console.log(`Listening on port ${process.env.PORT}`)
    })
}).catch((err) => {
    console.error("MONGODB CONNECTION FAILED:  ",err)
})


/*
import express from "express";
const app = express();
( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", (error) => {
            console.error("ERROR: ",error)
        })

        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`)
        })

    }catch (error){
        console.error("ERROR: ",error)
        throw error
    }
})()

*/