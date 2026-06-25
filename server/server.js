const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const busRoutes = require("./routes/busRoutes")
const scanRoutes = require("./routes/scanRoutes")
const logRoutes = require("./routes/logRoutes")
const locationRoutes = require("./routes/locationRoutes")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/busQR")
.then(()=>console.log("MongoDB Connected"))

app.use("/bus", busRoutes)
app.use("/scan", scanRoutes)
app.use("/logs", logRoutes)
app.use("/location", locationRoutes)

app.listen(5000,()=>{
console.log("Server running on port 5000")
})