const express = require("express")
const router = express.Router()
const { updateLocation, getAllLocations } = require("../controllers/locationController")

router.put("/:id", updateLocation)
router.get("/all", getAllLocations)

module.exports = router
