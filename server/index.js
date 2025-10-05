const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connecToDB = require("./database");
const router = require("./Routers/routers");
const adminRouter = require("./Routers/adminRouters")
const cookieParser = require('cookie-parser');

dotenv.config()

const PORT = process.env.PORT

const frontendUrl = process.env.frontend_url

const app = express()

app.use(express.urlencoded({ limit: "100mb", extended: true }))
app.use(express.json({limit: "100mb"}))
app.use(cors({
    origin: frontendUrl,
    credentials: true
}))
app.use(cookieParser());
app.use(router)
app.use(adminRouter)

app.get("/", (req, res) => {
    res.send("Hello world");
})

connecToDB().then(() => {

    app.listen(PORT, () => {
        console.log(`Application is running on http://localhost:${PORT}`)
    })
}).catch((error)=>{
    console.log(Error)
})