const router = require("express").Router()
const Log = require("../models/Log")

router.get("/",async(req,res)=>{
  const logs = await Log.find()
    .populate("busId", "busNumber route qrCode")
    .sort({entryTime: -1})
    .limit(50)
  res.json(logs)
})

module.exports = router
