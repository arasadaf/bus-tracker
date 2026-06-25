const Bus = require("../models/Bus")

exports.updateLocation = async (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;
  
  try {
    const bus = await Bus.findById(id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.location = { lat, lng };
    bus.lastLocationUpdate = new Date();
    await bus.save();

    res.json({ message: "Location updated", location: bus.location });
  } catch (error) {
    console.error("Location update error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.getAllLocations = async (req, res) => {
  try {
    const buses = await Bus.find({}, 'busNumber route location lastLocationUpdate qrCode');
    res.json(buses);
  } catch (error) {
    console.error("Fetch locations error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
