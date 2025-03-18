const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connecToDB = require("./database")
const router = require("./Routers/routers")

dotenv.config()

PORT = process.env.PORT

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(router)

app.get("/:message", (req, res) => {
    res.send(req.params.message)
})

connecToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Application is running on http://localhost:${PORT}`)
    })
}).catch((error)=>{
    console.log(Error)
})