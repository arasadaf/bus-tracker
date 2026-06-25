const express = require("express")
const router = express.Router()
const { addBus } = require("../controllers/busController")

router.post("/add", addBus)

module.exports = router