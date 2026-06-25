const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const busRoutes = require("./routes/busRoutes")
const scanRoutes = require("./routes/scanRoutes")
const logRoutes = require("./routes/logRoutes")
const locationRoutes = require("./routes/locationRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(cors())
app.use(express.json())

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/busQR"
mongoose.connect(MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err))

app.use("/bus", busRoutes)
app.use("/scan", scanRoutes)
app.use("/logs", logRoutes)
app.use("/location", locationRoutes)
app.use("/auth", authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`)
})