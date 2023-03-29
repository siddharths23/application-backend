const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dayPlans: [{ type: String }],
});

module.exports = mongoose.model("Destination", destinationSchema);
