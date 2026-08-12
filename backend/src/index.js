import express from "express"
import "dotenv/config"


const PORT = process.env.PORT;
const app = express();


app.listen(PORT,()=>{
    console.log(`server is now running on http://localhost:${PORT}`);
});

