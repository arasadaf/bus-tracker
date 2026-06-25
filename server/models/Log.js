const mongoose = require("mongoose")

const logSchema = new mongoose.Schema({
  busId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Bus"
  },
  busNumber: { type: String, required: true },
  route: { type: String, required: true },
  entryTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  exitTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("Log",logSchema)
