const mongoose = require("mongoose")

const busSchema = new mongoose.Schema({
  busNumber: String,
  route: String,
  qrCode: String,
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  lastLocationUpdate: { type: Date, default: null }
})

module.exports = mongoose.model("Bus", busSchema)