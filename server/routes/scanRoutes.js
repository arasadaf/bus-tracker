const router = require("express").Router()
const {scanBus} = require("../controllers/scanController")

router.post("/",scanBus)

module.exports = router