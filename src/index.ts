import dotenv from "dotenv"
dotenv.config()


import { createServer } from "./server.js";

createServer().listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});