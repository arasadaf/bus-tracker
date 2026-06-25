const Bus = require("../models/Bus")
const Log = require("../models/Log")

exports.addBus = async (req,res)=>{

try{

const timestamp = new Date().toISOString()
console.log(`[${timestamp}] 🚌 NEW BUS: ${req.body.busNumber} (Route: ${req.body.route}) added to system at ${new Date().toLocaleString()}`)

const { busNumber, route, qrCode } = req.body

const bus = new Bus({
 busNumber,
 route,
 qrCode
})

await bus.save()

// Create initial log entry when bus is added (assumed to be in depot)
const initialLog = new Log({
  busId: bus._id,
  busNumber: busNumber,
  route: route,
  entryTime: new Date()
})

await initialLog.save()

console.log(`[${timestamp}] 📝 INITIAL LOG: Bus ${busNumber} entered depot on registration at ${new Date().toLocaleString()}`)

res.json({message:"Bus added successfully with initial entry log",bus})

}catch(error){

const timestamp = new Date().toISOString()
console.log(`[${timestamp}] ❌ BUS ADD ERROR: ${error.message}`)

res.status(500).json({message:"Error adding bus"})

}

}
