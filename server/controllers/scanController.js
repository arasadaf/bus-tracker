const Log = require("../models/Log")
const Bus = require("../models/Bus")

exports.scanBus = async(req,res)=>{

const timestamp = new Date().toISOString()
console.log(`[${timestamp}] 🔍 SCAN REQUEST: QR=${req.body.qrCode}`)

const {qrCode} = req.body

try{

const bus = await Bus.findOne({qrCode})

if(!bus){
  const errTime = new Date().toISOString()
  console.log(`[${errTime}] ❌ BUS NOT FOUND: QR=${qrCode}`)

  const unknownLog = new Log({
    busNumber: 'UNKNOWN',
    route: 'UNKNOWN',
    entryTime: new Date()
  })
  await unknownLog.save()
  
  return res.json({message:"Bus not found"})
}

const lastLog = await Log.findOne({busId:bus._id}).sort({entryTime:-1})

const now = new Date()

console.log(`[${timestamp}] DEBUG - Last log exitTime: ${lastLog ? lastLog.exitTime : 'no last log'}`)

if(lastLog && !lastLog.exitTime){

  console.log(`[${timestamp}] Updating EXIT for existing log`)
  lastLog.exitTime = now
  await lastLog.save()
  
  const exitTime = now.toLocaleString()
  console.log(`[${timestamp}] 🚪 EXIT: Bus ${bus.busNumber} (${bus.route}) LEFT DEPOT at ${exitTime}`)
  
  return res.json({message:"Exit recorded", type: "exit", bus: bus.busNumber, route: bus.route, time: exitTime})
}

console.log(`[${timestamp}] Creating NEW ENTRY log`)
const newLog = new Log({
  busId: bus._id,
  busNumber: bus.busNumber,
  route: bus.route,
  entryTime: now
})

await newLog.save()

const entryTime = now.toLocaleString()
console.log(`[${timestamp}] 🚍 ENTRY: Bus ${bus.busNumber} (${bus.route}) ENTERED DEPOT at ${entryTime}`)

res.json({message:"Entry recorded", type: "entry", bus: bus.busNumber, route: bus.route, time: entryTime})

}catch(err){

const errTime = new Date().toISOString()
console.log(`[${errTime}] ❌ SCAN ERROR: ${err.message}`)

res.status(500).json({message:"Server error"})

}

}
